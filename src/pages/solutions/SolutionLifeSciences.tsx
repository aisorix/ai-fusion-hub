import InfoPage from "@/components/marketing/InfoPage";
import { FlaskConical, Dna, Search, FileText, Database, Microscope } from "lucide-react";

export default function SolutionLifeSciences() {
  return (
    <InfoPage
      seoTitle="Life Sciences | AI Sorix for Biotech, Pharma & Research Labs"
      seoDescription="AI Sorix accelerates life sciences with AI for literature review, protocol design, regulatory writing, and data analysis — secure, citable, and lab-ready."
      path="/solutions/life-sciences"
      schemaType="Service"
      about="AI for life sciences, AI for biotech, AI for pharma research"
      eyebrow="Life Sciences"
      title="AI Sorix for life sciences research"
      subtitle="From literature synthesis to regulatory writing, AI Sorix gives scientists frontier AI grounded in primary sources — with the controls biotech and pharma demand."
      features={[
        { icon: Search, title: "Literature synthesis", desc: "Search PubMed, bioRxiv, and patents. AI Sorix returns cited reviews in your domain." },
        { icon: FlaskConical, title: "Protocol design", desc: "Draft and iterate experimental protocols with model-aware safety reasoning." },
        { icon: FileText, title: "Regulatory writing", desc: "Accelerate INDs, NDAs, and CTAs with AI Sorix structured-doc workflows." },
        { icon: Dna, title: "Bioinformatics", desc: "Pair AI Sorix coding with R, Python, and Bioconductor for analysis pipelines." },
        { icon: Database, title: "Knowledge management", desc: "Build a private, queryable knowledge base of internal SOPs and research." },
        { icon: Microscope, title: "Lab-ready security", desc: "IP-grade encryption, audit logs, and zero-retention modes for sensitive R&D." },
      ]}
      faqs={[
        { q: "Can AI Sorix handle proprietary research data?", a: "Yes. With workspace isolation and zero data retention modes, your IP stays yours." },
      ]}
    />
  );
}
