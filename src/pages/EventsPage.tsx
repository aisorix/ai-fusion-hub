import InfoPage from "@/components/marketing/InfoPage";
import { Calendar, Users, Mic, Globe, Trophy, Sparkles } from "lucide-react";

export default function EventsPage() {
  return (
    <InfoPage
      seoTitle="Events | AI Sorix Webinars, Hackathons & Community Meetups"
      seoDescription="Join AI Sorix events: monthly product webinars, global hackathons, virtual meetups, and in-person summits. Learn, build, and connect with the AI Sorix community."
      path="/events"
      about="AI events, AI hackathons, AI webinars, AI community"
      eyebrow="Events"
      title="Build, learn, and connect with the AI Sorix community"
      subtitle="From product webinars to global hackathons, AI Sorix events bring together developers, researchers, and creators pushing the limits of what AI can do."
      features={[
        { icon: Mic, title: "Monthly product webinars", desc: "Live deep-dives into new AI Sorix features with the engineers who built them." },
        { icon: Trophy, title: "Global hackathons", desc: "Quarterly hackathons with $50K+ prize pools, sponsored by AI Sorix and partners." },
        { icon: Users, title: "Local meetups", desc: "Community-led meetups in 20+ cities — host one or join the next." },
        { icon: Globe, title: "Sorix Summit", desc: "Our annual global conference for AI builders, researchers, and operators." },
        { icon: Calendar, title: "Office hours", desc: "Weekly drop-in sessions with AI Sorix team members for 1:1 help." },
        { icon: Sparkles, title: "Workshops", desc: "Hands-on building sessions on agents, RAG, FlowBuilder, and more." },
      ]}
    />
  );
}
