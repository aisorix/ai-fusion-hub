import React, { Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
const ImaginePage = React.lazy(() => import("./pages/ImaginePage"));
const SharedChatPage = React.lazy(() => import("./pages/SharedChatPage"));
const DeckPage = React.lazy(() => import("./pages/DeckPage"));
const CoWorkPage = React.lazy(() => import("./pages/CoWorkPage"));
const ConnectionsPage = React.lazy(() => import("./pages/ConnectionsPage"));

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

const App = () => (
  <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Sonner position="top-center" />
          <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/chat" element={
                  <ProtectedRoute>
                    <ChatPage />
                  </ProtectedRoute>
                } />
                <Route path="/health" element={
                  <ProtectedRoute>
                    <HealthPage />
                  </ProtectedRoute>
                } />
                <Route path="/agro" element={
                  <ProtectedRoute>
                    <AgroPage />
                  </ProtectedRoute>
                } />
                <Route path="/legends" element={
                  <ProtectedRoute>
                    <LegendsPage />
                  </ProtectedRoute>
                } />
                <Route path="/imagine" element={
                  <ProtectedRoute>
                    <ImaginePage />
                  </ProtectedRoute>
                } />
                <Route path="/deck" element={
                  <ProtectedRoute>
                    <DeckPage />
                  </ProtectedRoute>
                } />
                <Route path="/agent" element={
                  <ProtectedRoute>
                    <CoWorkPage />
                  </ProtectedRoute>
                } />
                <Route path="/agent/connections" element={
                  <ProtectedRoute>
                    <ConnectionsPage />
                  </ProtectedRoute>
                } />
                <Route path="/flowbuilder" element={
                  <ProtectedRoute>
                    <FlowBuilderPage />
                  </ProtectedRoute>
                } />
                <Route path="/tools" element={
                  <ProtectedRoute>
                    <ToolsPage />
                  </ProtectedRoute>
                } />
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
                <Route path="/admin/chat" element={<ChatDashboard />} />
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
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/courses/:slug" element={<CourseDetailPage />} />
                <Route path="/competitions" element={<CompetitionsPage />} />
                <Route path="/competitions/:slug" element={<CompetitionDetailPage />} />
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
