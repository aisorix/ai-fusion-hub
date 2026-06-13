import { createContext, useContext } from "react";
import { AdminRole, canAdminWrite, isAdminSuper } from "../lib/adminApi";

interface Ctx {
  roles: AdminRole[];
  canWrite: boolean;
  isSuper: boolean;
}

export const AdminRolesContext = createContext<Ctx>({ roles: [], canWrite: false, isSuper: false });

export function useAdminRoles() {
  return useContext(AdminRolesContext);
}

export function buildAdminRolesValue(roles: AdminRole[]): Ctx {
  return { roles, canWrite: canAdminWrite(roles), isSuper: isAdminSuper(roles) };
}
