import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, ChevronRight, Globe, User, LogOut, MessageSquare, Presentation, ImageIcon, Heart, Leaf, Crown, Bot, Workflow, Cpu, GraduationCap, Rocket, FlaskConical, BookOpen, Newspaper, Briefcase, Handshake, Mail, FileText, Users, Code, Sparkles, HelpCircle, Palette, UserCheck, Shield, Chrome, Code2, Headphones, Landmark, Building2, HeartPulse, HandHeart, ShieldCheck, Plug, CalendarDays, Layers, TrendingUp, Eye, Columns3 } from "lucide-react";
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

const megaMenus = {
  products: {
    label: "Features",
    columns: [
      [
        { icon: MessageSquare, name: "AI Chat", desc: "Multi-model AI conversations", to: "/chat" },
        { icon: Columns3, name: "Multi-window Chat", desc: "Compare AI models side-by-side", to: "/chat?multi=1" },
        { icon: Bot, name: "AI Agents", desc: "Autonomous task execution", to: "/agent" },
        { icon: Cpu, name: "Sorix Agent OS", desc: "Multi-agent autonomous workspace", to: "/agent" },
        { icon: Presentation, name: "Sorix Deck", desc: "AI-powered presentations", to: "/deck" },
        { icon: ImageIcon, name: "Sorix Imagine", desc: "AI image generation", to: "/imagine" },
        { icon: Workflow, name: "Flow Builder", desc: "AI diagrams & flowcharts", to: "/flowbuilder" },
      ],
      [
        { icon: Heart, name: "Sorix Health", desc: "AI health analysis", to: "/health" },
        { icon: Leaf, name: "Sorix Agro", desc: "AI agriculture insights", to: "/agro" },
        { icon: Crown, name: "Sorix Legends", desc: "Chat with historical figures", to: "/legends" },
        { icon: Shield, name: "Sorix Security", desc: "Zero-trust AI platform security", to: "/sorix-security" },
        { icon: Chrome, name: "Sorix for Chrome", desc: "AI copilot in every tab", to: "/sorix-for-chrome" },
        { icon: Sparkles, name: "Skills", desc: "Reusable AI workflow recipes", to: "/skills" },
      ],
    ],
  },
  solutions: {
    label: "Solutions",
    columns: [
      [
        { icon: Code2, name: "Coding", desc: "AI pair programming for engineering teams", to: "/solutions/coding" },
        { icon: Headphones, name: "Customer Support", desc: "AI agents that resolve tickets 24/7", to: "/solutions/customer-support" },
        { icon: Landmark, name: "Financial Services", desc: "Secure AI for banking and fintech", to: "/solutions/financial-services" },
        { icon: Building2, name: "Government", desc: "AI for public sector and civic agencies", to: "/solutions/government" },
        { icon: HeartPulse, name: "Healthcare", desc: "HIPAA-aligned AI for clinicians", to: "/solutions/healthcare" },
      ],
      [
        { icon: FlaskConical, name: "Life Sciences", desc: "AI for biotech and pharma research", to: "/solutions/life-sciences" },
        { icon: HandHeart, name: "Nonprofits", desc: "Discounted AI for social impact", to: "/solutions/nonprofits" },
        { icon: ShieldCheck, name: "Security", desc: "AI for SOC, GRC and cybersecurity", to: "/solutions/security" },
        { icon: Workflow, name: "Workflow Automation", desc: "Automate multi-step tasks with AI", to: "/solutions/workflow-automation" },
        { icon: GraduationCap, name: "Educators", desc: "AI tools for teaching and learning", to: "/solutions/ai-for-educators" },
      ],
      [
        { icon: Rocket, name: "Startups", desc: "All-in-one AI stack for early-stage teams", to: "/solutions/ai-for-startups" },
        { icon: FlaskConical, name: "Researchers", desc: "Multi-model research and analysis", to: "/solutions/ai-for-researchers" },
        { icon: Palette, name: "Creators", desc: "AI for designers, writers and editors", to: "/solutions/ai-for-creators" },
        { icon: Briefcase, name: "Freelancers", desc: "One AI workspace for solo earners", to: "/solutions/ai-for-freelancers" },
        { icon: UserCheck, name: "Professionals", desc: "AI productivity for knowledge workers", to: "/solutions/ai-for-professionals" },
      ],
    ],
  },
  resources: {
    label: "Resources",
    columns: [
      [
        { icon: BookOpen, name: "Blog & AI Insights", desc: "Latest AI news & tutorials", to: "/blog" },
        { icon: FileText, name: "Case Studies", desc: "Real-world impact stories", to: "/case-studies" },
        { icon: Cpu, name: "Documentation", desc: "Guides & feature docs", to: "/docs" },
        { icon: Code, name: "Developer API", desc: "Programmatic access", to: "/developer-api" },
        { icon: Users, name: "Community", desc: "Reviews & discussions", to: "/reviews" },
        { icon: HelpCircle, name: "FAQs", desc: "Frequently asked questions", scrollTo: "faq" },
      ],
      [
        { icon: Plug, name: "Connectors", desc: "Integrations to 100+ apps", to: "/connectors" },
        { icon: GraduationCap, name: "Courses", desc: "AI Sorix Academy", to: "/courses" },
        { icon: CalendarDays, name: "Events", desc: "Webinars, hackathons & summits", to: "/events" },
        { icon: Code2, name: "Inside Sorix Code", desc: "Deep-dive into our coding tool", to: "/inside-sorix-code" },
        { icon: Layers, name: "Inside Sorix Cowork", desc: "Multi-agent workspace tour", to: "/inside-sorix-cowork" },
      ],
    ],
  },
  company: {
    label: "Company",
    columns: [
      [
        { icon: Globe, name: "About Us", desc: "Our mission & global team", to: "/about-us" },
        { icon: FlaskConical, name: "About SorixLab", desc: "Our parent R&D lab", to: "/about-sorix-lab" },
        { icon: Newspaper, name: "Press & Media", desc: "News & press releases", to: "/press" },
        { icon: Briefcase, name: "Careers", desc: "Join our team", to: "/careers" },
        { icon: Mail, name: "Contact Us", desc: "Get in touch", scrollTo: "contact" },
        { icon: Handshake, name: "Partners", desc: "Partner ecosystem", to: "/partners" },
      ],
      [
        { icon: TrendingUp, name: "Economic Futures", desc: "AI's impact on work & growth", to: "/economic-futures" },
        { icon: FlaskConical, name: "Research", desc: "Frontier AI publications", to: "/research" },
        { icon: ShieldCheck, name: "Security & Compliance", desc: "SOC 2, GDPR, HIPAA", to: "/security-and-compliance" },
        { icon: Eye, name: "Transparency", desc: "How AI Sorix works", to: "/transparency" },
      ],
    ],
  },
};

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const { language, setLanguage, t } = useLanguage();
  const { user, signOut, loading: authLoading } = useAuth();
  const { isEmployee } = useEmployeeRole();
  const { avatarUrl, fullName } = useUserProfile();
  const langRef = useRef(null);
  const dropdownTimeout = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  const getUserInitials = () => {
    if (!user) return "U";
    const name = user.user_metadata?.full_name || user.email || "";
    if (user.user_metadata?.full_name) {
      return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    }
    return name.charAt(0).toUpperCase();
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  }, [location.pathname]);

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
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [mobileMenuOpen]);

  const handleDropdownEnter = (key) => {
    clearTimeout(dropdownTimeout.current);
    setActiveDropdown(key);
  };

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setActiveDropdown(null), 150);
  };

  // Universal section scroll: works from any page
  const scrollToSection = (sectionId) => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    if (location.pathname === "/") {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate("/", { state: { scrollTo: sectionId } });
    }
  };

  const handleSectionClick = (e, sectionId) => {
    e.preventDefault();
    scrollToSection(sectionId);
  };

  const renderMegaItem = (item) => {
    const Icon = item.icon;
    if (item.scrollTo) {
      return (
        <a
          key={item.name}
          href={`/#${item.scrollTo}`}
          onClick={(e) => handleSectionClick(e, item.scrollTo)}
          className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/60 transition-colors group"
        >
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
            <Icon className="w-4.5 h-4.5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
          </div>
        </a>
      );
    }
    return (
      <Link
        key={item.name}
        to={item.to}
        className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/60 transition-colors group"
      >
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
          <Icon className="w-4.5 h-4.5 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">{item.name}</p>
          <p className="text-xs text-muted-foreground">{item.desc}</p>
        </div>
      </Link>
    );
  };

  return (
    <>
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
            <Link to="/" className="flex items-center gap-1.5 group relative z-10">
              <img src={logo} alt="AI Sorix" className="w-9 h-9 sm:w-12 sm:h-12 object-contain" />
              <span className="text-lg sm:text-2xl font-bold text-foreground tracking-tight">AI Sorix</span>
            </Link>

            {/* Desktop Mega-Menu Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {Object.entries(megaMenus).map(([key, menu]) => (
                <div
                  key={key}
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter(key)}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button className="flex items-center gap-1 px-3.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/40">
                    {menu.label}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === key ? "rotate-180" : ""}`} />
                  </button>

                  {activeDropdown === key && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl p-5 animate-in fade-in slide-in-from-top-2 duration-200 z-[110]"
                      style={{ minWidth: menu.columns.length >= 3 ? 820 : 560 }}
                    >
                      <div className={`grid ${menu.columns.length >= 3 ? "grid-cols-3" : menu.columns.length === 2 ? "grid-cols-2" : "grid-cols-1"} gap-1`}>
                        {menu.columns.map((col, ci) => (
                          <div key={ci} className="space-y-1">
                            {col.map(renderMegaItem)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Pricing - universal scroll */}
              <a
                href="/#pricing"
                onClick={(e) => handleSectionClick(e, "pricing")}
                className="px-3.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/40"
              >
                {t("pricing")}
              </a>
            </div>

            {/* Right Side: Theme + Language + Auth */}
            <div className="hidden lg:flex items-center gap-3">
              {user && (
                <Link
                  to="/chat"
                  className="p-2.5 rounded-xl hover:bg-muted/50 backdrop-blur-sm transition-colors text-muted-foreground hover:text-primary border border-transparent hover:border-border/50"
                  title={t("goToChat")}
                  aria-label={t("goToChat") || "Go to AI Chat"}
                >
                  <MessageSquare className="w-5 h-5" aria-hidden="true" />
                </Link>
              )}

              <ThemeToggle />

              {/* Language Dropdown */}
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
                      onClick={() => { setLanguage("en"); setLangDropdownOpen(false); }}
                      className={`w-full px-4 py-3 text-left text-sm font-medium hover:bg-primary/10 transition-colors flex items-center gap-2 ${language === "en" ? "text-primary bg-primary/5" : "text-foreground"}`}
                    >
                      🇬🇧 English
                    </button>
                    <button
                      onClick={() => { setLanguage("bn"); setLangDropdownOpen(false); }}
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
                        {t("goToChat")}
                      </Link>
                    </DropdownMenuItem>
                    {isEmployee && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin/chat" className="flex items-center gap-2 cursor-pointer focus:bg-primary/10">
                          <MessageSquare className="w-4 h-4" />
                          {t("supportDashboard")}
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-border/50" />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {t("signOut")}
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
                {mobileMenuOpen ? <X className="w-5 h-5 text-foreground" /> : <Menu className="w-5 h-5 text-foreground" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
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
                <div className="flex items-center gap-1.5">
                  <img src={logo} alt="AI Sorix" className="w-8 h-8 object-contain" />
                  <span className="text-lg font-bold text-foreground">AI Sorix</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl bg-muted/50 hover:bg-muted border border-border/50 transition-all"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>

              <div className="px-5 py-6">
                {/* Accordion Sections */}
                {Object.entries(megaMenus).map(([key, menu]) => (
                  <div key={key} className="border-b border-border/20 last:border-b-0">
                    <button
                      onClick={() => setMobileExpanded(mobileExpanded === key ? null : key)}
                      className="flex items-center justify-between w-full py-4 text-left"
                    >
                      <span className="text-sm font-semibold text-foreground">{menu.label}</span>
                      <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${mobileExpanded === key ? "rotate-180" : ""}`} />
                    </button>
                    {mobileExpanded === key && (
                      <div className="pb-4 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
                        {menu.columns.flat().map((item) => {
                          const Icon = item.icon;
                          if (item.scrollTo) {
                            return (
                              <a
                                key={item.name}
                                href={`/#${item.scrollTo}`}
                                onClick={(e) => handleSectionClick(e, item.scrollTo)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/50 transition-colors"
                              >
                                <Icon className="w-4 h-4 text-primary" />
                                <div>
                                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                                  <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                                </div>
                              </a>
                            );
                          }
                          return (
                            <Link
                              key={item.name}
                              to={item.to}
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/50 transition-colors"
                            >
                              <Icon className="w-4 h-4 text-primary" />
                              <div>
                                <p className="text-sm font-medium text-foreground">{item.name}</p>
                                <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}

                {/* Pricing link - universal */}
                <a
                  href="/#pricing"
                  onClick={(e) => handleSectionClick(e, "pricing")}
                  className="flex items-center py-4 text-sm font-semibold text-foreground"
                >
                  {t("pricing")}
                </a>

                <div className="h-px bg-border/40 my-4" />

                {/* Language Switcher */}
                <div className="bg-muted/30 backdrop-blur-md rounded-2xl p-5 border border-border/50">
                  <div className="flex items-center gap-3 mb-4">
                    <Globe className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold">{t("switchLanguage")}</span>
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
                <div className="mt-6 space-y-4">
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
                        <MessageSquare className="w-5 h-5" /> {t("goToChat")}
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center justify-center gap-2 py-3.5 border border-destructive/20 text-destructive rounded-xl font-semibold hover:bg-destructive/5"
                      >
                        <LogOut className="w-4 h-4" /> {t("signOut")}
                      </button>
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
