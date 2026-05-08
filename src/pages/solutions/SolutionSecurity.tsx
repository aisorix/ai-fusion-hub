import InfoPage from "@/components/marketing/InfoPage";
import { ShieldCheck, AlertTriangle, FileSearch, Lock, Eye, Bot } from "lucide-react";

export default function SolutionSecurity() {
  return (
    <InfoPage
      seoTitle="Security | AI Sorix for SOC, GRC & Cybersecurity Teams"
      seoDescription="AI Sorix accelerates security operations with AI for threat triage, log analysis, policy drafting, and incident response — built on a zero-trust platform."
      path="/solutions/security"
      schemaType="Service"
      about="AI for cybersecurity, AI for SOC, AI for GRC"
      eyebrow="Security"
      title="AI Sorix for security and risk teams"
      subtitle="Cut alert fatigue, automate triage, and accelerate investigations with AI Sorix — the AI workspace built for SOC analysts, GRC leads, and security engineers."
      features={[
        { icon: AlertTriangle, title: "Threat triage", desc: "AI Sorix summarizes alerts, correlates signals, and recommends next actions in seconds." },
        { icon: FileSearch, title: "Log & evidence analysis", desc: "Parse massive log files and packet captures. AI Sorix surfaces anomalies with citations." },
        { icon: ShieldCheck, title: "Policy drafting", desc: "Generate ISO 27001, SOC 2, and NIST-aligned policies tailored to your environment." },
        { icon: Bot, title: "SOC copilot agents", desc: "Autonomous agents that handle Tier-1 triage and escalate with full investigation context." },
        { icon: Eye, title: "Vulnerability summaries", desc: "Instant, business-context-aware writeups of CVEs and threat intel." },
        { icon: Lock, title: "Built on zero-trust", desc: "AI Sorix itself runs on zero-trust architecture — security teams know we live by our own standards." },
      ]}
      faqs={[
        { q: "Can AI Sorix run in an air-gapped environment?", a: "Enterprise plans support BYOK and isolated deployments. Contact sales for specifics." },
      ]}
    />
  );
}
