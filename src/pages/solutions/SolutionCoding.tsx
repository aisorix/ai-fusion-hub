import InfoPage from "@/components/marketing/InfoPage";
import { Code2, GitBranch, Bug, Zap, TestTube, FileCode } from "lucide-react";

export default function SolutionCoding() {
  return (
    <InfoPage
      seoTitle="Coding | AI Sorix for Software Developers & Engineering Teams"
      seoDescription="AI Sorix accelerates coding with multi-model code generation, refactoring, debugging, test writing, and GitHub sync. Ship faster with AI pair programming."
      path="/solutions/coding"
      schemaType="Service"
      about="AI for software developers, AI pair programming, code generation"
      eyebrow="Coding"
      title="AI Sorix is the pair programmer your team has been waiting for"
      subtitle="Generate, refactor, review, and debug code across any language with frontier models — GPT-5, Claude Sonnet 4, Gemini 2.5 Pro, and DeepSeek — in one workspace synced to GitHub."
      features={[
        { icon: Code2, title: "Multi-language code gen", desc: "TypeScript, Python, Go, Rust, Java, SQL, Solidity — AI Sorix understands your stack and conventions." },
        { icon: Bug, title: "Smart debugging", desc: "Paste a stack trace or error. AI Sorix isolates root cause and proposes a tested fix." },
        { icon: TestTube, title: "Test generation", desc: "Auto-generate unit, integration, and edge-case tests from any function." },
        { icon: GitBranch, title: "GitHub sync", desc: "Connect a repo and let AI Sorix open PRs, review diffs, and write commit messages." },
        { icon: FileCode, title: "Code review", desc: "Senior-engineer-grade reviews catching security flaws, perf regressions, and style issues." },
        { icon: Zap, title: "Refactor at scale", desc: "Modernize legacy code, migrate frameworks, and apply patterns across whole files." },
      ]}
      bullets={[
        "VS Code-style file explorer in browser",
        "Inline diffs with accept/reject",
        "Up to 10x token discount on Smart Auto",
        "Bring your own keys for any model",
        "Works with monorepos via GitHub sync",
        "Free tier includes daily coding tokens",
      ]}
      faqs={[
        { q: "Does AI Sorix support my language?", a: "Yes. AI Sorix supports every mainstream and most niche languages, with deep optimization for TypeScript, Python, Go, Rust, and Java." },
        { q: "Is my code used to train models?", a: "Never. Your code stays in your workspace and is never shared with model providers for training." },
      ]}
    />
  );
}
