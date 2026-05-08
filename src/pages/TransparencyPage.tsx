import InfoPage from "@/components/marketing/InfoPage";
import { Eye, FileText, Shield, Users, Database, Scale } from "lucide-react";

export default function TransparencyPage() {
  return (
    <InfoPage
      seoTitle="Transparency | AI Sorix Model Disclosures, Data Use & Content Policy"
      seoDescription="AI Sorix publishes how our models are routed, what data they're trained on, our content policy, and how we handle government requests — full transparency."
      path="/transparency"
      about="AI transparency, model transparency, AI accountability"
      eyebrow="Transparency"
      title="Radical transparency on how AI Sorix works"
      subtitle="We publish what models we use, how we route between them, what data they were trained on, our content policy, and how we respond to government and legal requests."
      features={[
        { icon: Eye, title: "Model disclosures", desc: "Every response in AI Sorix labels which model produced it. No hidden fallbacks." },
        { icon: Database, title: "Training data principles", desc: "AI Sorix never trains on customer data. Third-party model training data is disclosed where known." },
        { icon: FileText, title: "Content policy", desc: "Clear, public rules on what AI Sorix will and won't generate. Enforcement is explainable." },
        { icon: Shield, title: "Safety practices", desc: "Red-team results, refusal benchmarks, and incident reports published quarterly." },
        { icon: Scale, title: "Government requests", desc: "Annual transparency report on subpoenas, takedown requests, and how we respond." },
        { icon: Users, title: "User controls", desc: "Export, delete, and audit your AI Sorix data anytime — no friction, no waiting period." },
      ]}
    />
  );
}
