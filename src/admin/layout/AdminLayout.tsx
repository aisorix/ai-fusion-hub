import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, Users, Cpu, DollarSign, FileText, Headphones,
  Settings, ChevronLeft, ChevronRight, LogOut, Bell, Shield, Database, Megaphone, Sun, Moon,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { useAdminRoles } from "../hooks/useAdminRoles";
import DateRangePicker from "../components/DateRangePicker";
import { AdminRole } from "../lib/adminApi";

type NavItem = { to: string; icon: any; label: string; minRole?: "viewer" | "manager" | "super" };
type NavGroup = { label: string; items: NavItem[] };

const groups: NavGroup[] = [
  { label: "OVERVIEW", items: [
    { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  ]},
  { label: "USERS", items: [
    { to: "/admin/users", icon: Users, label: "All Users" },
  ]},
  { label: "AI MONITOR", items: [
    { to: "/admin/ai/usage", icon: Cpu, label: "Feature Usage" },
    { to: "/admin/ai/tokens", icon: Cpu, label: "Token Usage" },
    { to: "/admin/ai/live", icon: Cpu, label: "Live Feed" },
  ]},
  { label: "REVENUE", items: [
    { to: "/admin/revenue", icon: DollarSign, label: "Overview" },
    { to: "/admin/revenue/subscriptions", icon: DollarSign, label: "Subscriptions" },
    { to: "/admin/revenue/invoices", icon: FileText, label: "Invoices" },
    { to: "/admin/revenue/coupons", icon: FileText, label: "Coupons", minRole: "manager" },
  ]},
  { label: "CONTENT", items: [
    { to: "/admin/content/flags", icon: FileText, label: "Feature Flags", minRole: "manager" },
    { to: "/admin/content/announcements", icon: FileText, label: "Announcements", minRole: "manager" },
    { to: "/admin/content/prompts", icon: FileText, label: "Prompt Templates", minRole: "manager" },
  ]},
  { label: "COMMUNICATIONS", items: [
    { to: "/admin/broadcasts", icon: Megaphone, label: "Broadcasts", minRole: "manager" },
  ]},
  { label: "SUPPORT", items: [
    { to: "/admin/chat", icon: Headphones, label: "Live Chat" },
    { to: "/admin/support/tickets", icon: Headphones, label: "Tickets", minRole: "manager" },
    { to: "/admin/feedback", icon: Headphones, label: "Feedback / NPS" },
  ]},
  { label: "DATA", items: [
    { to: "/admin/database", icon: Database, label: "Database" },
  ]},
  { label: "SYSTEM", items: [
    { to: "/admin/system/health", icon: Shield, label: "Health" },
    { to: "/admin/system/api-keys", icon: Shield, label: "API Keys", minRole: "super" },
    { to: "/admin/audit", icon: Shield, label: "Audit Log" },
    { to: "/admin/settings", icon: Settings, label: "Settings", minRole: "super" },
  ]},
];

function allowed(item: NavItem, canWrite: boolean, isSuper: boolean) {
  if (!item.minRole) return true;
  if (item.minRole === "viewer") return true;
  if (item.minRole === "manager") return canWrite;
  if (item.minRole === "super") return isSuper;
  return true;
}

function ThemeToggleBtn() {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));
  const toggle = () => {
    const root = document.documentElement;
    const next = !root.classList.contains("dark");
    root.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setIsDark(next);
  };
  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme" className="h-9 w-9">
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </Button>
  );
}

export default function AdminLayout() {
  const { signOut, user } = useAuth();
  const { canWrite, isSuper } = useAdminRoles();
  const nav = useNavigate();
  const loc = useLocation();
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem("aisorix-admin-collapsed") === "1");

  useEffect(() => {
    localStorage.setItem("aisorix-admin-collapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  const pageTitle = loc.pathname.split("/").filter(Boolean).slice(1).map((s) => s[0].toUpperCase() + s.slice(1)).join(" › ") || "Dashboard";

  return (
    <div data-admin-theme className="min-h-screen flex bg-background text-foreground">
      <aside
        className={`fixed top-0 left-0 h-screen flex flex-col transition-all duration-200 z-40 admin-sidebar ${collapsed ? "w-16" : "w-60"}`}
      >
        <div className="h-16 flex items-center justify-between px-3 border-b border-[hsl(var(--admin-sidebar-border))]">
          {!collapsed && (
            <div className="flex items-center gap-1.5">
              <img src={logo} alt="AI Sorix" className="w-9 h-9 object-contain" />
              <div className="leading-tight">
                <div className="text-sm font-bold admin-sidebar-fg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>AI Sorix</div>
                <div className="text-[10px] admin-sidebar-fg/70 uppercase tracking-wider opacity-70">Admin</div>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="p-1.5 rounded admin-sidebar-hover admin-sidebar-fg"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
          {groups.map((g) => {
            const visible = g.items.filter((i) => allowed(i, canWrite, isSuper));
            if (visible.length === 0) return null;
            return (
              <div key={g.label}>
                {!collapsed && <div className="px-2 mb-1 text-[10px] font-semibold admin-sidebar-fg opacity-60 tracking-wider">{g.label}</div>}
                <div className="space-y-0.5">
                  {visible.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-2.5 py-2 rounded-md text-sm transition-colors admin-sidebar-fg ${
                          isActive
                            ? "admin-sidebar-active font-medium"
                            : "opacity-80 admin-sidebar-hover"
                        }`
                      }
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="border-t border-[hsl(var(--admin-sidebar-border))] p-3">
          <button
            onClick={async () => { await signOut(); nav("/admin/login"); }}
            className="w-full flex items-center gap-2 px-2 py-2 text-sm admin-sidebar-fg opacity-80 admin-sidebar-hover rounded-md"
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      <div className={`flex-1 flex flex-col transition-all ${collapsed ? "ml-16" : "ml-60"}`}>
        <header className="h-16 bg-card border-b border-border flex items-center px-6 gap-3 sticky top-0 z-30">
          <div className="flex-1">
            <h1 className="text-base font-semibold text-foreground">{pageTitle}</h1>
          </div>
          <DateRangePicker />
          <ThemeToggleBtn />
          <Button variant="ghost" size="icon"><Bell className="w-5 h-5" /></Button>
          <div className="text-xs text-muted-foreground hidden sm:block">{user?.email}</div>
        </header>
        <main className="flex-1 p-6 overflow-x-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
