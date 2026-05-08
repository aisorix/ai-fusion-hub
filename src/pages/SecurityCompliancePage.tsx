import InfoPage from "@/components/marketing/InfoPage";
import { ShieldCheck, FileCheck, Lock, Globe, Users, Eye } from "lucide-react";

export default function SecurityCompliancePage() {
  return (
    <InfoPage
      seoTitle="Security & Compliance | AI Sorix SOC 2, GDPR, HIPAA & DPA"
      seoDescription="AI Sorix maintains SOC 2 Type II readiness, GDPR DPA, HIPAA-aligned controls, transparent sub-processors, and a published responsible disclosure program."
      path="/security-and-compliance"
      about="SOC 2, GDPR, HIPAA, AI compliance"
      eyebrow="Security & Compliance"
      title="Security and compliance you can audit"
      subtitle="AI Sorix is built and operated to the highest standards — independently audited, transparently documented, and ready for regulated industries."
      features={[
        { icon: ShieldCheck, title: "SOC 2 Type II", desc: "AI Sorix is SOC 2 Type II ready and undergoing audit. Reports available under NDA." },
        { icon: Globe, title: "GDPR & UK GDPR", desc: "Full DPA available. EU and UK data residency on enterprise plans." },
        { icon: FileCheck, title: "HIPAA-aligned", desc: "BAAs available for healthcare customers using AI Sorix in PHI workflows." },
        { icon: Users, title: "Sub-processors", desc: "Public, version-controlled list of every sub-processor AI Sorix uses." },
        { icon: Lock, title: "Encryption & keys", desc: "AES-256 at rest, TLS 1.3 in transit, BYOK and HSM-backed key management." },
        { icon: Eye, title: "Disclosure program", desc: "Responsible disclosure via security@aisorix.com — bounties for valid reports." },
      ]}
      sections={[
        { title: "Request our trust documents", body: "Email security@aisorix.com to request our SOC 2 report, DPA, sub-processor list, penetration test summary, or to start a vendor security review." },
      ]}
    />
  );
}
