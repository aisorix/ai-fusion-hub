import { ReactNode } from "react";
import { useAdminRoles } from "../hooks/useAdminRoles";
import { AdminRole } from "../lib/adminApi";

interface Props {
  roles?: AdminRole[];               // any of these roles allows render
  mode?: "write" | "super";          // shortcut: write = manager+, super = super+
  fallback?: ReactNode;
  children: ReactNode;
}

export default function RoleGate({ roles, mode, fallback = null, children }: Props) {
  const { roles: have, canWrite, isSuper } = useAdminRoles();
  if (mode === "super") return isSuper ? <>{children}</> : <>{fallback}</>;
  if (mode === "write") return canWrite ? <>{children}</> : <>{fallback}</>;
  if (!roles || roles.length === 0) return <>{children}</>;
  return have.some(r => roles.includes(r)) ? <>{children}</> : <>{fallback}</>;
}
