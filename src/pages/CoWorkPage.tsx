import React from "react";
import SEOHead from "@/components/SEOHead";
import CoWorkLayout from "@/components/cowork/CoWorkLayout";
import { useLanguage } from "@/contexts/LanguageContext";

const CoWorkPage: React.FC = () => {
  const { language } = useLanguage();

  return (
    <>
      <SEOHead
        title="Sorix Co-Work | AI Agent Workspace | AI Sorix"
        description="Delegate complex tasks to your AI agent. Real-time task progress, multi-model support, and smart clipboard."
        path="/cowork"
      />
      <CoWorkLayout language={language} />
    </>
  );
};

export default CoWorkPage;
