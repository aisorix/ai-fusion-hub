
REVOKE EXECUTE ON FUNCTION public.increment_imagine_free_render() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.request_account_deletion(text, text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.recover_account() FROM anon, public;
GRANT EXECUTE ON FUNCTION public.increment_imagine_free_render() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.request_account_deletion(text, text) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.recover_account() TO authenticated, service_role;
