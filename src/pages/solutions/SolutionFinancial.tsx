import InfoPage from "@/components/marketing/InfoPage";
import { Landmark, TrendingUp, Shield, Calculator, FileSearch, BarChart3 } from "lucide-react";

export default function SolutionFinancial() {
  return (
    <InfoPage
      seoTitle="Financial Services | AI Sorix for Banks, Fintech & Wealth Management"
      seoDescription="AI Sorix powers financial services with secure AI for research, compliance, document analysis, modeling, and client communication — built for regulated workloads."
      path="/solutions/financial-services"
      schemaType="Service"
      about="AI for financial services, AI for banking, AI for fintech"
      eyebrow="Financial Services"
      title="Secure AI for banking, fintech, and wealth management"
      subtitle="From earnings analysis to compliance review, AI Sorix gives finance teams a private, audit-ready AI workspace with the strictest controls and the most capable models."
      features={[
        { icon: TrendingUp, title: "Market & equity research", desc: "Summarize earnings calls, parse 10-Ks, and benchmark companies in minutes." },
        { icon: Calculator, title: "Financial modeling", desc: "Build DCFs, sensitivity analyses, and scenario models with AI Sorix in spreadsheets." },
        { icon: FileSearch, title: "Document analysis", desc: "Extract terms from contracts, prospectuses, and credit agreements with cited evidence." },
        { icon: Shield, title: "Compliance-ready", desc: "Audit logs, SOC 2 controls, and zero-data-retention modes for regulated environments." },
        { icon: BarChart3, title: "Client reporting", desc: "Generate personalized portfolio commentary and quarterly letters at scale." },
        { icon: Landmark, title: "KYC & onboarding", desc: "Automate KYC document review and red-flag detection with explainable AI." },
      ]}
      faqs={[
        { q: "Is AI Sorix suitable for regulated workloads?", a: "Yes. AI Sorix offers SOC 2-aligned controls, regional data residency, and BYOK encryption for financial services." },
        { q: "Can it analyze SEC filings?", a: "Yes. Upload any 10-K, 10-Q, or earnings transcript and AI Sorix returns cited summaries and comparisons." },
      ]}
    />
  );
}
