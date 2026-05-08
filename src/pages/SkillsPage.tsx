import InfoPage from "@/components/marketing/InfoPage";
import { Sparkles, Code2, PenTool, Search, Briefcase, GraduationCap } from "lucide-react";

export default function SkillsPage() {
  return (
    <InfoPage
      seoTitle="Skills | AI Sorix Reusable AI Skills Library"
      seoDescription="AI Sorix Skills are pre-built, reusable AI workflows for writing, coding, research, design, and analysis. Install in one click and run with any frontier model."
      path="/skills"
      about="AI Skills, prompt library, reusable AI workflows"
      eyebrow="AI Sorix Skills"
      title="Reusable AI Skills for every job to be done"
      subtitle="Skills are pre-built AI workflows you can install and run in one click. From SEO writing to code review, financial modeling to research synthesis — start from a proven recipe instead of a blank prompt."
      features={[
        { icon: PenTool, title: "Writing & Editing", desc: "SEO blog drafts, social posts, sales emails, technical docs — tuned for tone and audience." },
        { icon: Code2, title: "Coding & DevOps", desc: "Code review, refactor suggestions, test generation, regex builders, and SQL helpers." },
        { icon: Search, title: "Research & Analysis", desc: "Literature reviews, competitive scans, market sizing, and source-cited summaries." },
        { icon: Briefcase, title: "Business & Finance", desc: "Pitch decks, OKRs, financial models, contract review, and investor updates." },
        { icon: GraduationCap, title: "Learning & Tutoring", desc: "Personalized study plans, flashcards, exam prep, and concept explainers." },
        { icon: Sparkles, title: "Custom Skills", desc: "Build your own Skill from any prompt and share it across your team or workspace." },
      ]}
      sections={[
        { title: "How Skills work", body: "Each Skill is a portable bundle: a system prompt, recommended model, default tools (web search, file analysis, image gen), and example inputs. Run a Skill in AI Sorix Chat, Agents, or via the API — it produces consistent, on-brand output every time." },
      ]}
      faqs={[
        { q: "Are Skills free?", a: "Yes. The Skills library is free for all AI Sorix users. Token costs apply only to the model calls Skills make." },
        { q: "Can I build private Skills for my team?", a: "Yes. Pro and Premium plans include workspace-private Skills with role-based access." },
      ]}
    />
  );
}
