import React, { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Sparkles, Briefcase, Rocket, GraduationCap, BarChart3,
  Mic, Users, Lightbulb, Target, Building2, FlaskConical, Heart,
} from 'lucide-react';

export interface DeckTemplate {
  id: string;
  category: 'business' | 'education' | 'creative' | 'marketing';
  title: string;
  subtitle: string;
  prompt: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  recommendedSlides?: number;
}

export const DECK_TEMPLATES: DeckTemplate[] = [
  { id: 'pitch', category: 'business', title: 'Startup Pitch Deck', subtitle: 'Problem, solution, market, traction', icon: Rocket, gradient: 'from-fuchsia-500 to-purple-600', recommendedSlides: 10,
    prompt: 'A 10-slide startup pitch deck covering the problem, our solution, target market size, product overview, business model, traction, competition, go-to-market strategy, team and the ask.' },
  { id: 'product-launch', category: 'business', title: 'Product Launch', subtitle: 'Reveal, positioning, GTM plan', icon: Sparkles, gradient: 'from-cyan-500 to-blue-600', recommendedSlides: 8,
    prompt: 'An 8-slide product launch presentation covering announcement, customer problem, product reveal, key features, pricing tiers, launch timeline, marketing channels and success metrics.' },
  { id: 'quarterly', category: 'business', title: 'Quarterly Review', subtitle: 'KPIs, wins, next quarter', icon: BarChart3, gradient: 'from-emerald-500 to-teal-600', recommendedSlides: 10,
    prompt: 'A 10-slide quarterly business review including executive summary, key KPIs vs target, revenue performance, customer growth, product wins, team highlights, challenges, lessons learned, next-quarter priorities and Q&A.' },
  { id: 'investor', category: 'business', title: 'Investor Update', subtitle: 'Monthly metrics and asks', icon: Briefcase, gradient: 'from-indigo-500 to-violet-600', recommendedSlides: 8,
    prompt: 'A monthly investor update presentation: headline metrics, MRR & ARR growth, key wins, product releases, hiring updates, top risks, current asks and runway.' },
  { id: 'course', category: 'education', title: 'Course Outline', subtitle: 'Modules, lessons, outcomes', icon: GraduationCap, gradient: 'from-amber-500 to-orange-600', recommendedSlides: 12,
    prompt: 'A 12-slide course outline presentation: course overview, who it is for, learning outcomes, module breakdown, weekly schedule, assignments, tools used, assessment, instructor bio and enrollment details.' },
  { id: 'workshop', category: 'education', title: 'Workshop', subtitle: 'Interactive 60-minute session', icon: Lightbulb, gradient: 'from-yellow-500 to-amber-600', recommendedSlides: 10,
    prompt: 'A 10-slide interactive workshop deck for a 60-minute session: agenda, warm-up, key concepts, framework, hands-on exercise, group discussion, real-world example, recap, next steps and resources.' },
  { id: 'keynote', category: 'creative', title: 'Conference Keynote', subtitle: 'Big idea, story, takeaway', icon: Mic, gradient: 'from-rose-500 to-pink-600', recommendedSlides: 15,
    prompt: 'A 15-slide conference keynote presentation with a strong narrative arc: hook, central thesis, three supporting acts with stories and data, a vivid demo or example, audience reflection, key takeaway and a memorable closing call to action.' },
  { id: 'team', category: 'business', title: 'Team All-Hands', subtitle: 'Strategy, updates, recognition', icon: Users, gradient: 'from-sky-500 to-cyan-600', recommendedSlides: 10,
    prompt: 'A 10-slide team all-hands presentation covering company mission reminder, recent wins, financial snapshot, product roadmap update, customer stories, team shoutouts, OKRs progress, hiring news, open Q&A and closing thought.' },
  { id: 'sales', category: 'marketing', title: 'Sales Playbook', subtitle: 'ICP, objections, close', icon: Target, gradient: 'from-red-500 to-orange-600', recommendedSlides: 10,
    prompt: 'A 10-slide sales playbook covering ideal customer profile, buyer personas, value proposition, discovery questions, common objections and responses, pricing & packaging, competitive battle cards, demo flow, closing techniques and follow-up cadence.' },
  { id: 'research', category: 'education', title: 'Research Findings', subtitle: 'Method, data, insights', icon: FlaskConical, gradient: 'from-teal-500 to-emerald-600', recommendedSlides: 10,
    prompt: 'A 10-slide research findings presentation: background, research questions, methodology, sample, key findings (3-4 slides), data visualizations, implications, limitations and recommended next steps.' },
  { id: 'company', category: 'business', title: 'Company Overview', subtitle: 'Who we are, what we do', icon: Building2, gradient: 'from-slate-600 to-zinc-800', recommendedSlides: 8,
    prompt: 'An 8-slide company overview presentation: mission and vision, founding story, what we do, who we serve, flagship products, key milestones, leadership team and how to work with us.' },
  { id: 'nonprofit', category: 'creative', title: 'Nonprofit Story', subtitle: 'Cause, impact, donate', icon: Heart, gradient: 'from-pink-500 to-rose-600', recommendedSlides: 10,
    prompt: 'A 10-slide nonprofit storytelling presentation: the cause and why it matters, the people we serve, our approach, measurable impact to date, a featured beneficiary story, partners, financials and transparency, upcoming programs, ways to help and donate call to action.' },
];

const CATS: { id: 'all' | DeckTemplate['category']; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'business', label: 'Business' },
  { id: 'education', label: 'Education' },
  { id: 'creative', label: 'Creative' },
  { id: 'marketing', label: 'Marketing' },
];

interface Props {
  onUseTemplate: (prompt: string, recommendedSlides?: number) => void;
}

const DeckTemplates: React.FC<Props> = ({ onUseTemplate }) => {
  const [cat, setCat] = useState<typeof CATS[number]['id']>('all');
  const items = useMemo(
    () => (cat === 'all' ? DECK_TEMPLATES : DECK_TEMPLATES.filter((t) => t.category === cat)),
    [cat]
  );

  return (
    <section className="w-full">
      <div className="flex items-center gap-1.5 mb-4 flex-wrap">
        {CATS.map((c) => {
          const active = cat === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={cn(
                'px-3 py-1.5 rounded-full text-[12px] font-medium transition-all',
                active
                  ? 'bg-gradient-to-br from-primary/15 to-primary/5 text-primary border border-primary/40 shadow-[0_2px_10px_-2px_hsl(var(--primary)/0.3)]'
                  : 'text-muted-foreground hover:text-foreground border border-border/50 hover:border-primary/30 bg-card/40'
              )}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {items.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => onUseTemplate(t.prompt, t.recommendedSlides)}
              className={cn(
                'group relative aspect-[4/5] rounded-2xl overflow-hidden border border-border/50 text-left transition-all duration-300',
                'hover:scale-[1.03] hover:border-primary/50 hover:shadow-[0_10px_30px_-12px_hsl(var(--primary)/0.45)]',
                'bg-gradient-to-br', t.gradient
              )}
            >
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              <div className="relative h-full w-full flex flex-col justify-between p-3.5 sm:p-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-[14px] sm:text-[15px] leading-tight line-clamp-2">
                    {t.title}
                  </h4>
                  <p className="text-white/80 text-[11px] mt-1 line-clamp-2">{t.subtitle}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export const DECK_TEMPLATE_COUNT = DECK_TEMPLATES.length;
export default DeckTemplates;
