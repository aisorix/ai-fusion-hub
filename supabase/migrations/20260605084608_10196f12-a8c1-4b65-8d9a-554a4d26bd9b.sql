
-- 1. Guest token column (random per-guest secret stored in their browser)
ALTER TABLE public.chat_conversations
  ADD COLUMN IF NOT EXISTS guest_token text;

CREATE UNIQUE INDEX IF NOT EXISTS idx_chat_conversations_guest_token
  ON public.chat_conversations(guest_token)
  WHERE guest_token IS NOT NULL;

-- 2. Allow anon to insert a strictly-shaped guest conversation
GRANT INSERT, SELECT ON public.chat_conversations TO anon;

CREATE POLICY "Guests can create their own conversation"
ON public.chat_conversations
FOR INSERT
TO anon
WITH CHECK (
  user_id IS NULL
  AND assigned_employee_id IS NULL
  AND status = 'waiting'
  AND guest_name IS NOT NULL AND char_length(btrim(guest_name)) BETWEEN 1 AND 100
  AND guest_email IS NOT NULL AND guest_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  AND guest_token IS NOT NULL AND char_length(guest_token) BETWEEN 24 AND 128
);

-- 3. Security-definer helpers scoped by the guest's secret token
CREATE OR REPLACE FUNCTION public.get_guest_conversation(_token text)
RETURNS SETOF public.chat_conversations
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT * FROM public.chat_conversations
  WHERE guest_token = _token AND user_id IS NULL
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.get_guest_messages(_token text)
RETURNS SETOF public.chat_messages
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT m.*
  FROM public.chat_messages m
  JOIN public.chat_conversations c ON c.id = m.conversation_id
  WHERE c.guest_token = _token AND c.user_id IS NULL
  ORDER BY m.created_at ASC;
$$;

CREATE OR REPLACE FUNCTION public.send_guest_message(
  _token text,
  _content text,
  _sender_type text DEFAULT 'user'
)
RETURNS public.chat_messages
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  _conv_id uuid;
  _msg public.chat_messages;
BEGIN
  IF _sender_type NOT IN ('user','employee') THEN
    RAISE EXCEPTION 'invalid sender_type';
  END IF;
  IF _content IS NULL OR char_length(btrim(_content)) = 0 OR char_length(_content) > 4000 THEN
    RAISE EXCEPTION 'invalid content';
  END IF;

  SELECT id INTO _conv_id
  FROM public.chat_conversations
  WHERE guest_token = _token AND user_id IS NULL
  LIMIT 1;

  IF _conv_id IS NULL THEN
    RAISE EXCEPTION 'conversation not found';
  END IF;

  INSERT INTO public.chat_messages (conversation_id, sender_id, sender_type, content, is_read)
  VALUES (_conv_id, NULL, _sender_type, _content, _sender_type = 'user')
  RETURNING * INTO _msg;

  UPDATE public.chat_conversations
  SET last_message_at = now(), updated_at = now()
  WHERE id = _conv_id;

  RETURN _msg;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.get_guest_conversation(text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_guest_messages(text)     FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.send_guest_message(text, text, text) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.get_guest_conversation(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_guest_messages(text)     TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.send_guest_message(text, text, text) TO anon, authenticated;
