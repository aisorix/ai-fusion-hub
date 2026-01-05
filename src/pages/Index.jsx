import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Workflow from "@/components/Workflow";
import Pricing from "@/components/Pricing";
import Faqs from "@/components/Faqs";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Features />
      <Workflow />
      <Pricing />
      <Faqs />
      <Footer />
    </div>
  );
};

export default Index;
