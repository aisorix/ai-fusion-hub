// Single source of truth for AI Sorix / Sorix Scholars company info.
import { Facebook, Instagram, Youtube, Twitter, Linkedin, type LucideIcon } from "lucide-react";

export const OFFICE_ADDRESS_EN = "Uttara, Dhaka 1230, Bangladesh";
export const OFFICE_ADDRESS_BN = "উত্তরা, ঢাকা ১২৩০, বাংলাদেশ";
export const OFFICE_SHORT_EN = "Uttara, Dhaka";
export const OFFICE_SHORT_BN = "উত্তরা, ঢাকা";

export const SUPPORT_EMAIL = "support@aisorix.com";
export const WHATSAPP_NUMBER = "+8801933554982";
export const WHATSAPP_URL = "https://wa.me/8801933554982";

export interface SocialLink {
  Icon: LucideIcon;
  href: string;
  label: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  { Icon: Facebook, href: "https://facebook.com/profile.php?id=61586687081259", label: "Facebook" },
  { Icon: Instagram, href: "https://instagram.com/aisorix_", label: "Instagram" },
  { Icon: Youtube, href: "https://youtube.com/@aisorix", label: "YouTube" },
  { Icon: Twitter, href: "https://twitter.com/aisorix_", label: "Twitter" },
  { Icon: Linkedin, href: "https://linkedin.com/company/aisorix", label: "LinkedIn" },
];
