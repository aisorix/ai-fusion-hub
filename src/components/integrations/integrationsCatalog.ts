import {
  Github, Mail, HardDrive, Calendar, FileText, Sheet,
  Facebook, Instagram, Twitter, Linkedin, MessageCircle, Send,
  BookOpen, Palette, Slack as SlackIcon, Youtube
} from "lucide-react";

export type IntegrationProvider = {
  id: string;            // matches Nango integration id
  label: string;
  description: string;
  icon: any;
  accent: string;        // tailwind color class for icon
  category: "productivity" | "social" | "communication" | "developer" | "creative";
};

// IMPORTANT: `id` must match the integration unique id you configured in your Nango dashboard.
export const INTEGRATIONS: IntegrationProvider[] = [
  { id: "github",           label: "GitHub",          description: "Repos, issues, pull requests",        icon: Github,        accent: "text-foreground",  category: "developer" },
  { id: "google-mail",      label: "Gmail",           description: "Read and send emails",                icon: Mail,          accent: "text-red-500",     category: "productivity" },
  { id: "google-drive",     label: "Google Drive",    description: "Files and folders",                   icon: HardDrive,     accent: "text-yellow-500",  category: "productivity" },
  { id: "google-calendar",  label: "Google Calendar", description: "Events and scheduling",               icon: Calendar,      accent: "text-blue-500",    category: "productivity" },
  { id: "google-docs",      label: "Google Docs",     description: "Create and edit documents",           icon: FileText,      accent: "text-blue-600",    category: "productivity" },
  { id: "google-sheet",     label: "Google Sheets",   description: "Spreadsheets and data",               icon: Sheet,         accent: "text-green-600",   category: "productivity" },
  { id: "youtube",          label: "YouTube",         description: "Videos and channels",                 icon: Youtube,       accent: "text-red-600",     category: "social" },
  { id: "facebook",         label: "Facebook",        description: "Pages and posts",                     icon: Facebook,      accent: "text-blue-600",    category: "social" },
  { id: "instagram",        label: "Instagram",       description: "Posts and stories",                   icon: Instagram,     accent: "text-pink-500",    category: "social" },
  { id: "twitter-v2",       label: "X / Twitter",     description: "Tweets and timeline",                 icon: Twitter,       accent: "text-foreground",  category: "social" },
  { id: "linkedin",         label: "LinkedIn",        description: "Posts and profile",                   icon: Linkedin,      accent: "text-sky-600",     category: "social" },
  { id: "notion",           label: "Notion",          description: "Pages and databases",                 icon: BookOpen,      accent: "text-foreground",  category: "productivity" },
  { id: "canva",            label: "Canva",           description: "Designs and brand assets",            icon: Palette,       accent: "text-cyan-500",    category: "creative" },
  { id: "slack",            label: "Slack",           description: "Channels and messages",               icon: SlackIcon,     accent: "text-purple-500",  category: "communication" },
  { id: "whatsapp-business",label: "WhatsApp",        description: "Business messaging",                  icon: MessageCircle, accent: "text-green-500",   category: "communication" },
  { id: "telegram",         label: "Telegram",        description: "Bot messages and chats",              icon: Send,          accent: "text-cyan-500",    category: "communication" },
];

export const getIntegration = (id: string) => INTEGRATIONS.find(i => i.id === id);
