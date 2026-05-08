import InfoPage from "@/components/marketing/InfoPage";
import { Headphones, MessageSquare, Clock, Languages, BarChart3, Bot } from "lucide-react";

export default function SolutionCustomerSupport() {
  return (
    <InfoPage
      seoTitle="Customer Support | AI Sorix for Support Teams & CX Leaders"
      seoDescription="AI Sorix powers 24/7 customer support with AI agents, instant ticket triage, multilingual replies, and analytics — cut response time 80% and CSAT goes up."
      path="/solutions/customer-support"
      schemaType="Service"
      about="AI for customer support, AI ticket triage, AI helpdesk"
      eyebrow="Customer Support"
      title="Resolve tickets in minutes with AI Sorix"
      subtitle="Deploy AI agents that triage, draft, and resolve customer tickets across email, chat, and social. AI Sorix gives your support team superpowers — without replacing the human touch."
      features={[
        { icon: Bot, title: "Autonomous AI agents", desc: "Train an agent on your knowledge base and let it answer Tier-1 tickets 24/7 with full citation." },
        { icon: Clock, title: "80% faster response", desc: "AI Sorix drafts grounded replies in your brand voice — agents review and send in seconds." },
        { icon: Languages, title: "100+ languages", desc: "Reply in any language with native-speaker fluency. Auto-translate inbound and outbound." },
        { icon: MessageSquare, title: "Multi-channel", desc: "Email, live chat, WhatsApp, social DMs — one AI Sorix workspace, every channel." },
        { icon: BarChart3, title: "Sentiment & analytics", desc: "Real-time sentiment scoring, deflection rate, and resolution insights." },
        { icon: Headphones, title: "Human handoff", desc: "Smart escalation to humans for complex issues — with full conversation context." },
      ]}
      faqs={[
        { q: "Can AI Sorix integrate with my helpdesk?", a: "Yes. AI Sorix connects to Zendesk, Intercom, Freshdesk, HubSpot, Gmail, and more via Connectors." },
        { q: "Will it sound like a robot?", a: "No. AI Sorix is trained on your tone-of-voice docs and produces replies indistinguishable from your best human agents." },
      ]}
    />
  );
}
