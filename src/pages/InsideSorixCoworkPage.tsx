import InfoPage from "@/components/marketing/InfoPage";
import { Bot, Workflow, Layers, Zap, Eye, Sparkles } from "lucide-react";

export default function InsideSorixCoworkPage() {
  return (
    <InfoPage
      seoTitle="Inside Sorix Cowork | AI Sorix Multi-Agent Autonomous Workspace"
      seoDescription="Sorix Cowork is a 3-panel multi-agent workspace where AI Sorix agents plan, execute, and report on tasks autonomously — with human oversight and approvals."
      path="/inside-sorix-cowork"
      schemaType="Article"
      about="Sorix Cowork, multi-agent AI workspace, AI agents"
      eyebrow="Inside Sorix Cowork"
      title="The autonomous AI workspace inside AI Sorix"
      subtitle="Sorix Cowork pairs you with a team of AI Sorix agents that plan, browse, code, write, and report — under your supervision, in a 3-panel command center."
      features={[
        { icon: Bot, title: "Multi-agent orchestration", desc: "Specialist agents collaborate on long-running tasks — research, writing, automation." },
        { icon: Workflow, title: "Live task monitor", desc: "See every step in real time. Approve, edit, or stop at any point." },
        { icon: Layers, title: "Tool calling loop", desc: "Web search, document gen, file analysis, scheduling, clipboard — all built in." },
        { icon: Eye, title: "Human-in-the-loop", desc: "Configure approval gates for sensitive actions like sending email or running code." },
        { icon: Zap, title: "Connectors integration", desc: "Sorix Cowork agents act in your connected apps — Gmail, Slack, GitHub, and more." },
        { icon: Sparkles, title: "Agent templates", desc: "Start from 50+ pre-built agent recipes or build your own." },
      ]}
    />
  );
}
