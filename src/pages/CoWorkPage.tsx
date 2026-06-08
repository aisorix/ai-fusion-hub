import React from "react";
import { Bot } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import CoWorkLayout from "@/components/cowork/CoWorkLayout";
import PlanLockScreen from "@/components/shared/PlanLockScreen";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSubscription } from "@/hooks/useSubscription";
import { meetsPlan } from "@/lib/planAccess";

const CoWorkPage: React.FC = () => {
  const { language } = useLanguage();
  const { currentPlan, isLoading } = useSubscription();

  const seo = (
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
    </>
  );

  if (isLoading) {
    return (
      <>
        {seo}
        <div className="min-h-[100dvh] flex items-center justify-center bg-background">
          <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        </div>
      </>
    );
  }

  if (!meetsPlan(currentPlan, "premium")) {
    return (
      <>
        {seo}
        <PlanLockScreen
          toolName="Sorix Agent"
          tagline="Your Tasks, Handled by Intelligence."
          description="Sorix Agent autonomously plans and executes multi-step work — research, writing, scheduling, integrations and more. Available on Premium and above."
          requiredPlan="premium"
          accentGradient="from-cyan-500 to-teal-500"
          icon={Bot}
          features={[
            "Autonomous multi-step task execution",
            "Web research and document generation",
            "Google, LinkedIn, WhatsApp, Telegram integrations",
            "Real-time task monitor and approvals",
            "Multi-model support with smart routing",
          ]}
        />
      </>
    );
  }

  return (
    <>
      {seo}
      <CoWorkLayout language={language} />
    </>
  );
};

export default CoWorkPage;
