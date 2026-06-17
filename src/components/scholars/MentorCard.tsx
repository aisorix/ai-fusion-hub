import { Brain, Code, Globe, Sparkles, User } from "lucide-react";
import mentorAsset from "@/assets/mentor-rakib.jpg.asset.json";

export interface MentorInfo {
  name?: string;
  role?: string;
  bio?: string;
  avatarUrl?: string;
}

const DEFAULT_MENTOR: Required<MentorInfo> = {
  name: "Rakib Eslam",
  role: "Founder & CEO, AI Sorix Limited · Software Engineer",
  bio: "Builder of the AI Sorix ecosystem — a multi-model AI workspace used by professionals worldwide. Rakib mentors learners on prompt engineering, autonomous agents, and turning AI prototypes into products people pay for.",
  avatarUrl: mentorAsset.url,
};

interface Props {
  mentor?: MentorInfo;
  /** Compact one-line variant (used inside small detail-page sidebars) */
  compact?: boolean;
  /** Hide the heading badge */
  hideBadge?: boolean;
}

export default function MentorCard({ mentor, compact = false, hideBadge = false }: Props) {
  const m: Required<MentorInfo> = {
    name: mentor?.name || DEFAULT_MENTOR.name,
    role: mentor?.role || DEFAULT_MENTOR.role,
    bio: mentor?.bio || DEFAULT_MENTOR.bio,
    avatarUrl: mentor?.avatarUrl || DEFAULT_MENTOR.avatarUrl,
  };

  if (compact) {
    return (
      <section
        className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-card to-cyan-500/5 p-5 sm:p-6"
        aria-label="Mentor"
      >
        {!hideBadge && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold mb-3">
            <Sparkles className="w-3 h-3" /> Mentor
          </div>
        )}
        <div className="flex gap-4 items-start">
          <img
            src={m.avatarUrl}
            alt={m.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover flex-shrink-0 shadow-md"
          />
          <div className="min-w-0">
            <div className="font-bold text-foreground text-sm sm:text-base">{m.name}</div>
            <div className="text-xs sm:text-[13px] text-primary font-medium mt-0.5">{m.role}</div>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-4">
              {m.bio}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-cyan-500/5 p-5 sm:p-8 grid sm:grid-cols-[200px_1fr] gap-6 items-start"
      aria-label="Mentor"
    >
      <div className="relative mx-auto sm:mx-0 w-40 sm:w-full max-w-[200px]">
        <div className="absolute -inset-2 bg-gradient-to-br from-primary to-cyan-500 rounded-3xl blur opacity-30" />
        <img
          src={m.avatarUrl}
          alt={m.name}
          className="relative w-full aspect-square object-cover rounded-2xl shadow-xl"
        />
      </div>
      <div>
        {!hideBadge && (
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
            <User className="w-3 h-3" /> Mentor
          </span>
        )}
        <h3
          className="text-xl sm:text-2xl font-bold text-foreground"
          style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
        >
          {m.name}
        </h3>
        <p className="text-sm text-primary font-medium mt-1">{m.role}</p>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{m.bio}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { icon: Brain, label: "Frontier AI" },
            { icon: Code, label: "Agents & Tools" },
            { icon: Globe, label: "Global product" },
          ].map((t) => (
            <span
              key={t.label}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border bg-background text-[11px] font-medium text-foreground"
            >
              <t.icon className="w-3 h-3 text-primary" /> {t.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
