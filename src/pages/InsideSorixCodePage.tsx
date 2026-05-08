import InfoPage from "@/components/marketing/InfoPage";
import { Code2, GitBranch, Folder, Terminal, Bug, Sparkles } from "lucide-react";

export default function InsideSorixCodePage() {
  return (
    <InfoPage
      seoTitle="Inside Sorix Code | AI Sorix Coding Tool Architecture & Capabilities"
      seoDescription="A deep dive into Sorix Code — the AI Sorix coding workspace with VS Code-style explorer, GitHub sync, multi-model code gen, and agentic refactoring."
      path="/inside-sorix-code"
      schemaType="Article"
      about="Sorix Code, AI coding tool, AI IDE"
      eyebrow="Inside Sorix Code"
      title="A look inside the AI Sorix coding workspace"
      subtitle="Sorix Code is a full AI-native coding environment — file explorer, multi-model agent, GitHub sync, and iterative refactoring — running entirely in your browser."
      features={[
        { icon: Folder, title: "VS Code-style explorer", desc: "Navigate, edit, and create files with a familiar tree view." },
        { icon: GitBranch, title: "GitHub sync", desc: "Connect any repo. Pull, edit, commit, and push without leaving AI Sorix." },
        { icon: Code2, title: "Multi-model gen", desc: "Route to GPT-5, Claude Sonnet 4, Gemini 2.5 Pro, or DeepSeek per task." },
        { icon: Bug, title: "Agentic debugging", desc: "Paste an error — Sorix Code reads your repo, finds root cause, and proposes a fix." },
        { icon: Terminal, title: "Inline diff review", desc: "Every change is shown as a reviewable diff before it's applied." },
        { icon: Sparkles, title: "Smart Auto routing", desc: "Sorix Code picks the best model for each step — saving up to 10x in tokens." },
      ]}
      sections={[
        { title: "Built for real engineering work", body: "Sorix Code understands monorepos, project conventions, and your existing test suite. It writes code that matches your style — and refuses when it should ask first." },
      ]}
    />
  );
}
