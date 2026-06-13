import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { fetchAdminRoles, isAdminEmail, type AdminRole } from "../lib/adminApi";
import { Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AdminRolesContext, buildAdminRolesValue } from "../hooks/useAdminRoles";
import { AdminRangeProvider } from "../context/AdminRangeContext";

interface Props {
  children: React.ReactNode;
  required?: "viewer" | "manager" | "super";
}

export default function AdminGuard({ children, required = "viewer" }: Props) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [roles, setRoles] = useState<AdminRole[] | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!user) { setChecking(false); return; }
    fetchAdminRoles(user.id).then((r) => { setRoles(r); setChecking(false); });
  }, [user]);

  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to={`/admin/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;

  const okEmail = isAdminEmail(user.email);
  const okRole = (roles ?? []).length > 0;

  if (!okEmail || !okRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
        <div className="max-w-md w-full text-center space-y-6 p-8 rounded-2xl bg-card border border-border">
          <ShieldAlert className="w-12 h-12 mx-auto text-amber-500" />
          <div>
            <h1 className="text-2xl font-bold">Admin Portal — Restricted</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {okEmail ? "Your account does not have admin permissions." : "This portal is restricted to @aisorix.com accounts."}
            </p>
          </div>
          <div className="flex gap-2 justify-center">
            <Button asChild variant="secondary"><Link to="/">Back to App</Link></Button>
            <Button asChild variant="outline"><Link to="/admin/login">Switch Account</Link></Button>
          </div>
        </div>
      </div>
    );
  }

  const ctx = buildAdminRolesValue(roles!);
  if (required === "manager" && !ctx.canWrite) return <Forbidden />;
  if (required === "super" && !ctx.isSuper) return <Forbidden />;

  return (
    <AdminRolesContext.Provider value={ctx}>
      <AdminRangeProvider>
        {children}
      </AdminRangeProvider>
    </AdminRolesContext.Provider>
  );
}

function Forbidden() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <div className="max-w-md w-full text-center space-y-6 p-8 rounded-2xl bg-card border border-border">
        <ShieldAlert className="w-12 h-12 mx-auto text-amber-500" />
        <div>
          <h1 className="text-2xl font-bold">Insufficient permissions</h1>
          <p className="mt-2 text-sm text-muted-foreground">Your admin role does not allow access to this page.</p>
        </div>
        <Button asChild variant="secondary"><Link to="/admin/dashboard">Back to Dashboard</Link></Button>
      </div>
    </div>
  );
}
