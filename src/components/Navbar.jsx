import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown, Globe, User, LogOut, MessageSquare } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { useEmployeeRole } from "../hooks/useEmployeeRole";
import { useUserProfile } from "../hooks/useUserProfile";
import ThemeToggle from "./ThemeToggle";
import logo from "../assets/logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { user, signOut, loading: authLoading } = useAuth();
  const { isEmployee } = useEmployeeRole();
  const { avatarUrl, fullName } = useUserProfile();
  const langRef = useRef(null);

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  const getUserInitials = () => {
    if (!user) return "U";
    const name = user.user_metadata?.full_name || user.email || "";
    if (user.user_metadata?.full_name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return name.charAt(0).toUpperCase();
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Main Navbar with Glassmorphism */}
      <nav
        className={`sticky top-0 z-[100] transition-all duration-500 backdrop-blur-md ${
          scrolled
            ? "bg-background/70 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border-b border-primary/10"
            : "bg-background/30 border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 sm:h-20 items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group relative z-10">
              <img src={logo} alt="AI Sorix" className="w-9 h-9 sm:w-12 sm:h-12 object-contain" />
              <span className="text-lg sm:text-2xl font-bold text-gradient-primary tracking-tight">AI Sorix</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-10">
              <a
                href="#Features"
                className="text-muted-foreground hover:text-foreground font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary hover:after:w-full after:transition-all"
              >
                {t("features")}
              </a>
              <a
                href="#pricing"
                className="text-muted-foreground hover:text-foreground font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary hover:after:w-full after:transition-all"
              >
                {t("pricing")}
              </a>
              <a
                href="#faq"
                className="text-muted-foreground hover:text-foreground font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary hover:after:w-full after:transition-all"
              >
                {t("faqs")}
              </a>
              <a
                href="#about"
                className="text-muted-foreground hover:text-foreground font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary hover:after:w-full after:transition-all"
              >
                {t("aboutUs")}
              </a>
            </div>

            {/* Right Side: Theme + Language + Auth */}
            <div className="hidden lg:flex items-center gap-3">
              {user && (
                <Link
                  to="/chat"
                  className="p-2.5 rounded-xl hover:bg-muted/50 backdrop-blur-sm transition-colors text-muted-foreground hover:text-primary border border-transparent hover:border-border/50"
                  title="Go to Chat"
                >
                  <MessageSquare className="w-5 h-5" />
                </Link>
              )}

              <ThemeToggle />

              {/* Language Dropdown with Glass effect */}
              <div className="relative" ref={langRef}>
                <button
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/50 backdrop-blur-sm transition-colors text-muted-foreground border border-transparent hover:border-border/50"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-sm font-medium">{language === "en" ? "EN" : "বাং"}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${langDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {langDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 bg-card/80 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl overflow-hidden min-w-[140px] z-[110] animate-in fade-in zoom-in-95 duration-200">
                    <button
                      onClick={() => {
                        setLanguage("en");
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left text-sm font-medium hover:bg-primary/10 transition-colors flex items-center gap-2 ${language === "en" ? "text-primary bg-primary/5" : "text-foreground"}`}
                    >
                      🇬🇧 English
                    </button>
                    <button
                      onClick={() => {
                        setLanguage("bn");
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left text-sm font-medium hover:bg-primary/10 transition-colors flex items-center gap-2 ${language === "bn" ? "text-primary bg-primary/5" : "text-foreground"}`}
                    >
                      🇧🇩 বাংলা
                    </button>
                  </div>
                )}
              </div>

              {/* User Menu */}
              {authLoading ? (
                <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 p-1 rounded-full hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 border border-transparent hover:border-border/50">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-primary font-semibold text-sm backdrop-blur-sm">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          getUserInitials()
                        )}
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 backdrop-blur-xl bg-background/80 border-border/50">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium text-foreground truncate">
                        {fullName || user.user_metadata?.full_name || "User"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator className="bg-border/50" />
                    <DropdownMenuItem asChild>
                      <Link to="/chat" className="flex items-center gap-2 cursor-pointer focus:bg-primary/10">
                        <MessageSquare className="w-4 h-4" />
                        Go to Chat
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/reviews" className="flex items-center gap-2 cursor-pointer focus:bg-primary/10">
                        <User className="w-4 h-4" />
                        My Reviews
                      </Link>
                    </DropdownMenuItem>
                    {isEmployee && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin/chat" className="flex items-center gap-2 cursor-pointer focus:bg-primary/10">
                          <MessageSquare className="w-4 h-4" />
                          Support Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-border/50" />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-5 py-2.5 border border-border/50 rounded-xl font-semibold text-foreground hover:bg-muted/50 backdrop-blur-sm transition-all duration-300"
                  >
                    {t("login")}
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2.5 gradient-primary text-foreground font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    {t("register")}
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile/Tablet Controls */}
            <div className="flex lg:hidden items-center gap-2 relative z-10">
              {user && (
                <Link
                  to="/chat"
                  className="p-2.5 rounded-xl hover:bg-muted/50 backdrop-blur-sm text-muted-foreground hover:text-primary transition-colors border border-transparent hover:border-border/50"
                >
                  <MessageSquare className="w-5 h-5" />
                </Link>
              )}
              <ThemeToggle />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-xl bg-muted/40 hover:bg-muted/60 backdrop-blur-md border border-border/50 transition-all duration-200"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-foreground" />
                ) : (
                  <Menu className="w-5 h-5 text-foreground" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Panel with Glassmorphism */}
      {mobileMenuOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-[4px] z-[100] animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="lg:hidden fixed inset-x-0 top-0 z-[101] animate-slide-in-right">
            <div className="bg-background/80 backdrop-blur-2xl border-b border-border/50 shadow-2xl max-h-[90vh] overflow-y-auto rounded-b-[2.5rem]">
              {/* Mobile Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-border/30">
                <div className="flex items-center gap-2">
                  <img src={logo} alt="AI Sorix" className="w-8 h-8 object-contain" />
                  <span className="text-lg font-bold text-gradient-primary">AI Sorix</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl bg-muted/50 hover:bg-muted border border-border/50 transition-all"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>

              <div className="px-6 py-8">
                {/* Navigation Links */}
                <div className="grid gap-2">
                  {[
                    { href: "#Features", label: t("features") },
                    { href: "#pricing", label: t("pricing") },
                    { href: "#faq", label: t("faqs") },
                    { href: "#about", label: t("aboutUs") },
                  ].map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-4 py-4 px-5 rounded-2xl hover:bg-primary/10 text-foreground font-medium transition-all border border-transparent hover:border-primary/10"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      {link.label}
                    </a>
                  ))}
                </div>

                <div className="h-px bg-border/40 my-6" />

                {/* Language Switcher Card */}
                <div className="bg-muted/30 backdrop-blur-md rounded-2xl p-5 border border-border/50">
                  <div className="flex items-center gap-3 mb-4">
                    <Globe className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold">Switch Language</span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setLanguage("en")}
                      className={`flex-1 px-4 py-3 rounded-xl text-sm font-bold transition-all ${language === "en" ? "gradient-primary text-foreground shadow-lg" : "bg-background/50 border border-border/50 hover:bg-background"}`}
                    >
                      🇬🇧 English
                    </button>
                    <button
                      onClick={() => setLanguage("bn")}
                      className={`flex-1 px-4 py-3 rounded-xl text-sm font-bold transition-all ${language === "bn" ? "gradient-primary text-foreground shadow-lg" : "bg-background/50 border border-border/50 hover:bg-background"}`}
                    >
                      🇧🇩 বাংলা
                    </button>
                  </div>
                </div>

                {/* Auth Section */}
                <div className="mt-8 space-y-4">
                  {user ? (
                    <>
                      <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/10 backdrop-blur-sm">
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-primary/20 border-2 border-primary/30 flex items-center justify-center text-primary text-xl font-bold">
                          {avatarUrl ? (
                            <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            getUserInitials()
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-foreground truncate text-lg">
                            {fullName || user.user_metadata?.full_name || "User"}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>
                      <Link
                        to="/chat"
                        className="flex items-center justify-center gap-2 w-full py-4 gradient-primary text-foreground font-bold rounded-2xl shadow-xl transition-all active:scale-95"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <MessageSquare className="w-5 h-5" /> Go to Chat
                      </Link>
                      <div className="grid grid-cols-2 gap-3">
                        <Link
                          to="/reviews"
                          className="flex items-center justify-center gap-2 py-3.5 border border-border rounded-xl font-semibold hover:bg-muted/50"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <User className="w-4 h-4" /> Profile
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center justify-center gap-2 py-3.5 border border-destructive/20 text-destructive rounded-xl font-semibold hover:bg-destructive/5"
                        >
                          <LogOut className="w-4 h-4" /> Log Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <Link
                        to="/login"
                        className="flex items-center justify-center w-full py-4 border-2 border-border/50 text-foreground font-bold rounded-2xl hover:bg-muted/50 transition-all"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t("login")}
                      </Link>
                      <Link
                        to="/register"
                        className="flex items-center justify-center w-full py-4 gradient-primary text-foreground font-bold rounded-2xl shadow-xl transition-all"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t("register")}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
