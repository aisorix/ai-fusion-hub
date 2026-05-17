import React from "react";
import SEOHead from "@/components/SEOHead";
import CoWorkLayout from "@/components/cowork/CoWorkLayout";
import { useLanguage } from "@/contexts/LanguageContext";

const CoWorkPage: React.FC = () => {
  const { language } = useLanguage();

  return (
    <>
      <SEOHead
        title="Sorix Agent | AI Agent Workspace | AI Sorix"
        description="Sorix Agent — Your Tasks, Handled by Intelligence. Delegate complex tasks to your AI agent with real-time progress and multi-model support."
        path="/agent"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Sorix Agent",
        "url": "https://www.aisorix.com/agent",
        "applicationCategory": "BusinessApplication",
        "applicationSubCategory": "Autonomous AI Agent",
        "operatingSystem": "Web",
        "description": "Autonomous AI agent that executes multi-step tasks: web search, document generation, scheduling, clipboard automation, and integrations with Google, Facebook, LinkedIn, WhatsApp, and Telegram.",
        "featureList": ["Autonomous Task Execution", "Web Search", "Document Generation", "Real-Time Progress", "Google / FB / LinkedIn / WhatsApp / Telegram Integrations", "Multi-Model Support", "Smart Clipboard"],
        "isPartOf": { "@type": "WebSite", "name": "AI Sorix", "url": "https://www.aisorix.com" },
        "publisher": { "@type": "Organization", "name": "AI Sorix", "url": "https://www.aisorix.com" },
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD", "description": "Included in AI Sorix plans" }
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.aisorix.com/" },
          { "@type": "ListItem", "position": 2, "name": "Sorix Agent", "item": "https://www.aisorix.com/agent" }
        ]
      }) }} />
      <CoWorkLayout language={language} />
    </>
  );
};

export default CoWorkPage;
