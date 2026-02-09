import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import RolesSection from "@/components/RolesSection";
import ProductivityGains from "@/components/ProductivityGains";
import Workflow from "@/components/Workflow";
import Pricing from "@/components/Pricing";
import Faqs from "@/components/Faqs";
import AboutUs from "@/components/AboutUs";
import ContactUs from "@/components/ContactUs";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  // Redirect to /chat after email verification or OAuth
  useEffect(() => {
    const justRegistered = sessionStorage.getItem('justRegistered');
    if (user && !isLoading && justRegistered) {
      sessionStorage.removeItem('justRegistered');
      navigate('/chat');
    }
  }, [user, isLoading, navigate]);
  const chatRef = useRef(null);

  const handleOpenChat = () => {
    chatRef.current?.openChat();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <Hero />
      <Features />
      <RolesSection />
      <ProductivityGains />
      <Workflow />
      <Pricing />
      <Faqs />
      <Testimonials />
      <AboutUs />
      <ContactUs onOpenChat={handleOpenChat} />
      <Footer />
      <ChatWidget ref={chatRef} />
    </div>
  );
};

export default Index;
