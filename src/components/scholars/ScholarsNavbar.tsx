import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { GraduationCap, Menu, X, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useScholarsLang } from "@/contexts/ScholarsI18nContext";
import LangToggle from "./LangToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ScholarsNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut, loading } = useAuth();
  const { avatarUrl, fullName } = useUserProfile();
  const { t } = useScholarsLang();
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { to: "/sorixscholars", label: t("হোম", "Home"), end: true },
    { to: "/sorixscholars/courses", label: t("কোর্সসমূহ", "Courses") },
    { to: "/sorixscholars/workshops", label: t("ওয়ার্কশপ", "Workshops") },
    { to: "/sorixscholars/competitions", label: t("প্রতিযোগিতা", "Competitions") },
    { to: "/sorixscholars/certificates", label: t("সার্টিফিকেট", "Certificates") },
  ];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  const initials = (() => {
    const n = fullName || user?.user_metadata?.full_name || user?.email || "U";
    return n.split(" ").map((s: string) => s[0]).join("").slice(0, 2).toUpperCase();
  })();

  return (
    <nav
      className={`sticky top-0 z-[100] transition-all duration-300 backdrop-blur-md ${
        scrolled
          ? "bg-background/80 border-b border-border/60 shadow-sm"
          : "bg-background/40 border-b border-transparent"
      }`}
      style={{ fontFamily: "'Plus Jakarta Sans', 'Noto Sans Bengali', system-ui, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-[68px] gap-2">
          <Link to="/sorixscholars" className="flex items-center gap-1.5 group min-w-0">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-cyan-500 grid place-items-center shadow-glow flex-shrink-0">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </span>
            <span className="text-base sm:text-lg lg:text-xl font-bold tracking-tight text-foreground truncate">
              {t("সোরিক্স স্কলারস", "Sorix Scholars")}
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end as any}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                    isActive
                      ? "text-foreground bg-muted/60"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link
              to="/"
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/40 transition-colors whitespace-nowrap"
            >
              AI Sorix ↗
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <LangToggle />
            <ThemeToggle />
            {loading ? null : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-border/60 hover:bg-muted/40 transition-colors">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <span className="w-7 h-7 rounded-full bg-primary/15 text-primary text-xs grid place-items-center font-semibold">
                      {initials}
                    </span>
                  )}
                  <span className="text-xs font-medium text-foreground max-w-[100px] truncate">
                    {fullName || user.email}
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate("/sorixscholars/certificates")}>
                    {t("আমার সার্টিফিকেট", "My Certificates")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    {t("ড্যাশবোর্ড", "Dashboard")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="w-3.5 h-3.5 mr-2" /> {t("লগ আউট", "Sign out")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/40 rounded-lg transition-colors"
                >
                  {t("লগইন", "Log in")}
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-2 text-sm font-semibold bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity"
                >
                  {t("জয়েন করুন", "Join free")}
                </Link>
              </>
            )}
          </div>

          <div className="flex lg:hidden items-center gap-1.5">
            <LangToggle />
            <button
              className="p-2 rounded-lg hover:bg-muted/50"
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden pb-4 space-y-1 border-t border-border/40 pt-3">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end as any}
                className={({ isActive }) =>
                  `block px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? "bg-muted/60 text-foreground"
                      : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link
              to="/"
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted/40 hover:text-foreground"
            >
              AI Sorix ↗
            </Link>
            <div className="pt-2 flex items-center gap-2 px-1">
              <ThemeToggle />
              {user ? (
                <button
                  onClick={() => signOut()}
                  className="flex-1 px-3 py-2 text-sm font-medium border border-border/60 rounded-lg"
                >
                  {t("লগ আউট", "Sign out")}
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex-1 text-center px-3 py-2 text-sm font-medium border border-border/60 rounded-lg"
                  >
                    {t("লগইন", "Log in")}
                  </Link>
                  <Link
                    to="/register"
                    className="flex-1 text-center px-3 py-2 text-sm font-semibold bg-foreground text-background rounded-lg"
                  >
                    {t("জয়েন করুন", "Join free")}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
