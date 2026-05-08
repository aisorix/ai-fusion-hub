import InfoPage from "@/components/marketing/InfoPage";
import { CheckCircle2, XCircle, AlertTriangle, Shield, Users, Scale } from "lucide-react";

export default function UsagePolicyPage() {
  return (
    <InfoPage
      seoTitle="Usage Policy | AI Sorix Acceptable Use Guidelines"
      seoDescription="The AI Sorix Usage Policy defines acceptable and prohibited use of the platform — how to build responsibly with frontier AI and what is strictly off-limits."
      path="/usage-policy"
      about="AI usage policy, acceptable use policy"
      eyebrow="Legal"
      title="AI Sorix Usage Policy"
      subtitle="These rules govern what you can and can't do with AI Sorix. They apply to every user, plan, and integration. We enforce them to keep AI Sorix safe and useful for everyone."
      features={[
        { icon: CheckCircle2, title: "What you can do", desc: "Build apps, automate work, conduct research, create content, and explore — within the law and these rules." },
        { icon: XCircle, title: "What you can't do", desc: "Generate CSAM, weapons instructions, malware, non-consensual intimate imagery, or content designed to deceive voters." },
        { icon: AlertTriangle, title: "High-risk uses", desc: "Medical, legal, financial, and political advice require human review. AI Sorix output is not a substitute for licensed professionals." },
        { icon: Shield, title: "Security", desc: "Don't attempt to extract model weights, jailbreak safety systems, or use AI Sorix to attack other systems." },
        { icon: Users, title: "Respecting others", desc: "No harassment, doxxing, or impersonation. No content that violates others' IP or privacy." },
        { icon: Scale, title: "Enforcement", desc: "Violations may result in warnings, suspension, or permanent ban. Severe violations are reported to authorities." },
      ]}
      sections={[
        { title: "Reporting violations", body: "Spotted abuse? Email abuse@aisorix.com with details. We triage every report within 24 hours." },
      ]}
      ctaTitle="Build responsibly with AI Sorix"
      ctaDesc="Frontier AI is most useful when everyone uses it safely. Thanks for helping keep AI Sorix a great place to build."
      ctaButton={{ label: "Get Started", to: "/register" }}
    />
  );
}
