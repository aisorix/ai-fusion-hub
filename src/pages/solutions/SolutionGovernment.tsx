import InfoPage from "@/components/marketing/InfoPage";
import { Building2, Shield, FileText, Users, Globe, Lock } from "lucide-react";

export default function SolutionGovernment() {
  return (
    <InfoPage
      seoTitle="Government | AI Sorix for Public Sector & Civic Agencies"
      seoDescription="AI Sorix helps governments deliver citizen services faster with secure AI for policy analysis, document drafting, multilingual support, and operational efficiency."
      path="/solutions/government"
      schemaType="Service"
      about="AI for government, AI for public sector, civic AI"
      eyebrow="Government"
      title="AI Sorix for the public sector"
      subtitle="Help civil servants serve more citizens with AI that drafts policy, summarizes legislation, translates communications, and powers multilingual citizen-facing assistants."
      features={[
        { icon: FileText, title: "Policy & legislation analysis", desc: "Summarize bills, compare amendments, and surface impact analyses in seconds." },
        { icon: Users, title: "Citizen services", desc: "24/7 multilingual virtual assistants for permits, benefits, and information requests." },
        { icon: Globe, title: "Multilingual reach", desc: "Communicate with constituents in 100+ languages with culturally aware translations." },
        { icon: Shield, title: "Sovereign deployment", desc: "Regional data residency, on-prem options, and FedRAMP-aligned security controls." },
        { icon: Lock, title: "Records retention", desc: "Immutable audit trails and compliant retention for FOIA and public records laws." },
        { icon: Building2, title: "Inter-agency collaboration", desc: "Workspaces with role-based access for cross-departmental projects." },
      ]}
      faqs={[
        { q: "Can AI Sorix be deployed in a sovereign cloud?", a: "Yes. Enterprise plans include regional residency and isolated deployments for government workloads." },
      ]}
    />
  );
}
