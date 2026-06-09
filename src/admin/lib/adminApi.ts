import { supabase } from "@/integrations/supabase/client";

export type AdminRole = "admin" | "admin_super" | "admin_manager" | "admin_viewer";

export async function fetchAdminRoles(userId: string): Promise<AdminRole[]> {
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  const valid = new Set(["admin", "admin_super", "admin_manager", "admin_viewer"]);
  return (data ?? []).map((r: any) => r.role).filter((r: string) => valid.has(r)) as AdminRole[];
}

export function isAdminEmail(email: string | null | undefined) {
  return !!email && email.toLowerCase().endsWith("@aisorix.com");
}

export function canAdminWrite(roles: AdminRole[]) {
  return roles.some((r) => r === "admin" || r === "admin_super" || r === "admin_manager");
}
export function isAdminSuper(roles: AdminRole[]) {
  return roles.some((r) => r === "admin" || r === "admin_super");
}

export async function invokeAdmin<T = any>(fn: string, body?: unknown): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error("Not authenticated");
  const { data, error } = await supabase.functions.invoke(fn, {
    body: body ?? {},
    headers: { Authorization: `Bearer ${session.access_token}` },
  });
  if (error) throw error;
  if ((data as any)?.error) throw new Error((data as any).error);
  return data as T;
}
