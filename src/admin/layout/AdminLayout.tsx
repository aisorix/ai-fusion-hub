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
    { to: "/admin/content/workshops", icon: FileText, label: "Workshops", minRole: "manager" },
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
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("aisorix-admin-collapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  // Close mobile drawer on route change
  useEffect(() => { setMobileOpen(false); }, [loc.pathname]);

  const pageTitle = loc.pathname.split("/").filter(Boolean).slice(1).map((s) => s[0].toUpperCase() + s.slice(1)).join(" › ") || "Dashboard";

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      <div className="h-16 flex items-center justify-between px-3 border-b border-[hsl(var(--admin-sidebar-border))]">
        {(!collapsed || mobile) && (
          <div className="flex items-center gap-1.5">
            <img src={logo} alt="AI Sorix" className="w-9 h-9 object-contain" />
            <div className="leading-tight">
              <div className="text-sm font-bold admin-sidebar-fg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>AI Sorix</div>
              <div className="text-[10px] admin-sidebar-fg/70 uppercase tracking-wider opacity-70">Admin</div>
            </div>
          </div>
        )}
        {!mobile && (
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="p-1.5 rounded admin-sidebar-hover admin-sidebar-fg hidden lg:block"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
        {mobile && (
          <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded admin-sidebar-hover admin-sidebar-fg" aria-label="Close menu">
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {groups.map((g) => {
          const visible = g.items.filter((i) => allowed(i, canWrite, isSuper));
          if (visible.length === 0) return null;
          return (
            <div key={g.label}>
              {(!collapsed || mobile) && <div className="px-2 mb-1 text-[10px] font-semibold admin-sidebar-fg opacity-60 tracking-wider">{g.label}</div>}
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
                    {(!collapsed || mobile) && <span className="truncate">{item.label}</span>}
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
          {(!collapsed || mobile) && <span>Sign out</span>}
        </button>
      </div>
    </>
  );

  return (
    <div data-admin-theme className="min-h-screen flex bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen flex-col transition-all duration-200 z-40 admin-sidebar hidden lg:flex ${collapsed ? "w-16" : "w-60"}`}
      >
        <Sidebar />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
          <aside className="fixed top-0 left-0 h-screen w-64 flex flex-col z-50 admin-sidebar lg:hidden animate-in slide-in-from-left">
            <Sidebar mobile />
          </aside>
        </>
      )}

      <div className={`flex-1 flex flex-col transition-all ${collapsed ? "lg:ml-16" : "lg:ml-60"}`}>
        <header className="h-16 bg-card border-b border-border flex items-center px-3 sm:px-6 gap-2 sm:gap-3 sticky top-0 z-30">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 -ml-1 rounded hover:bg-muted text-foreground"
            aria-label="Open menu"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm sm:text-base font-semibold text-foreground truncate">{pageTitle}</h1>
          </div>
          <div className="hidden sm:block"><DateRangePicker /></div>
          <ThemeToggleBtn />
          <Button variant="ghost" size="icon" className="hidden sm:inline-flex"><Bell className="w-5 h-5" /></Button>
          <div className="text-xs text-muted-foreground hidden md:block truncate max-w-[140px]">{user?.email}</div>
        </header>
        <main className="flex-1 p-3 sm:p-6 overflow-x-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

