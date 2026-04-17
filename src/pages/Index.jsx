import { useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
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
  const location = useLocation();
  const { user, isLoading } = useAuth();

  // Redirect to /chat after email verification or OAuth
  useEffect(() => {
    const justRegistered = sessionStorage.getItem('justRegistered');
    if (user && !isLoading && justRegistered) {
      sessionStorage.removeItem('justRegistered');
      navigate('/chat');
    }
  }, [user, isLoading, navigate]);

  // Cross-page scroll: navigate('/', { state: { scrollTo: 'pricing' } }) → scroll here
  useEffect(() => {
    const target = location.state?.scrollTo;
    if (!target) return;
    // Wait for sections to mount, then scroll
    const timer = setTimeout(() => {
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Clear state so refresh doesn't re-scroll
      window.history.replaceState({}, document.title);
    }, 120);
    return () => clearTimeout(timer);
  }, [location.state]);

  const chatRef = useRef(null);

  const handleOpenChat = () => {
    chatRef.current?.openChat();
  };

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "AI Sorix",
      "url": "https://www.aisorix.com",
      "logo": "https://www.aisorix.com/logo.png",
      "description": "AI Sorix is a leading AI research ecosystem built in Bangladesh, offering multi-model AI chat, image generation, presentations, health analysis, agriculture AI, and autonomous agents.",
      "foundingLocation": { "@type": "Place", "name": "Dhaka, Bangladesh" },
      "areaServed": ["Bangladesh", "Asia", "Worldwide"],
      "sameAs": [
        "https://facebook.com/profile.php?id=61586687081259",
        "https://instagram.com/aisorix_",
        "https://youtube.com/@aisorix",
        "https://twitter.com/aisorix_",
        "https://linkedin.com/company/aisorix"
      ],
      "contactPoint": { "@type": "ContactPoint", "email": "support@aisorix.com", "contactType": "customer support" }
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "AI Sorix",
      "url": "https://www.aisorix.com",
      "applicationCategory": "Artificial Intelligence",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD", "description": "Free tier available" },
      "featureList": ["Multi-Model AI Chat", "AI Image Generation", "AI Presentations", "Health Analysis", "Agriculture AI", "AI Agents", "Flow Builder", "Sorix Legends"]
    },
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Sorix Lab",
      "description": "AI research company building AI Sorix — the top AI platform in Bangladesh and Asia.",
      "url": "https://www.aisorix.com",
      "address": { "@type": "PostalAddress", "addressLocality": "Dhaka", "addressCountry": "BD" },
      "geo": { "@type": "GeoCoordinates", "latitude": "23.8103", "longitude": "90.4125" },
      "areaServed": [
        { "@type": "Country", "name": "Bangladesh" },
        { "@type": "Continent", "name": "Asia" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="AI Sorix | #1 AI Research Ecosystem in Bangladesh & Asia"
        description="AI Sorix is the top AI platform in Bangladesh and Asia. Multi-model AI chat, image generation, presentations, health AI, agriculture AI, and autonomous agents — all in one workspace."
        path="/"
      />
      {jsonLd.map((data, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
      ))}
      <meta name="geo.region" content="BD" />
      <meta name="geo.placename" content="Dhaka" />
      <meta name="geo.position" content="23.8103;90.4125" />
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
