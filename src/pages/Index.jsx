import Navbar from "@/components/Navbar";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import RolesSection from "@/components/RolesSection";
import ProductivityGains from "@/components/ProductivityGains";
import Workflow from "@/components/Workflow";
import Pricing from "@/components/Pricing";
import Faqs from "@/components/Faqs";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AnnouncementBanner />
      <Hero />
      <Features />
      <RolesSection />
      <ProductivityGains />
      <Workflow />
      <Pricing />
      <Faqs />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
