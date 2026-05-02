import { Mail, HardDrive, Calendar, FileText, Sheet, Youtube, Facebook, Linkedin, MessageCircle, Send } from "lucide-react";

export type ServiceId = "google" | "facebook" | "linkedin" | "whatsapp" | "telegram";

export type FieldDef = {
  key: string;
  label: string;
  placeholder?: string;
  type?: "text" | "password" | "textarea";
  required?: boolean;
  help?: string;
};

export type ServiceConfig = {
  id: ServiceId;
  label: string;
  description: string;
  icon: typeof Mail;
  accent: string; // tailwind text color
  method: "oauth" | "manual";
  capabilities: { icon: typeof Mail; label: string }[];
  fields?: FieldDef[]; // only for manual
  helpUrl?: string;
  helpText?: string;
};

export const CONNECTION_SERVICES: ServiceConfig[] = [
  {
    id: "google",
    label: "Google",
    description: "Gmail, Drive, Calendar, Docs, Sheets, YouTube",
    icon: Mail,
    accent: "text-red-500",
    method: "oauth",
    capabilities: [
      { icon: Mail, label: "Gmail" },
      { icon: HardDrive, label: "Drive" },
      { icon: Calendar, label: "Calendar" },
      { icon: FileText, label: "Docs" },
      { icon: Sheet, label: "Sheets" },
      { icon: Youtube, label: "YouTube" },
    ],
    helpUrl: "https://myaccount.google.com/permissions",
    helpText: "You'll be redirected to Google to grant Sorix Agent access. You can revoke access anytime from your Google Account.",
  },
  {
    id: "facebook",
    label: "Facebook Page",
    description: "Post, schedule and reply on a Facebook Page",
    icon: Facebook,
    accent: "text-blue-600",
    method: "manual",
    capabilities: [{ icon: Facebook, label: "Page posts & comments" }],
    helpUrl: "https://developers.facebook.com/tools/explorer/",
    helpText: "Generate a long-lived Page Access Token in the Graph API Explorer, then paste it here together with your Page ID.",
    fields: [
      { key: "access_token", label: "Page Access Token", type: "password", required: true, placeholder: "EAA…" },
      { key: "page_id", label: "Page ID", type: "text", required: true, placeholder: "1234567890" },
    ],
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    description: "Publish posts on your LinkedIn profile or company page",
    icon: Linkedin,
    accent: "text-sky-600",
    method: "manual",
    capabilities: [{ icon: Linkedin, label: "Posts & articles" }],
    helpUrl: "https://www.linkedin.com/developers/apps",
    helpText: "Create an app in LinkedIn Developer Portal, request the w_member_social scope, generate an access token, and paste it with your Author URN.",
    fields: [
      { key: "access_token", label: "Access Token", type: "password", required: true, placeholder: "AQX…" },
      { key: "author_urn", label: "Author URN", type: "text", required: true, placeholder: "urn:li:person:xxxx" },
    ],
  },
  {
    id: "whatsapp",
    label: "WhatsApp Business",
    description: "Send messages and templates via the WhatsApp Cloud API",
    icon: MessageCircle,
    accent: "text-green-600",
    method: "manual",
    capabilities: [{ icon: MessageCircle, label: "Messages & templates" }],
    helpUrl: "https://developers.facebook.com/docs/whatsapp/cloud-api",
    helpText: "From Meta Business Manager → WhatsApp Manager, copy your permanent System User token, Phone Number ID and WABA ID.",
    fields: [
      { key: "access_token", label: "Permanent Access Token", type: "password", required: true },
      { key: "phone_number_id", label: "Phone Number ID", type: "text", required: true },
      { key: "waba_id", label: "WhatsApp Business Account ID", type: "text", required: true },
    ],
  },
  {
    id: "telegram",
    label: "Telegram Bot",
    description: "Send and receive messages from your Telegram bot",
    icon: Send,
    accent: "text-cyan-500",
    method: "manual",
    capabilities: [{ icon: Send, label: "Bot messages" }],
    helpUrl: "https://t.me/BotFather",
    helpText: "Open @BotFather in Telegram, run /newbot (or /token for an existing bot) and paste the token here. We'll fetch your bot's username automatically.",
    fields: [
      { key: "access_token", label: "Bot Token", type: "password", required: true, placeholder: "1234567:ABC…" },
    ],
  },
];

export const getServiceConfig = (id: string): ServiceConfig | undefined =>
  CONNECTION_SERVICES.find((s) => s.id === id);
