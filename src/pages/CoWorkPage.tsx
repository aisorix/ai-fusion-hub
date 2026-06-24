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
        "operatingSystem": "Web",
      }) }} />
      <CoWorkLayout language={language} />
    </>
  );
};

export default CoWorkPage;
