import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import RefundPolicy from "./pages/RefundPolicy";
import AboutSorixLab from "./pages/AboutSorixLab";
import Reviews from "./pages/Reviews";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ChatDashboard from "./pages/admin/ChatDashboard";
import ChatPage from "./pages/ChatPage";
import Dashboard from "./pages/Dashboard";
import HealthPage from "./pages/HealthPage";
import AgroPage from "./pages/AgroPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import PaymentCancel from "./pages/PaymentCancel";
import LegendsPage from "./pages/LegendsPage";
import ImaginePage from "./pages/ImaginePage";
import SharedChatPage from "./pages/SharedChatPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Sonner position="top-center" />
          <BrowserRouter>
            <ScrollToTop />
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
              {/* Payment Callback Routes */}
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="/payment/failed" element={<PaymentFailed />} />
              <Route path="/payment/cancel" element={<PaymentCancel />} />
              <Route path="/payment/bkash/callback" element={<PaymentSuccess />} />
              <Route path="/shared/:token" element={<SharedChatPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
