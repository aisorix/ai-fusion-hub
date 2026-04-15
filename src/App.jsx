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
const FlowBuilderPage = React.lazy(() => import("./pages/FlowBuilderPage"));
const ToolsPage = React.lazy(() => import("./pages/ToolsPage"));
const BlogPage = React.lazy(() => import("./pages/BlogPage"));
const CaseStudiesPage = React.lazy(() => import("./pages/CaseStudiesPage"));
const DocsPage = React.lazy(() => import("./pages/DocsPage"));
const PressPage = React.lazy(() => import("./pages/PressPage"));
const CareersPage = React.lazy(() => import("./pages/CareersPage"));
const PartnersPage = React.lazy(() => import("./pages/PartnersPage"));
const SolutionsPage = React.lazy(() => import("./pages/SolutionsPage"));

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
                <Route path="/about-sorix-lab" element={<AboutSorixLab />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/admin/chat" element={<ChatDashboard />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/case-studies" element={<CaseStudiesPage />} />
                <Route path="/docs" element={<DocsPage />} />
                <Route path="/press" element={<PressPage />} />
                <Route path="/careers" element={<CareersPage />} />
                <Route path="/partners" element={<PartnersPage />} />
                <Route path="/solutions/:slug" element={<SolutionsPage />} />
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
