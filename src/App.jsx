import React, { Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy-loaded pages for code splitting
const Index = React.lazy(() => import("./pages/Index"));
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const VerifyEmail = React.lazy(() => import("./pages/VerifyEmail"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const PrivacyPolicy = React.lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = React.lazy(() => import("./pages/TermsOfService"));
const CookiePolicy = React.lazy(() => import("./pages/CookiePolicy"));
const RefundPolicy = React.lazy(() => import("./pages/RefundPolicy"));
const AboutSorixLab = React.lazy(() => import("./pages/AboutSorixLab"));
const AboutUsPage = React.lazy(() => import("./pages/AboutUsPage"));
const Reviews = React.lazy(() => import("./pages/Reviews"));
const ForgotPassword = React.lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = React.lazy(() => import("./pages/ResetPassword"));
const ChatDashboard = React.lazy(() => import("./pages/admin/ChatDashboard"));
const ChatPage = React.lazy(() => import("./pages/ChatPage"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const HealthPage = React.lazy(() => import("./pages/HealthPage"));
const AgroPage = React.lazy(() => import("./pages/AgroPage"));
const PaymentSuccess = React.lazy(() => import("./pages/PaymentSuccess"));
const PaymentFailed = React.lazy(() => import("./pages/PaymentFailed"));
const PaymentCancel = React.lazy(() => import("./pages/PaymentCancel"));
const LegendsPage = React.lazy(() => import("./pages/LegendsPage"));
const CineshootPage = React.lazy(() => import("./pages/CineshootPage"));
const ImaginePage = React.lazy(() => import("./pages/ImaginePage"));
const SharedChatPage = React.lazy(() => import("./pages/SharedChatPage"));
const DeckPage = React.lazy(() => import("./pages/DeckPage"));
const CoWorkPage = React.lazy(() => import("./pages/CoWorkPage"));
const ConnectionsPage = React.lazy(() => import("./pages/ConnectionsPage"));

// Admin dashboard
const AdminGuard = React.lazy(() => import("./admin/guards/AdminGuard"));
const AdminLayout = React.lazy(() => import("./admin/layout/AdminLayout"));
const AdminLogin = React.lazy(() => import("./admin/pages/AdminLogin"));
const AdminDashboard = React.lazy(() => import("./admin/pages/AdminDashboard"));
const AdminUsers = React.lazy(() => import("./admin/pages/AdminUsers"));
const AdminUserProfile = React.lazy(() => import("./admin/pages/AdminUserProfile"));
const AdminPlaceholder = React.lazy(() => import("./admin/pages/AdminPlaceholder"));
const AdminAIUsage = React.lazy(() => import("./admin/pages/AdminAIUsage"));
const AdminAITokens = React.lazy(() => import("./admin/pages/AdminAITokens"));
const AdminAILive = React.lazy(() => import("./admin/pages/AdminAILive"));
const AdminRevenue = React.lazy(() => import("./admin/pages/AdminRevenue"));
const AdminSubscriptions = React.lazy(() => import("./admin/pages/AdminSubscriptions"));
const AdminInvoices = React.lazy(() => import("./admin/pages/AdminInvoices"));
const AdminCoupons = React.lazy(() => import("./admin/pages/AdminCoupons"));
const AdminFlags = React.lazy(() => import("./admin/pages/AdminFlags"));
const AdminAnnouncements = React.lazy(() => import("./admin/pages/AdminAnnouncements"));
const AdminPrompts = React.lazy(() => import("./admin/pages/AdminPrompts"));
const AdminTickets = React.lazy(() => import("./admin/pages/AdminTickets"));
const AdminFeedback = React.lazy(() => import("./admin/pages/AdminFeedback"));
const AdminSystemHealth = React.lazy(() => import("./admin/pages/AdminSystemHealth"));
const AdminApiKeys = React.lazy(() => import("./admin/pages/AdminApiKeys"));
const AdminAudit = React.lazy(() => import("./admin/pages/AdminAudit"));
const AdminSettings = React.lazy(() => import("./admin/pages/AdminSettings"));
const AdminBroadcasts = React.lazy(() => import("./admin/pages/AdminBroadcasts"));
const AdminDatabase = React.lazy(() => import("./admin/pages/AdminDatabase"));
const PageViewTracker = React.lazy(() => import("./components/PageViewTracker"));



const FlowBuilderPage = React.lazy(() => import("./pages/FlowBuilderPage"));
const ToolsPage = React.lazy(() => import("./pages/ToolsPage"));
const BlogPage = React.lazy(() => import("./pages/BlogPage"));
const CaseStudiesPage = React.lazy(() => import("./pages/CaseStudiesPage"));
const DocsPage = React.lazy(() => import("./pages/DocsPage"));
const PressPage = React.lazy(() => import("./pages/PressPage"));
const CareersPage = React.lazy(() => import("./pages/CareersPage"));
const PartnersPage = React.lazy(() => import("./pages/PartnersPage"));
const SolutionsPage = React.lazy(() => import("./pages/SolutionsPage"));
const DeveloperApiPage = React.lazy(() => import("./pages/DeveloperApiPage"));

// New marketing/info pages
const SorixSecurityPage = React.lazy(() => import("./pages/SorixSecurityPage"));
const SorixForChromePage = React.lazy(() => import("./pages/SorixForChromePage"));
const SkillsPage = React.lazy(() => import("./pages/SkillsPage"));
const SolutionCoding = React.lazy(() => import("./pages/solutions/SolutionCoding"));
const SolutionCustomerSupport = React.lazy(() => import("./pages/solutions/SolutionCustomerSupport"));
const SolutionFinancial = React.lazy(() => import("./pages/solutions/SolutionFinancial"));
const SolutionGovernment = React.lazy(() => import("./pages/solutions/SolutionGovernment"));
const SolutionHealthcare = React.lazy(() => import("./pages/solutions/SolutionHealthcare"));
const SolutionLifeSciences = React.lazy(() => import("./pages/solutions/SolutionLifeSciences"));
const SolutionNonprofits = React.lazy(() => import("./pages/solutions/SolutionNonprofits"));
const SolutionSecurity = React.lazy(() => import("./pages/solutions/SolutionSecurity"));
const ConnectorsPage = React.lazy(() => import("./pages/ConnectorsPage"));
const CoursesPage = React.lazy(() => import("./pages/CoursesPage"));
const CourseDetailPage = React.lazy(() => import("./pages/CourseDetailPage"));
const CompetitionsPage = React.lazy(() => import("./pages/CompetitionsPage"));
const CompetitionDetailPage = React.lazy(() => import("./pages/CompetitionDetailPage"));
const WorkshopsPage = React.lazy(() => import("./pages/scholars/WorkshopsPage"));
const WorkshopDetailPage = React.lazy(() => import("./pages/scholars/WorkshopDetailPage"));
const ScholarsLayout = React.lazy(() => import("./components/scholars/ScholarsLayout"));
const ScholarsHome = React.lazy(() => import("./pages/scholars/ScholarsHome"));
const ScholarsCertificates = React.lazy(() => import("./pages/scholars/ScholarsCertificates"));
const ScholarsDashboard = React.lazy(() => import("./pages/scholars/ScholarsDashboard"));
const ScholarsProfile = React.lazy(() => import("./pages/scholars/ScholarsProfile"));
const CertificateVerifyPage = React.lazy(() => import("./pages/scholars/CertificateVerifyPage"));
const AdminWorkshops = React.lazy(() => import("./admin/pages/AdminWorkshops"));
const AdminScholarsCourses = React.lazy(() => import("./admin/pages/scholars/AdminScholarsCourses"));
const AdminScholarsWorkshops = React.lazy(() => import("./admin/pages/scholars/AdminScholarsWorkshops"));
const AdminScholarsCompetitions = React.lazy(() => import("./admin/pages/scholars/AdminScholarsCompetitions"));
const AdminScholarsEnrollments = React.lazy(() => import("./admin/pages/scholars/AdminScholarsEnrollments"));
const AdminScholarsRevenue = React.lazy(() => import("./admin/pages/scholars/AdminScholarsRevenue"));
const AdminScholarsCertificates = React.lazy(() => import("./admin/pages/scholars/AdminScholarsCertificates"));

const EventsPage = React.lazy(() => import("./pages/EventsPage"));
const InsideSorixCodePage = React.lazy(() => import("./pages/InsideSorixCodePage"));
const InsideSorixCoworkPage = React.lazy(() => import("./pages/InsideSorixCoworkPage"));
const EconomicFuturesPage = React.lazy(() => import("./pages/EconomicFuturesPage"));
const ResearchPage = React.lazy(() => import("./pages/ResearchPage"));
const SecurityCompliancePage = React.lazy(() => import("./pages/SecurityCompliancePage"));
const TransparencyPage = React.lazy(() => import("./pages/TransparencyPage"));
const ConsumerHealthPrivacyPage = React.lazy(() => import("./pages/ConsumerHealthPrivacyPage"));
const UsagePolicyPage = React.lazy(() => import("./pages/UsagePolicyPage"));

const queryClient = new QueryClient();

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
);

// Small helper for slug-preserving redirects (used to migrate /courses/:slug → /sorixscholars/courses/:slug)
import { useParams as _useParams } from "react-router-dom";
const RedirectWithSlug = ({ to }) => {
  const { slug } = _useParams();
  return <Navigate to={`${to}/${slug}`} replace />;
};

const App = () => (
  <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Sonner position="top-center" />
          <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={null}><PageViewTracker /></Suspense>
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/health" element={<HealthPage />} />
                <Route path="/agro" element={<AgroPage />} />
                <Route path="/legends" element={<LegendsPage />} />
                <Route path="/cineshoot" element={<CineshootPage />} />
                <Route path="/imagine" element={<ImaginePage />} />
                <Route path="/deck" element={<DeckPage />} />
                <Route path="/agent" element={<CoWorkPage />} />
                <Route path="/agent/connections" element={
                  <ProtectedRoute>
                    <ConnectionsPage />
                  </ProtectedRoute>
                } />
                <Route path="/flowbuilder" element={<FlowBuilderPage />} />
                <Route path="/tools" element={<ToolsPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="/refund-policy" element={<RefundPolicy />} />
                <Route path="/about-us" element={<AboutUsPage />} />
                <Route path="/about-sorix-lab" element={<AboutSorixLab />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="users/:id" element={<AdminUserProfile />} />
                  <Route path="chat" element={<ChatDashboard />} />
                  <Route path="ai/usage" element={<AdminAIUsage />} />
                  <Route path="ai/tokens" element={<AdminAITokens />} />
                  <Route path="ai/live" element={<AdminAILive />} />
                  <Route path="revenue" element={<AdminRevenue />} />
                  <Route path="revenue/subscriptions" element={<AdminSubscriptions />} />
                  <Route path="revenue/invoices" element={<AdminInvoices />} />
                  <Route path="revenue/coupons" element={<AdminCoupons />} />
                  <Route path="content/flags" element={<AdminFlags />} />
                  <Route path="content/announcements" element={<AdminAnnouncements />} />
                  <Route path="content/prompts" element={<AdminPrompts />} />
                  <Route path="support/tickets" element={<AdminTickets />} />
                  <Route path="feedback" element={<AdminFeedback />} />
                  <Route path="system/health" element={<AdminSystemHealth />} />
                  <Route path="system/api-keys" element={<AdminApiKeys />} />
                  <Route path="audit" element={<AdminAudit />} />
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="broadcasts" element={<AdminBroadcasts />} />
                  <Route path="database" element={<AdminDatabase />} />
                  <Route path="content/workshops" element={<AdminWorkshops />} />

                </Route>
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/case-studies" element={<CaseStudiesPage />} />
                <Route path="/docs" element={<DocsPage />} />
                <Route path="/press" element={<PressPage />} />
                <Route path="/careers" element={<CareersPage />} />
                <Route path="/partners" element={<PartnersPage />} />
                {/* Specific solution routes (declared BEFORE the dynamic :slug) */}
                <Route path="/solutions/coding" element={<SolutionCoding />} />
                <Route path="/solutions/customer-support" element={<SolutionCustomerSupport />} />
                <Route path="/solutions/financial-services" element={<SolutionFinancial />} />
                <Route path="/solutions/government" element={<SolutionGovernment />} />
                <Route path="/solutions/healthcare" element={<SolutionHealthcare />} />
                <Route path="/solutions/life-sciences" element={<SolutionLifeSciences />} />
                <Route path="/solutions/nonprofits" element={<SolutionNonprofits />} />
                <Route path="/solutions/security" element={<SolutionSecurity />} />
                <Route path="/solutions/:slug" element={<SolutionsPage />} />
                <Route path="/developer-api" element={<DeveloperApiPage />} />
                {/* Features pages */}
                <Route path="/sorix-security" element={<SorixSecurityPage />} />
                <Route path="/sorix-for-chrome" element={<SorixForChromePage />} />
                <Route path="/skills" element={<SkillsPage />} />
                {/* Resources pages */}
                <Route path="/connectors" element={<ConnectorsPage />} />
                {/* Sorix Scholars — nested under /sorixscholars with its own layout */}
                <Route path="/sorixscholars" element={<ScholarsLayout />}>
                  <Route index element={<ScholarsHome />} />
                  <Route path="courses" element={<CoursesPage />} />
                  <Route path="courses/:slug" element={<CourseDetailPage />} />
                  <Route path="competitions" element={<CompetitionsPage />} />
                  <Route path="competitions/:slug" element={<CompetitionDetailPage />} />
                  <Route path="workshops" element={<WorkshopsPage />} />
                  <Route path="workshops/:slug" element={<WorkshopDetailPage />} />
                  <Route path="certificates" element={<ScholarsCertificates />} />
                  <Route path="dashboard" element={<ScholarsDashboard />} />
                  <Route path="profile" element={<ScholarsProfile />} />
                  <Route path="verify" element={<CertificateVerifyPage />} />
                  <Route path="verify/:number" element={<CertificateVerifyPage />} />
                </Route>

                {/* Backwards-compatible redirects from old top-level paths */}
                <Route path="/courses" element={<Navigate to="/sorixscholars/courses" replace />} />
                <Route path="/courses/:slug" element={<RedirectWithSlug to="/sorixscholars/courses" />} />
                <Route path="/competitions" element={<Navigate to="/sorixscholars/competitions" replace />} />
                <Route path="/competitions/:slug" element={<RedirectWithSlug to="/sorixscholars/competitions" />} />

                <Route path="/events" element={<EventsPage />} />
                <Route path="/inside-sorix-code" element={<InsideSorixCodePage />} />
                <Route path="/inside-sorix-cowork" element={<InsideSorixCoworkPage />} />
                {/* Company pages */}
                <Route path="/economic-futures" element={<EconomicFuturesPage />} />
                <Route path="/research" element={<ResearchPage />} />
                <Route path="/security-and-compliance" element={<SecurityCompliancePage />} />
                <Route path="/transparency" element={<TransparencyPage />} />
                {/* Legal pages */}
                <Route path="/consumer-health-data-privacy" element={<ConsumerHealthPrivacyPage />} />
                <Route path="/usage-policy" element={<UsagePolicyPage />} />
                {/* Payment Callback Routes */}
                <Route path="/payment/success" element={<PaymentSuccess />} />
                <Route path="/payment/failed" element={<PaymentFailed />} />
                <Route path="/payment/cancel" element={<PaymentCancel />} />
                <Route path="/payment/bkash/callback" element={<PaymentSuccess />} />
                <Route path="/shared/:token" element={<SharedChatPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;
