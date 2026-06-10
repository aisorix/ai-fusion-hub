import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, Users, Cpu, DollarSign, FileText, Headphones,
  Settings, ChevronLeft, ChevronRight, LogOut, Bell, Search, Shield,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const groups = [
  { label: "OVERVIEW", items: [{ to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" }] },
  { label: "USERS", items: [{ to: "/admin/users", icon: Users, label: "All Users" }] },
  { label: "AI MONITOR", items: [
    { to: "/admin/ai/usage", icon: Cpu, label: "Feature Usage" },
    { to: "/admin/ai/tokens", icon: Cpu, label: "Token Usage" },
    { to: "/admin/ai/live", icon: Cpu, label: "Live Feed" },
  ]},
  { label: "REVENUE", items: [
    { to: "/admin/revenue", icon: DollarSign, label: "Overview" },
    { to: "/admin/revenue/subscriptions", icon: DollarSign, label: "Subscriptions" },
    { to: "/admin/revenue/invoices", icon: FileText, label: "Invoices" },
    { to: "/admin/revenue/coupons", icon: FileText, label: "Coupons" },
  ]},
  { label: "CONTENT", items: [
    { to: "/admin/content/flags", icon: FileText, label: "Feature Flags" },
    { to: "/admin/content/announcements", icon: FileText, label: "Announcements" },
  ]},
  { label: "SUPPORT", items: [
    { to: "/admin/chat", icon: Headphones, label: "Live Chat" },
    { to: "/admin/support/tickets", icon: Headphones, label: "Tickets" },
  ]},
  { label: "SYSTEM", items: [
    { to: "/admin/system/health", icon: Shield, label: "Health" },
    { to: "/admin/audit", icon: Shield, label: "Audit Log" },
    { to: "/admin/settings", icon: Settings, label: "Settings" },
  ]},
];

export default function AdminLayout() {
  const { signOut, user } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem("aisorix-admin-collapsed") === "1");

  useEffect(() => {
    localStorage.setItem("aisorix-admin-collapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  const pageTitle = loc.pathname.split("/").filter(Boolean).slice(1).map((s) => s[0].toUpperCase() + s.slice(1)).join(" › ") || "Dashboard";

  return (
    <div data-admin-theme className="min-h-screen flex bg-slate-50 text-slate-900">
      <aside
        className={`fixed top-0 left-0 h-screen bg-[#0A1628] text-slate-100 flex flex-col transition-all duration-200 z-40 ${collapsed ? "w-16" : "w-60"}`}
      >
        <div className="h-16 flex items-center justify-between px-3 border-b border-white/5">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1A6FD8] to-[#00B4D8] flex items-center justify-center font-bold">A</div>
              <div className="leading-tight">
                <div className="text-sm font-semibold">AI Sorix</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Admin</div>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="p-1.5 rounded hover:bg-white/5 text-slate-300"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
          {groups.map((g) => (
            <div key={g.label}>
              {!collapsed && <div className="px-2 mb-1 text-[10px] font-semibold text-slate-500 tracking-wider">{g.label}</div>}
              <div className="space-y-0.5">
                {g.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-2.5 py-2 rounded-md text-sm transition-colors ${
                        isActive
                          ? "bg-[#1A6FD8]/15 text-white border-l-2 border-[#1A6FD8]"
                          : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                      }`
                    }
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/5 p-3">
          <button
            onClick={async () => { await signOut(); nav("/admin/login"); }}
            className="w-full flex items-center gap-2 px-2 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-md"
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      <div className={`flex-1 flex flex-col transition-all ${collapsed ? "ml-16" : "ml-60"}`}>
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 gap-4 sticky top-0 z-30">
          <div className="flex-1">
            <h1 className="text-base font-semibold text-slate-900">{pageTitle}</h1>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-sm text-slate-500 w-72">
            <Search className="w-4 h-4" />
            <span>Search… </span>
            <kbd className="ml-auto text-[10px] px-1.5 py-0.5 bg-white border border-slate-200 rounded">⌘K</kbd>
          </div>
          <Button variant="ghost" size="icon"><Bell className="w-5 h-5" /></Button>
          <div className="text-xs text-slate-500 hidden sm:block">{user?.email}</div>
        </header>
        <main className="flex-1 p-6 overflow-x-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
