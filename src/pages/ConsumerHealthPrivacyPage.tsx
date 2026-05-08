import InfoPage from "@/components/marketing/InfoPage";
import { Heart, Lock, Eye, FileText, Shield, UserCheck } from "lucide-react";

export default function ConsumerHealthPrivacyPage() {
  return (
    <InfoPage
      seoTitle="Consumer Health Data Privacy Policy | AI Sorix"
      seoDescription="AI Sorix's Consumer Health Data Privacy Policy explains how we collect, use, share, and protect health-related data you share with Sorix Health and the platform."
      path="/consumer-health-data-privacy"
      about="Consumer health privacy, health data protection"
      eyebrow="Legal"
      title="Consumer Health Data Privacy Policy"
      subtitle="This policy explains how AI Sorix handles health-related data you share — including queries to Sorix Health, uploaded medical documents, and biometric inputs."
      features={[
        { icon: Heart, title: "Scope", desc: "Applies to all consumer health data processed by AI Sorix, including the free Sorix Health tool." },
        { icon: Lock, title: "How we protect it", desc: "Encrypted at rest (AES-256) and in transit (TLS 1.3). Access strictly role-limited." },
        { icon: Eye, title: "What we collect", desc: "Only what you explicitly submit. We do not infer health conditions from non-health interactions." },
        { icon: UserCheck, title: "Your rights", desc: "Access, correct, export, or delete your health data anytime from your AI Sorix settings." },
        { icon: Shield, title: "We never sell it", desc: "AI Sorix never sells, rents, or shares your health data with advertisers or data brokers." },
        { icon: FileText, title: "Updates", desc: "Material changes are communicated via email and an in-app notice 30 days before taking effect." },
      ]}
      sections={[
        { title: "Contact our privacy team", body: "Questions, requests, or complaints: privacy@aisorix.com. We respond within 5 business days." },
      ]}
      ctaTitle="Questions about your health data?"
      ctaDesc="Reach our privacy team directly — we're here to help."
      ctaButton={{ label: "Contact Privacy Team", to: "/about-us" }}
    />
  );
}
