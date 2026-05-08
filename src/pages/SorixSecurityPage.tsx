import InfoPage from "@/components/marketing/InfoPage";
import { Shield, Lock, Key, Server, Eye, FileCheck } from "lucide-react";

export default function SorixSecurityPage() {
  return (
    <InfoPage
      seoTitle="Sorix Security | AI Sorix Zero-Trust AI Platform Security"
      seoDescription="AI Sorix is built on a zero-trust security model with end-to-end encryption, row-level access control, SSO, and SOC 2 readiness. Trusted by global teams."
      path="/sorix-security"
      schemaType="WebPage"
      about="AI security, zero-trust architecture, enterprise AI"
      eyebrow="Sorix Security"
      title="Enterprise-grade security for every AI workflow"
      subtitle="AI Sorix protects your prompts, files, and conversations with zero-trust architecture, end-to-end encryption, and granular access control — so you can adopt frontier AI without compromising data."
      features={[
        { icon: Shield, title: "Zero-Trust Architecture", desc: "Every request is authenticated, authorized, and audited. No implicit trust between services or users." },
        { icon: Lock, title: "Encryption Everywhere", desc: "TLS 1.3 in transit and AES-256 at rest. Keys rotated automatically and managed via HSM-backed providers." },
        { icon: Key, title: "Row-Level Security", desc: "Postgres RLS ensures users can only ever read or modify the rows they own — enforced at the database layer." },
        { icon: Server, title: "Isolated Tenancy", desc: "Workspaces are logically isolated. Edge functions enforce JWT verification on every privileged call." },
        { icon: Eye, title: "Audit Logging", desc: "Every login, model call, and data access is logged with immutable timestamps for compliance review." },
        { icon: FileCheck, title: "SOC 2 & GDPR Aligned", desc: "Controls mapped to SOC 2 Type II and GDPR. HIPAA-ready architecture for regulated workloads." },
      ]}
      sections={[
        { title: "Built for the AI era", body: "Generative AI introduces new attack surfaces — prompt injection, model exfiltration, and data leakage. AI Sorix counters every one with input sanitization, output filtering, model-routing guardrails, and continuous red-team testing of all production endpoints." },
        { title: "Your data is yours", body: "AI Sorix never trains on customer data. Conversations, files, and embeddings stay in your workspace and are deletable on demand. Sub-processor list is published and version-controlled." },
      ]}
      faqs={[
        { q: "Does AI Sorix train models on my data?", a: "No. Customer data is never used to train AI Sorix or any third-party model. All inference is request-scoped." },
        { q: "Where is my data stored?", a: "Data is stored in encrypted Postgres with row-level security. Regional residency options are available for enterprise plans." },
        { q: "Is AI Sorix SOC 2 compliant?", a: "AI Sorix is SOC 2 Type II ready and undergoing audit. GDPR DPA and HIPAA BAA are available on request for enterprise customers." },
      ]}
    />
  );
}
