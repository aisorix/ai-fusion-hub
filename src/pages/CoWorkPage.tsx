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
      <CoWorkLayout language={language} />
    </>
  );
};

export default CoWorkPage;
