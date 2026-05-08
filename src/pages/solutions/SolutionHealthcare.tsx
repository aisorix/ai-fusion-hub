import InfoPage from "@/components/marketing/InfoPage";
import { HeartPulse, Stethoscope, FileText, Microscope, Shield, Brain } from "lucide-react";

export default function SolutionHealthcare() {
  return (
    <InfoPage
      seoTitle="Healthcare | AI Sorix for Clinicians, Hospitals & Health Systems"
      seoDescription="AI Sorix supports healthcare with HIPAA-ready AI for clinical documentation, literature review, patient communication, and decision support — never replacing clinicians."
      path="/solutions/healthcare"
      schemaType="Service"
      about="AI for healthcare, clinical AI, AI for hospitals"
      eyebrow="Healthcare"
      title="AI Sorix for healthcare professionals"
      subtitle="Reduce documentation burden, accelerate research, and improve patient communication with HIPAA-aligned AI that puts clinicians in control."
      features={[
        { icon: Stethoscope, title: "Clinical documentation", desc: "Ambient note generation from voice — SOAP notes, discharge summaries, referral letters." },
        { icon: Microscope, title: "Literature review", desc: "Synthesize PubMed and clinical guidelines with cited evidence on demand." },
        { icon: Brain, title: "Decision support", desc: "Differential generation and treatment option summaries — always with sources, never autonomous." },
        { icon: FileText, title: "Patient communication", desc: "Translate complex medical info into patient-friendly language in any language." },
        { icon: HeartPulse, title: "Sorix Health tool", desc: "Free 3-step research tool for evidence-based health insights — built into AI Sorix." },
        { icon: Shield, title: "HIPAA-ready", desc: "BAA available, PHI handling controls, audit logs, and zero data retention modes." },
      ]}
      faqs={[
        { q: "Is AI Sorix HIPAA compliant?", a: "AI Sorix offers HIPAA-aligned controls and signs BAAs with healthcare enterprise customers." },
        { q: "Does AI Sorix replace clinical judgment?", a: "No. AI Sorix is a decision-support tool. All clinical decisions remain with licensed professionals." },
      ]}
    />
  );
}
