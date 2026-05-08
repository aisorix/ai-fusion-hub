import InfoPage from "@/components/marketing/InfoPage";
import { GraduationCap, Zap, Bot, Workflow, Code2, Award } from "lucide-react";

export default function CoursesPage() {
  return (
    <InfoPage
      seoTitle="Courses | AI Sorix Academy — Learn AI, Agents & Prompt Engineering"
      seoDescription="AI Sorix Academy offers free and pro courses on prompt engineering, AI agent building, FlowBuilder mastery, and AI for work — taught by AI Sorix experts."
      path="/courses"
      about="AI courses, prompt engineering courses, AI agent training"
      eyebrow="AI Sorix Academy"
      title="Learn to build with frontier AI"
      subtitle="Free and pro courses that take you from your first prompt to shipping autonomous AI agents — taught by the team behind AI Sorix."
      features={[
        { icon: Zap, title: "Prompt Engineering 101", desc: "Master the fundamentals of prompting GPT, Claude, Gemini, and more. Free." },
        { icon: Bot, title: "Agent Builder Bootcamp", desc: "Design, deploy, and monitor autonomous AI agents with AI Sorix Agent OS." },
        { icon: Workflow, title: "FlowBuilder Mastery", desc: "Visual AI workflows: chain models, tools, and humans in one diagram." },
        { icon: Code2, title: "AI for Developers", desc: "Use AI Sorix as your daily coding copilot — TypeScript, Python, Rust." },
        { icon: GraduationCap, title: "AI for Researchers", desc: "Literature reviews, synthesis, citation hygiene, and writing with AI." },
        { icon: Award, title: "Certifications", desc: "Earn AI Sorix Certified Prompt Engineer and Agent Builder credentials." },
      ]}
      sections={[
        { title: "Self-paced and live cohorts", body: "Every course is available on-demand. Pro members can also join monthly live cohorts with AI Sorix engineers and Q&A sessions." },
      ]}
    />
  );
}
