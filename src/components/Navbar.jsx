import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown, Globe, User, LogOut, MessageSquare } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { useEmployeeRole } from "../hooks/useEmployeeRole";
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
      {/* Floating Container: 
          - Added 'top-4' to give space from top.
          - Added 'px-4' for side padding.
          - Max width 'max-w-7xl' centered with 'mx-auto'.
      */}
      <div className="fixed top-4 inset-x-0 z-50 px-4 sm:px-6 lg:px-8">
        <nav
          className={`max-w-7xl mx-auto transition-all duration-500 backdrop-blur-md rounded-[2rem] border ${
            scrolled ? "bg-background/70 shadow-2xl border-primary/20 py-1" : "bg-background/40 border-white/10 py-2"
          }`}
        >
          <div className="px-4 sm:px-8">
            <div className="flex justify-between h-14 sm:h-16 items-center">
              {/* Logo */}
              <a href="#" className="flex items-center gap-2 sm:gap-3 group relative z-10">
                <img src={logo} alt="AI Sorix" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
                <span className="text-lg sm:text-xl font-bold text-gradient-primary tracking-tight">AI Sorix</span>
              </a>

              {/* Desktop Menu - Central Capsule Style */}
              <div className="hidden lg:flex items-center gap-8 bg-muted/20 px-6 py-2 rounded-full border border-white/5">
                <a
                  href="#Features"
                  className="text-sm text-muted-foreground hover:text-foreground font-medium transition-colors"
                >
                  {t("features")}
                </a>
                <a
                  href="#pricing"
                  className="text-sm text-muted-foreground hover:text-foreground font-medium transition-colors"
                >
                  {t("pricing")}
                </a>
                <a
                  href="#faq"
                  className="text-sm text-muted-foreground hover:text-foreground font-medium transition-colors"
                >
                  {t("faqs")}
                </a>
                <a
                  href="#about"
                  className="text-sm text-muted-foreground hover:text-foreground font-medium transition-colors"
                >
                  {t("aboutUs")}
                </a>
              </div>

              {/* Right Side: Theme + Language + Auth */}
              <div className="hidden lg:flex items-center gap-3">
                {user && (
                  <Link
                    to="/chat"
                    className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
                    title="Go to Chat"
                  >
                    <MessageSquare className="w-5 h-5" />
                  </Link>
                )}

                <ThemeToggle />

                {/* Language Dropdown */}
                <div className="relative" ref={langRef}>
                  <button
                    onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-muted/50 transition-colors text-muted-foreground text-sm border border-transparent hover:border-white/10"
                  >
                    <Globe className="w-4 h-4" />
                    <span className="font-medium">{language === "en" ? "EN" : "বাং"}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${langDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {langDropdownOpen && (
                    <div className="absolute top-full right-0 mt-3 bg-card/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden min-w-[130px] z-[60]">
                      <button
                        onClick={() => {
                          setLanguage("en");
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-xs font-medium hover:bg-muted transition-colors flex items-center gap-2 ${language === "en" ? "text-primary bg-primary/5" : "text-foreground"}`}
                      >
                        🇬🇧 English
                      </button>
                      <button
                        onClick={() => {
                          setLanguage("bn");
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-xs font-medium hover:bg-muted transition-colors flex items-center gap-2 ${language === "bn" ? "text-primary bg-primary/5" : "text-foreground"}`}
                      >
                        🇧🇩 বাংলা
                      </button>
                    </div>
                  )}
                </div>

                {/* Auth Buttons or User Menu */}
                {authLoading ? (
                  <div className="w-9 h-9 rounded-full bg-muted animate-pulse" />
                ) : user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 p-0.5 rounded-full hover:bg-muted transition-colors focus:outline-none">
                        <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-semibold text-xs">
                          {getUserInitials()}
                        </div>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-56 backdrop-blur-xl bg-background/90 rounded-2xl border-white/10"
                    >
                      <div className="px-3 py-2">
                        <p className="text-sm font-medium text-foreground truncate">
                          {user.user_metadata?.full_name || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/chat" className="flex items-center gap-2 cursor-pointer">
                          <MessageSquare className="w-4 h-4" /> Go to Chat
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/reviews" className="flex items-center gap-2 cursor-pointer">
                          <User className="w-4 h-4" /> My Reviews
                        </Link>
                      </DropdownMenuItem>
                      {isEmployee && (
                        <DropdownMenuItem asChild>
                          <Link to="/admin/chat" className="flex items-center gap-2 cursor-pointer">
                            <MessageSquare className="w-4 h-4" /> Support Dashboard
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleSignOut}
                        className="text-destructive focus:text-destructive cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 mr-2" /> Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link
                      to="/login"
                      className="px-4 py-1.5 text-sm font-semibold text-foreground hover:text-primary transition-colors"
                    >
                      {t("login")}
                    </Link>
                    <Link
                      to="/register"
                      className="px-5 py-2 gradient-primary text-foreground text-sm font-bold rounded-full shadow-lg hover:shadow-primary/20 transform hover:scale-105 transition-all duration-300"
                    >
                      {t("register")}
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile/Tablet Menu Toggle */}
              <div className="flex lg:hidden items-center gap-2 relative z-10">
                <ThemeToggle />
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-full bg-muted/50 hover:bg-muted border border-white/10 transition-all"
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
      </div>

      {/* Mobile Menu - Panel */}
      {mobileMenuOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="lg:hidden fixed inset-x-4 top-20 z-[101] animate-in slide-in-from-top-4 duration-300">
            <div className="bg-background/90 backdrop-blur-2xl border border-white/10 shadow-2xl max-h-[80vh] overflow-y-auto rounded-[2.5rem] p-6">
              <div className="space-y-1">
                <a
                  href="#Features"
                  className="flex items-center gap-3 py-4 px-5 rounded-2xl hover:bg-muted text-foreground font-medium transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {t("features")}
                </a>
                <a
                  href="#pricing"
                  className="flex items-center gap-3 py-4 px-5 rounded-2xl hover:bg-muted text-foreground font-medium transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {t("pricing")}
                </a>
                <a
                  href="#faq"
                  className="flex items-center gap-3 py-4 px-5 rounded-2xl hover:bg-muted text-foreground font-medium transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {t("faqs")}
                </a>
                <a
                  href="#about"
                  className="flex items-center gap-3 py-4 px-5 rounded-2xl hover:bg-muted text-foreground font-medium transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {t("aboutUs")}
                </a>
              </div>

              <div className="h-px bg-white/5 my-6" />

              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => setLanguage("en")}
                  className={`py-3 rounded-xl text-sm font-bold transition-all ${language === "en" ? "gradient-primary text-white" : "bg-muted/50 border border-white/5"}`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage("bn")}
                  className={`py-3 rounded-xl text-sm font-bold transition-all ${language === "bn" ? "gradient-primary text-white" : "bg-muted/50 border border-white/5"}`}
                >
                  বাং
                </button>
              </div>

              <div className="space-y-3">
                {user ? (
                  <>
                    <Link
                      to="/chat"
                      className="flex items-center justify-center gap-2 w-full py-4 gradient-primary text-foreground font-bold rounded-2xl shadow-xl"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <MessageSquare className="w-5 h-5" /> Go to Chat
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full py-4 border border-destructive/20 text-destructive font-bold rounded-2xl hover:bg-destructive/5"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center justify-center w-full py-4 border border-white/10 text-foreground font-bold rounded-2xl hover:bg-muted"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t("login")}
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center justify-center w-full py-4 gradient-primary text-foreground font-bold rounded-2xl shadow-xl"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t("register")}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
