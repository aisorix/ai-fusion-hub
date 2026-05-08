import InfoPage from "@/components/marketing/InfoPage";
import { FlaskConical, BookOpen, Brain, Shield, Cpu, Sparkles } from "lucide-react";

export default function ResearchPage() {
  return (
    <InfoPage
      seoTitle="Research | AI Sorix Frontier AI Research & Open Publications"
      seoDescription="AI Sorix Research advances frontier AI — model evaluation, alignment, multimodal reasoning, and agentic systems. Read our papers and open benchmarks."
      path="/research"
      schemaType="Article"
      about="AI research, AI safety research, AI alignment"
      eyebrow="Research"
      title="AI Sorix Research"
      subtitle="We push the frontier of useful AI. From multi-model routing to agent reliability, AI Sorix Research publishes findings, datasets, and open benchmarks for the broader community."
      features={[
        { icon: Brain, title: "Multimodal reasoning", desc: "Studying how vision-language models combine evidence across modalities." },
        { icon: Cpu, title: "Smart routing", desc: "Open research on per-query model selection — up to 10x cost savings." },
        { icon: FlaskConical, title: "Agent reliability", desc: "Benchmarks and methods for trustworthy long-horizon agentic tasks." },
        { icon: Shield, title: "Safety & alignment", desc: "Red-teaming, refusal calibration, and prompt-injection defense research." },
        { icon: BookOpen, title: "Open publications", desc: "All major AI Sorix research is published open-access on arXiv and our blog." },
        { icon: Sparkles, title: "Collaborations", desc: "We partner with universities and labs worldwide — get in touch to collaborate." },
      ]}
    />
  );
}
