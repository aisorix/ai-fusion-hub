// Agent tool definitions + executors for Sorix Agent.
// All executors run server-side using stored user_connections tokens.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { getValidGoogleToken } from "./googleTokens.ts";

export type ToolResult = { ok: true; data: any } | { ok: false; error: string; hint?: string };

// ---------------- OpenRouter tool schemas ----------------
export const TOOL_SCHEMAS = [
  {
    type: "function",
    function: {
      name: "telegram_send_message",
      description:
        "Send a Telegram message via the user's connected bot. You can specify chat_id directly OR a chat_query (a name or username). If chat_query is given, the tool will look up recent chats and send to the best match.",
      parameters: {
        type: "object",
        properties: {
          text: { type: "string", description: "The message body to send." },
          chat_id: { type: "string", description: "Numeric Telegram chat id, if known." },
          chat_query: { type: "string", description: "A name, first name, last name or @username to look up among recent bot conversations." },
        },
        required: ["text"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "telegram_list_recent_chats",
      description: "List recent users/groups that have messaged the user's Telegram bot. Use to help the user pick a recipient.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "gmail_send_email",
      description: "Send an email through the user's connected Gmail account.",
      parameters: {
        type: "object",
        properties: {
          to: { type: "string", description: "Recipient email address." },
          subject: { type: "string" },
          body: { type: "string", description: "Plain text body. Markdown is fine; will be sent as text/plain." },
        },
        required: ["to", "subject", "body"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "gmail_list_recent",
      description: "List the most recent inbox emails (subject + from + snippet).",
      parameters: {
        type: "object",
        properties: { max: { type: "number", description: "Max emails (default 10, max 25)." } },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "calendar_create_event",
      description: "Create an event on the user's primary Google Calendar.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          start: { type: "string", description: "ISO 8601 start datetime, e.g. 2026-05-03T15:00:00+06:00." },
          end: { type: "string", description: "ISO 8601 end datetime." },
          description: { type: "string" },
          attendees: { type: "array", items: { type: "string" }, description: "Attendee emails." },
        },
        required: ["title", "start", "end"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "calendar_list_upcoming",
      description: "List the next upcoming events on the user's primary calendar.",
      parameters: {
        type: "object",
        properties: { max: { type: "number", description: "Default 10, max 25." } },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "drive_list_files",
      description: "List recent Google Drive files. Optional search query.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Optional Drive search query, e.g. \"name contains 'invoice'\"." },
          max: { type: "number" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "facebook_page_post",
      description: "Publish a post to the user's connected Facebook Page.",
      parameters: {
        type: "object",
        properties: {
          message: { type: "string" },
          link: { type: "string", description: "Optional URL to attach." },
        },
        required: ["message"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "linkedin_create_post",
      description: "Publish a text post on the user's LinkedIn account/page.",
      parameters: {
        type: "object",
        properties: { text: { type: "string" } },
        required: ["text"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "whatsapp_send_message",
      description: "Send a WhatsApp text message via the user's connected WhatsApp Business Cloud API.",
      parameters: {
        type: "object",
        properties: {
          to: { type: "string", description: "Recipient phone number in international format, no '+' (e.g. 8801712345678)." },
          text: { type: "string" },
        },
        required: ["to", "text"],
      },
    },
  },
];

// ---------------- helpers ----------------
function admin() {
  return createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
}

async function getConnection(userId: string, service: string) {
  const { data } = await admin()
    .from("user_connections")
    .select("access_token, refresh_token, metadata, external_account_id, expires_at")
    .eq("user_id", userId)
    .eq("service", service)
    .maybeSingle();
  return data;
}

function notConnected(service: string): ToolResult {
  return {
    ok: false,
    error: `${service}_not_connected`,
    hint: `The user hasn't connected ${service} yet. Tell them briefly to open Connections (/agent/connections) and link ${service}.`,
  };
}

// ---------------- Telegram ----------------
async function telegramApi(token: string, method: string, body?: Record<string, unknown>) {
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

async function telegramSend(userId: string, args: any): Promise<ToolResult> {
  const conn = await getConnection(userId, "telegram");
  if (!conn?.access_token) return notConnected("telegram");
  const token = conn.access_token;

  let chatId = args.chat_id as string | number | undefined;

  if (!chatId && args.chat_query) {
    // Look up recent chats via getUpdates
    const updates = await telegramApi(token, "getUpdates", { limit: 100, offset: -100 });
    const chats = new Map<number, { name: string; username?: string }>();
    if (updates?.ok && Array.isArray(updates.result)) {
      for (const u of updates.result) {
        const c = u?.message?.chat ?? u?.edited_message?.chat;
        if (!c) continue;
        const name = (c.title || `${c.first_name ?? ""} ${c.last_name ?? ""}`).trim();
        chats.set(c.id, { name, username: c.username });
      }
    }
    const q = String(args.chat_query).toLowerCase().trim();
    let match: number | null = null;
    for (const [id, info] of chats) {
      const hay = `${info.name} ${info.username ?? ""}`.toLowerCase();
      if (hay.includes(q)) { match = id; break; }
    }
    if (!match) {
      return {
        ok: false,
        error: "telegram_recipient_not_found",
        hint: `No recent Telegram chat matched "${args.chat_query}". The bot can only message users who messaged it first. Ask the user to send /start to the bot, or provide a chat_id.`,
      };
    }
    chatId = match;
  }

  if (!chatId) return { ok: false, error: "missing_chat", hint: "Provide chat_id or chat_query." };

  const result = await telegramApi(token, "sendMessage", { chat_id: chatId, text: args.text });
  if (!result?.ok) return { ok: false, error: "telegram_send_failed", hint: result?.description || "Telegram API error" };
  return { ok: true, data: { chat_id: chatId, message_id: result.result?.message_id } };
}

async function telegramListChats(userId: string): Promise<ToolResult> {
  const conn = await getConnection(userId, "telegram");
  if (!conn?.access_token) return notConnected("telegram");
  const updates = await telegramApi(conn.access_token, "getUpdates", { limit: 100, offset: -100 });
  const chats = new Map<number, { name: string; username?: string }>();
  if (updates?.ok && Array.isArray(updates.result)) {
    for (const u of updates.result) {
      const c = u?.message?.chat ?? u?.edited_message?.chat;
      if (!c) continue;
      chats.set(c.id, {
        name: (c.title || `${c.first_name ?? ""} ${c.last_name ?? ""}`).trim() || String(c.id),
        username: c.username,
      });
    }
  }
  return { ok: true, data: { chats: [...chats.entries()].map(([id, info]) => ({ id, ...info })) } };
}

// ---------------- Gmail ----------------
function b64url(s: string) {
  // UTF-8 safe base64url
  const utf8 = new TextEncoder().encode(s);
  let bin = "";
  utf8.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function gmailSend(userId: string, args: any): Promise<ToolResult> {
  const { token, error } = await getValidGoogleToken(userId, "gmail");
  if (error || !token) return notConnected("google_gmail");
  const raw = b64url(
    [
      `To: ${args.to}`,
      `Subject: ${args.subject}`,
      `Content-Type: text/plain; charset=UTF-8`,
      "",
      args.body,
    ].join("\r\n"),
  );
  const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ raw }),
  });
  const json = await res.json();
  if (!res.ok) return { ok: false, error: "gmail_send_failed", hint: JSON.stringify(json).slice(0, 300) };
  return { ok: true, data: { id: json.id } };
}

async function gmailListRecent(userId: string, args: any): Promise<ToolResult> {
  const { token, error } = await getValidGoogleToken(userId, "gmail");
  if (error || !token) return notConnected("google_gmail");
  const max = Math.min(Math.max(Number(args.max) || 10, 1), 25);
  const list = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${max}&q=in:inbox`,
    { headers: { Authorization: `Bearer ${token}` } },
  ).then((r) => r.json());
  if (!list?.messages) return { ok: true, data: { emails: [] } };
  const emails = await Promise.all(
    list.messages.slice(0, max).map(async (m: any) => {
      const detail = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${m.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From`,
        { headers: { Authorization: `Bearer ${token}` } },
      ).then((r) => r.json());
      const headers = detail?.payload?.headers ?? [];
      const get = (n: string) => headers.find((h: any) => h.name === n)?.value;
      return { id: m.id, from: get("From"), subject: get("Subject"), snippet: detail?.snippet };
    }),
  );
  return { ok: true, data: { emails } };
}

// ---------------- Calendar ----------------
async function calendarCreate(userId: string, args: any): Promise<ToolResult> {
  const { token, error } = await getValidGoogleToken(userId, "calendar");
  if (error || !token) return notConnected("google_calendar");
  const body = {
    summary: args.title,
    description: args.description,
    start: { dateTime: args.start },
    end: { dateTime: args.end },
    attendees: Array.isArray(args.attendees) ? args.attendees.map((email: string) => ({ email })) : undefined,
  };
  const res = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) return { ok: false, error: "calendar_create_failed", hint: JSON.stringify(json).slice(0, 300) };
  return { ok: true, data: { id: json.id, htmlLink: json.htmlLink } };
}

async function calendarList(userId: string, args: any): Promise<ToolResult> {
  const { token, error } = await getValidGoogleToken(userId, "calendar");
  if (error || !token) return notConnected("google_calendar");
  const max = Math.min(Math.max(Number(args.max) || 10, 1), 25);
  const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=${max}&orderBy=startTime&singleEvents=true&timeMin=${encodeURIComponent(new Date().toISOString())}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const json = await res.json();
  if (!res.ok) return { ok: false, error: "calendar_list_failed", hint: JSON.stringify(json).slice(0, 300) };
  return {
    ok: true,
    data: {
      events: (json.items ?? []).map((e: any) => ({
        title: e.summary,
        start: e.start?.dateTime ?? e.start?.date,
        end: e.end?.dateTime ?? e.end?.date,
        link: e.htmlLink,
      })),
    },
  };
}

// ---------------- Drive ----------------
async function driveList(userId: string, args: any): Promise<ToolResult> {
  const { token, error } = await getValidGoogleToken(userId, "drive");
  if (error || !token) return notConnected("google_drive");
  const max = Math.min(Math.max(Number(args.max) || 15, 1), 50);
  const params = new URLSearchParams({
    pageSize: String(max),
    fields: "files(id,name,mimeType,modifiedTime,webViewLink)",
    orderBy: "modifiedTime desc",
  });
  if (args.query) params.set("q", String(args.query));
  const res = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!res.ok) return { ok: false, error: "drive_list_failed", hint: JSON.stringify(json).slice(0, 300) };
  return { ok: true, data: { files: json.files ?? [] } };
}

// ---------------- Facebook Page ----------------
async function facebookPost(userId: string, args: any): Promise<ToolResult> {
  const conn = await getConnection(userId, "facebook");
  if (!conn?.access_token) return notConnected("facebook");
  const pageId = (conn.metadata as any)?.page_id || conn.external_account_id;
  if (!pageId) return { ok: false, error: "facebook_missing_page_id", hint: "Reconnect Facebook with a Page ID." };

  const body = new URLSearchParams({ message: args.message, access_token: conn.access_token });
  if (args.link) body.set("link", args.link);
  const res = await fetch(`https://graph.facebook.com/v20.0/${pageId}/feed`, {
    method: "POST",
    body,
  });
  const json = await res.json();
  if (!res.ok) return { ok: false, error: "facebook_post_failed", hint: JSON.stringify(json).slice(0, 300) };
  return { ok: true, data: { id: json.id } };
}

// ---------------- LinkedIn ----------------
async function linkedinPost(userId: string, args: any): Promise<ToolResult> {
  const conn = await getConnection(userId, "linkedin");
  if (!conn?.access_token) return notConnected("linkedin");
  const author = (conn.metadata as any)?.author_urn;
  if (!author) return { ok: false, error: "linkedin_missing_urn", hint: "Reconnect LinkedIn with an Author URN." };

  const res = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${conn.access_token}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify({
      author,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text: args.text },
          shareMediaCategory: "NONE",
        },
      },
      visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
    }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) return { ok: false, error: "linkedin_post_failed", hint: JSON.stringify(json).slice(0, 300) };
  return { ok: true, data: { id: json.id } };
}

// ---------------- WhatsApp ----------------
async function whatsappSend(userId: string, args: any): Promise<ToolResult> {
  const conn = await getConnection(userId, "whatsapp");
  if (!conn?.access_token) return notConnected("whatsapp");
  const phoneId = (conn.metadata as any)?.phone_number_id;
  if (!phoneId) return { ok: false, error: "whatsapp_missing_phone_id", hint: "Reconnect WhatsApp with a Phone Number ID." };

  const res = await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${conn.access_token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: String(args.to).replace(/^\+/, ""),
      type: "text",
      text: { body: args.text },
    }),
  });
  const json = await res.json();
  if (!res.ok) return { ok: false, error: "whatsapp_send_failed", hint: JSON.stringify(json).slice(0, 300) };
  return { ok: true, data: { id: json.messages?.[0]?.id } };
}

// ---------------- Dispatcher ----------------
export async function executeTool(name: string, args: any, userId: string): Promise<ToolResult> {
  try {
    switch (name) {
      case "telegram_send_message": return await telegramSend(userId, args);
      case "telegram_list_recent_chats": return await telegramListChats(userId);
      case "gmail_send_email": return await gmailSend(userId, args);
      case "gmail_list_recent": return await gmailListRecent(userId, args);
      case "calendar_create_event": return await calendarCreate(userId, args);
      case "calendar_list_upcoming": return await calendarList(userId, args);
      case "drive_list_files": return await driveList(userId, args);
      case "facebook_page_post": return await facebookPost(userId, args);
      case "linkedin_create_post": return await linkedinPost(userId, args);
      case "whatsapp_send_message": return await whatsappSend(userId, args);
      default: return { ok: false, error: "unknown_tool", hint: name };
    }
  } catch (e) {
    return { ok: false, error: "tool_exception", hint: String(e instanceof Error ? e.message : e) };
  }
}

// Tool name -> friendly label/description for UI Task Monitor
export const TOOL_UI: Record<string, { title: string; description: string; steps: string[] }> = {
  telegram_send_message: { title: "Sending Telegram message", description: "Delivering message via your bot", steps: ["Resolve recipient", "Send message"] },
  telegram_list_recent_chats: { title: "Looking up Telegram chats", description: "Finding recent recipients", steps: ["Fetch updates"] },
  gmail_send_email: { title: "Sending email", description: "Sending via Gmail", steps: ["Compose", "Send"] },
  gmail_list_recent: { title: "Reading inbox", description: "Fetching recent emails", steps: ["List", "Fetch details"] },
  calendar_create_event: { title: "Creating calendar event", description: "Adding to your primary calendar", steps: ["Create event"] },
  calendar_list_upcoming: { title: "Reading calendar", description: "Fetching upcoming events", steps: ["List events"] },
  drive_list_files: { title: "Searching Drive", description: "Listing recent files", steps: ["Query Drive"] },
  facebook_page_post: { title: "Posting to Facebook", description: "Publishing on your Page", steps: ["Publish post"] },
  linkedin_create_post: { title: "Posting on LinkedIn", description: "Publishing your post", steps: ["Publish post"] },
  whatsapp_send_message: { title: "Sending WhatsApp message", description: "Delivering via WhatsApp Cloud API", steps: ["Send message"] },
};
