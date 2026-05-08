import InfoPage from "@/components/marketing/InfoPage";
import { HandHeart, Users, FileText, Megaphone, BarChart3, Heart } from "lucide-react";

export default function SolutionNonprofits() {
  return (
    <InfoPage
      seoTitle="Nonprofits | AI Sorix for NGOs, Charities & Social Impact Teams"
      seoDescription="AI Sorix gives nonprofits frontier AI at discounted rates for grant writing, donor outreach, program reporting, and multilingual communication — do more good, faster."
      path="/solutions/nonprofits"
      schemaType="Service"
      about="AI for nonprofits, AI for NGOs, social impact AI"
      eyebrow="Nonprofits"
      title="AI Sorix amplifies your mission"
      subtitle="Grant writing, donor communications, impact reports, and multilingual outreach — AI Sorix offers discounted nonprofit pricing so every dollar goes further."
      features={[
        { icon: FileText, title: "Grant writing", desc: "Draft compelling proposals tailored to each funder, with AI Sorix research and tone-matching." },
        { icon: Megaphone, title: "Donor outreach", desc: "Personalized newsletters, appeals, and social posts at the scale of your supporter list." },
        { icon: BarChart3, title: "Impact reporting", desc: "Turn program data into beautiful donor-facing reports and dashboards." },
        { icon: Users, title: "Volunteer enablement", desc: "AI assistants that train and support volunteers across time zones and languages." },
        { icon: Heart, title: "Discounted pricing", desc: "Verified nonprofits get up to 50% off Pro and Premium plans on AI Sorix." },
        { icon: HandHeart, title: "Free tools forever", desc: "Sorix Health and Sorix Agro stay free for everyone — including the communities you serve." },
      ]}
      faqs={[
        { q: "How do nonprofits qualify for the discount?", a: "Submit your 501(c)(3) or equivalent registration via support@aisorix.com to be verified within 48 hours." },
      ]}
    />
  );
}
