import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { GraduationCap, Menu, X, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";
import { useUserProfile } from "@/hooks/useUserProfile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const links = [
  { to: "/sorixscholars", label: "Home", end: true },
  { to: "/sorixscholars/courses", label: "Courses" },
  { to: "/sorixscholars/workshops", label: "Workshops" },
  { to: "/sorixscholars/competitions", label: "Competitions" },
  { to: "/sorixscholars/certificates", label: "Certificates" },
];


export default function ScholarsNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut, loading } = useAuth();
  const { avatarUrl, fullName } = useUserProfile();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  const initials = (() => {
    const n = fullName || user?.user_metadata?.full_name || user?.email || "U";
    return n
      .split(" ")
      .map((s: string) => s[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  })();

  return (
    <nav
      className={`sticky top-0 z-[100] transition-all duration-300 backdrop-blur-md ${
        scrolled
          ? "bg-background/80 border-b border-border/60 shadow-sm"
          : "bg-background/40 border-b border-transparent"
      }`}
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-[68px]">
          <Link to="/sorixscholars" className="flex items-center gap-1.5 group">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-cyan-500 grid place-items-center shadow-glow">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </span>
            <span className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
              Sorix Scholars
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end as any}
                className={({ isActive }) =>
                  `px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
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
              className="px-3.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/40 transition-colors"
            >
              AI Sorix ↗
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-2">
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
                    My Certificates
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="w-3.5 h-3.5 mr-2" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-medium text-foreground hover:bg-muted/40 rounded-lg transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-2 text-sm font-semibold bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity"
                >
                  Join free
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted/50"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4 space-y-1 border-t border-border/40 pt-3">
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
            <div className="pt-2 flex items-center gap-2 px-1">
              <ThemeToggle />
              {user ? (
                <button
                  onClick={() => signOut()}
                  className="flex-1 px-3 py-2 text-sm font-medium border border-border/60 rounded-lg"
                >
                  Sign out
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex-1 text-center px-3 py-2 text-sm font-medium border border-border/60 rounded-lg"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="flex-1 text-center px-3 py-2 text-sm font-semibold bg-foreground text-background rounded-lg"
                  >
                    Join free
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
