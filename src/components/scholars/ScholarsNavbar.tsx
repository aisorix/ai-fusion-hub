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
    const [profileMenuOpen, setprofileMenuOpen] = useState(false);
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

    const handleProfileToggleButton = (profileMenuOpen) => {
        if(profileMenuOpen) {
            setprofileMenuOpen(false);
        }

    }

    const handleMainMenuToggleButton = (open) => {
        if(open) {
            setOpen(false);
        }
    }

    return (
        <nav
            className={`sticky top-0 z-[100] transition-all duration-300 backdrop-blur-md ${scrolled
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
                            Sorix Scholars
                        </span>
                    </Link>

                    <div className="hidden lg:flex items-center gap-1">
                        {links.map((l) => (
                            <NavLink
                                key={l.to}
                                to={l.to}
                                end={l.end as any}
                                className={({ isActive }) =>
                                    `px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${isActive
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
                                <DropdownMenuContent align="end" className="w-52">
                                    <DropdownMenuItem onClick={() => navigate("/sorixscholars/dashboard")}>
                                        {t("ড্যাশবোর্ড", "Dashboard")}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => navigate("/sorixscholars/certificates")}>
                                        {t("আমার সার্টিফিকেট", "My Certificates")}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => navigate("/sorixscholars/profile")}>
                                        {t("প্রোফাইল এডিট", "Edit Profile")}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => navigate("/sorixscholars/verify")}>
                                        {t("সার্টিফিকেট যাচাই", "Verify Certificate")}
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
                        <button
                            className="p-2 rounded-lg hover:bg-muted/50"
                            onClick={() => {
                                setprofileMenuOpen((o) => !o);
                                handleMainMenuToggleButton(open)
                               
                            }}
                            aria-label="Toggle menu"
                        >
                            {
                                profileMenuOpen ? <X className="w-5 h-5" /> : (
                                    <>
                                        {
                                            loading ? null : user ? (
                                                <div>
                                                    {avatarUrl ? (
                                                        <img src={avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover" />
                                                    ) : (
                                                        <span className="w-7 h-7 rounded-full bg-primary/15 text-primary text-xs grid place-items-center font-semibold">
                                                            {initials}
                                                        </span>
                                                    )}


                                                </div>
                                            ) : (
                                                <>
                                                    <Link
                                                        to="/login"
                                                        className="px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/40 rounded-lg transition-colors"
                                                    >
                                                        {t("লগইন", "Log in")}
                                                    </Link>
                                                </>
                                            )
                                        }
                                    </>
                                )
                            }
                        </button>

                        {/* <LangToggle /> */}
                        <button
                            className="p-2 rounded-lg hover:bg-muted/50"
                            onClick={() => {
                                setOpen((o) => !o);
                                handleProfileToggleButton(profileMenuOpen);
                                 
                            }}
                            aria-label="Toggle menu"
                        >
                            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {
                    profileMenuOpen && (
                        <div className="lg:hidden pb-4 space-y-1 bg-[#efefef] border-t border-border/40 pt-3">
                            {
                                loading ? null : user ? (
                                    <>
                                        {/* মোবাইল ইউজার প্রোফাইল হেডার (ঐচ্ছিক, দেখতে সুন্দর লাগবে) */}
                                        <div className="flex items-center gap-2 px-3 py-1.5 mb-2 rounded-lg bg-muted/30">
                                            {avatarUrl ? (
                                                <img src={avatarUrl} alt="" className="w-6 h-6 rounded-full object-cover" />
                                            ) : (
                                                <span className="w-6 h-6 rounded-full bg-primary/15 text-primary text-[10px] grid place-items-center font-semibold">
                                                    {initials}
                                                </span>
                                            )}
                                            <span className="text-xs font-medium text-foreground max-w-[150px] truncate">
                                                {fullName || user.email}
                                            </span>
                                        </div>

                                        {/* সাধারণ ওপেন মেনুর মতো ডাইরেক্ট লিংকসমূহ */}
                                        <Link
                                            to="/sorixscholars/dashboard"
                                            onClick={() => setprofileMenuOpen(false)}
                                            className="block px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                                        >
                                            {t("ড্যাশবোর্ড", "Dashboard")}
                                        </Link>
                                        <Link
                                            to="/sorixscholars/certificates"
                                            onClick={() => setprofileMenuOpen(false)}
                                            className="block px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                                        >
                                            {t("আমার সার্টিফিকেট", "My Certificates")}
                                        </Link>
                                        <Link
                                            to="/sorixscholars/profile"
                                            onClick={() => setprofileMenuOpen(false)}
                                            className="block px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                                        >
                                            {t("প্রোফাইল এডিট", "Edit Profile")}
                                        </Link>
                                        <Link
                                            to="/sorixscholars/verify"
                                            onClick={() => setprofileMenuOpen(false)}
                                            className="block px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                                        >
                                            {t("সার্টিফিকেট যাচাই", "Verify Certificate")}
                                        </Link>

                                        {/* লগ আউট বাটন */}
                                        <div className="pt-2 px-1">
                                            <button
                                                onClick={() => {
                                                    signOut();
                                                    setprofileMenuOpen(false);
                                                }}
                                                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium border border-border/60 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40"
                                            >
                                                <LogOut className="w-3.5 h-3.5" /> {t("লগ আউট", "Sign out")}
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="pt-2 flex items-center gap-2 px-1">
                                        <Link
                                            to="/login"
                                            onClick={() => setprofileMenuOpen(false)}
                                            className="flex-1 text-center px-3 py-2 text-sm font-medium border border-border/60 rounded-lg"
                                        >
                                            {t("লগইন", "Log in")}
                                        </Link>
                                        <Link
                                            to="/register"
                                            onClick={() => setprofileMenuOpen(false)}
                                            className="flex-1 text-center px-3 py-2 text-sm font-semibold bg-foreground text-background rounded-lg"
                                        >
                                            {t("জয়েন করুন", "Join free")}
                                        </Link>
                                    </div>
                                )
                            }
                        </div>

                    )
                }

                {open && (
                    <div className="lg:hidden pb-4 space-y-1 border-t bg-[#efefef] border-border/40 pt-3">
                        {links.map((l) => (
                            <NavLink
                                key={l.to}
                                to={l.to}
                                end={l.end as any}
                                className={({ isActive }) =>
                                    `block px-3 py-2.5 rounded-lg text-sm font-medium ${isActive
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
                            <LangToggle />
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
