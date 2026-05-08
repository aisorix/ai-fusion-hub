import InfoPage from "@/components/marketing/InfoPage";
import { TrendingUp, Briefcase, Users, Globe, BookOpen, BarChart3 } from "lucide-react";

export default function EconomicFuturesPage() {
  return (
    <InfoPage
      seoTitle="Economic Futures | AI Sorix Research on AI's Impact on Work & Growth"
      seoDescription="The AI Sorix Economic Futures program studies how frontier AI reshapes jobs, productivity, and global growth — and how to ensure broad-based benefit."
      path="/economic-futures"
      schemaType="Article"
      about="AI economy, AI and jobs, AI productivity research"
      eyebrow="Economic Futures"
      title="Understanding AI's impact on work, growth, and opportunity"
      subtitle="AI Sorix's Economic Futures program studies how AI reshapes labor markets and productivity — and publishes research, data, and tools to help societies adapt."
      features={[
        { icon: TrendingUp, title: "Productivity research", desc: "Field studies measuring how AI Sorix changes time-to-output across professions." },
        { icon: Briefcase, title: "Labor market analysis", desc: "Quarterly reports on which tasks AI augments, automates, or transforms." },
        { icon: Users, title: "Workforce transitions", desc: "Tools and partnerships to help workers reskill alongside AI adoption." },
        { icon: Globe, title: "Global access", desc: "Free AI Sorix tools (Health, Agro) for emerging markets where impact is highest." },
        { icon: BookOpen, title: "Open publications", desc: "All research is open-access and citable. No paywalls, no gates." },
        { icon: BarChart3, title: "Economic data", desc: "Public datasets on AI usage, adoption, and outcomes — updated monthly." },
      ]}
    />
  );
}
