import { Mail, HardDrive, Calendar, FileText, Sheet, Facebook, Linkedin, MessageCircle, Send } from "lucide-react";

export type ServiceId =
  | "google_gmail"
  | "google_drive"
  | "google_calendar"
  | "google_docs"
  | "google_sheets"
  | "facebook"
  | "linkedin"
  | "whatsapp"
  | "telegram";

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
  accent: string;
  method: "oauth" | "manual";
  oauthProvider?: "google";
  scopes?: string[];
  capabilities: { icon: typeof Mail; label: string }[];
  fields?: FieldDef[];
  helpUrl?: string;
  helpText?: string;
};

const GOOGLE_BASE_SCOPES = ["openid", "email", "profile"];

export const CONNECTION_SERVICES: ServiceConfig[] = [
  {
    id: "google_gmail",
    label: "Gmail",
    description: "Read, send and manage emails on your behalf",
    icon: Mail,
    accent: "text-red-500",
    method: "oauth",
    oauthProvider: "google",
    scopes: [...GOOGLE_BASE_SCOPES, "https://www.googleapis.com/auth/gmail.modify"],
    capabilities: [{ icon: Mail, label: "Compose, reply, label" }],
    helpUrl: "https://myaccount.google.com/permissions",
    helpText: "You'll be redirected to Google to grant Sorix Agent access to Gmail only. You can revoke access anytime from your Google Account.",
  },
  {
    id: "google_drive",
    label: "Google Drive",
    description: "Upload, search and download files in your Drive",
    icon: HardDrive,
    accent: "text-blue-500",
    method: "oauth",
    oauthProvider: "google",
    scopes: [...GOOGLE_BASE_SCOPES, "https://www.googleapis.com/auth/drive"],
    capabilities: [{ icon: HardDrive, label: "Files & folders" }],
    helpUrl: "https://myaccount.google.com/permissions",
    helpText: "Grants Sorix Agent access to your Drive files only.",
  },
  {
    id: "google_calendar",
    label: "Google Calendar",
    description: "Create, update and read calendar events",
    icon: Calendar,
    accent: "text-emerald-500",
    method: "oauth",
    oauthProvider: "google",
    scopes: [...GOOGLE_BASE_SCOPES, "https://www.googleapis.com/auth/calendar"],
    capabilities: [{ icon: Calendar, label: "Events & invites" }],
    helpUrl: "https://myaccount.google.com/permissions",
    helpText: "Grants Sorix Agent access to your calendars only.",
  },
  {
    id: "google_docs",
    label: "Google Docs",
    description: "Create and edit Google Docs documents",
    icon: FileText,
    accent: "text-sky-500",
    method: "oauth",
    oauthProvider: "google",
    scopes: [
      ...GOOGLE_BASE_SCOPES,
      "https://www.googleapis.com/auth/documents",
      "https://www.googleapis.com/auth/drive.file",
    ],
    capabilities: [{ icon: FileText, label: "Documents" }],
    helpUrl: "https://myaccount.google.com/permissions",
    helpText: "Grants Sorix Agent access to Docs it creates or you open with it.",
  },
  {
    id: "google_sheets",
    label: "Google Sheets",
    description: "Read and update spreadsheet data",
    icon: Sheet,
    accent: "text-green-500",
    method: "oauth",
    oauthProvider: "google",
    scopes: [
      ...GOOGLE_BASE_SCOPES,
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive.file",
    ],
    capabilities: [{ icon: Sheet, label: "Spreadsheets" }],
    helpUrl: "https://myaccount.google.com/permissions",
    helpText: "Grants Sorix Agent access to Sheets it creates or you open with it.",
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
