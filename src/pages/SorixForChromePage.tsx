import InfoPage from "@/components/marketing/InfoPage";
import { Chrome, Zap, MessageSquare, FileText, Search, Sparkles } from "lucide-react";

export default function SorixForChromePage() {
  return (
    <InfoPage
      seoTitle="Sorix for Chrome | AI Sorix Browser Extension"
      seoDescription="Sorix for Chrome brings AI Sorix to every tab. Summarize pages, draft replies, translate, and chat with frontier AI models without leaving your browser."
      path="/sorix-for-chrome"
      about="AI Chrome extension, browser AI assistant"
      eyebrow="Sorix for Chrome"
      title="The AI copilot that lives in your browser"
      subtitle="Sorix for Chrome lets you summarize any page, ask questions about what you're reading, draft replies, and run AI Sorix workflows from any tab — with one keyboard shortcut."
      features={[
        { icon: Chrome, title: "One-Click Install", desc: "Install from the Chrome Web Store and sign in with your AI Sorix account. Works in every Chromium browser." },
        { icon: Zap, title: "Instant Page Summary", desc: "Press the shortcut on any article, doc, or research paper to get a concise AI Sorix summary in seconds." },
        { icon: MessageSquare, title: "Chat with the Page", desc: "Ask follow-up questions about any webpage — AI Sorix grounds answers in the visible content." },
        { icon: FileText, title: "Draft Anywhere", desc: "Generate replies, posts, and emails inline in Gmail, LinkedIn, X, Notion, and Google Docs." },
        { icon: Search, title: "Smart Web Search", desc: "Replace generic search with AI Sorix's multi-model answer engine and live citations." },
        { icon: Sparkles, title: "Same Power, Same Tokens", desc: "Uses your existing AI Sorix plan and tokens — no extra subscription required." },
      ]}
      sections={[
        { title: "Coming soon — join the waitlist", body: "Sorix for Chrome is in private beta. Sign up free for AI Sorix today and you'll be auto-enrolled in the rollout. We're shipping to all Pro users first." },
      ]}
      faqs={[
        { q: "Is Sorix for Chrome free?", a: "Yes. The extension is free and uses your AI Sorix account tokens. Free-tier users get the same models available in their plan." },
        { q: "Does it work on every site?", a: "It works on any standard webpage. Restricted sites like banking portals are excluded for security." },
      ]}
    />
  );
}
