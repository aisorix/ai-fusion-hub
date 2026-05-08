import InfoPage from "@/components/marketing/InfoPage";
import { Plug, Github, MessageSquare, Mail, FileText, Database } from "lucide-react";

export default function ConnectorsPage() {
  return (
    <InfoPage
      seoTitle="Connectors | AI Sorix Integrations for Google, Slack, GitHub & More"
      seoDescription="AI Sorix Connectors link your AI workspace to Google Workspace, Slack, GitHub, Notion, Stripe, and 100+ apps. Bring your data to AI Sorix in one click."
      path="/connectors"
      about="AI integrations, app connectors, AI workspace integrations"
      eyebrow="Connectors"
      title="Connect AI Sorix to every app you already use"
      subtitle="Bring AI Sorix to your data — Google Drive, Gmail, Slack, GitHub, Notion, Linear, HubSpot, Stripe, and more. Secure OAuth, granular scopes, revoke anytime."
      features={[
        { icon: Mail, title: "Google Workspace", desc: "Gmail, Drive, Docs, Sheets, Calendar — read, draft, and act on your work." },
        { icon: MessageSquare, title: "Slack & Teams", desc: "Summarize channels, draft replies, and trigger AI Sorix workflows from chat." },
        { icon: Github, title: "GitHub", desc: "Code review, PR drafting, repo Q&A, and issue triage with full context." },
        { icon: FileText, title: "Notion & Docs", desc: "Sync knowledge bases bidirectionally for grounded AI Sorix answers." },
        { icon: Database, title: "Databases & CRMs", desc: "HubSpot, Salesforce, Postgres, BigQuery — query in natural language." },
        { icon: Plug, title: "Custom & API", desc: "Build a custom connector with the AI Sorix Developer API in under 50 lines." },
      ]}
      sections={[
        { title: "Backend-managed, easy to use", body: "AI Sorix Connectors use a Claude-style connector model — connect your account once, and AI Sorix handles auth refresh, scope management, and revocation. No copy-pasting tokens." },
        { title: "Request a connector", body: "Need an integration that's not listed? Email support@aisorix.com — most requested connectors ship within two weeks." },
      ]}
    />
  );
}
