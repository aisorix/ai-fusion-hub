// Centralized content for SorixLab Scholars / Sorix Academy.
// Edit text and pricing here — pages re-render automatically.
import promptImg from "@/assets/course-prompt.jpg";
import aiCompImg from "@/assets/competition-ai.jpg";
import startupCompImg from "@/assets/competition-startup.jpg";

export type Level = "Beginner" | "Intermediate" | "Advanced";

export interface CourseModule {
  title: string;
  lessons: string[];
}

export interface Course {
  slug: string;
  title: string;
  tagline: string;
  level: Level;
  duration: string;
  priceLabel: string;
  cover: string;
  overview: string;
  outcomes: string[];
  curriculum: CourseModule[];
  instructor: { name: string; role: string; bio: string };
  faqs: { q: string; a: string }[];
}

export const courses: Course[] = [
  {
    slug: "ai-expertise-for-working-professionals",
    title: "AI Expertise for Working Professionals",
    tagline:
      "অফিসের রিয়েল কাজ শিখুন এক মাস্টারক্লাসেই! ইমেইল থেকে শুরু করে রিপোর্ট, প্রেজেন্টেশন ও রিসার্চ—সব পাবেন একসাথে।",
    level: "Intermediate",
    duration: "4 মডিউল",
    priceLabel: "৳499",
    cover: promptImg,
    overview:
      "একজন প্রফেশনালের প্রতিদিনের অফিস-কাজ সহজ ও দ্রুত করার জন্য ডিজাইন করা একটি practical AI masterclass। ChatGPT, Claude, Gemini এবং AI Sorix-এর মতো frontier টুল ব্যবহার করে email লেখা, report তৈরি, presentation বানানো, research সারসংক্ষেপ — সবকিছু কিভাবে কম সময়ে high-quality output দিয়ে করবেন তা শেখানো হবে।",
    outcomes: [
      "Professional email ও reply দ্রুত draft করা",
      "Meeting note থেকে structured report তৈরি",
      "Slide outline ও speaker note generate করা",
      "Long document থেকে দ্রুত summary বের করা",
      "Spreadsheet ও data analysis এ AI ব্যবহার",
      "Personal AI workflow তৈরি করা",
    ],
    curriculum: [
      {
        title: "Module 1 · AI Foundations for Professionals",
        lessons: ["Frontier AI টুল পরিচিতি", "কোন কাজে কোন মডেল", "Account ও workspace setup"],
      },
      {
        title: "Module 2 · Email & Communication",
        lessons: ["Professional email drafting", "Tone ও style control", "Reply, follow-up, negotiation"],
      },
      {
        title: "Module 3 · Reports & Documents",
        lessons: ["Meeting note → report", "Long document summarisation", "Citation ও fact-check"],
      },
      {
        title: "Module 4 · Presentations",
        lessons: ["Slide outline তৈরি", "Speaker note ও script", "Deck design AI টুল"],
      },
      {
        title: "Module 5 · Research & Analysis",
        lessons: ["Web research workflow", "Data ও spreadsheet এ AI", "Insight extraction"],
      },
      {
        title: "Module 6 · Personal AI Workflow",
        lessons: ["Daily routine অটোমেশন", "Prompt library তৈরি", "Capstone: নিজের কাজে একটি workflow ship"],
      },
    ],
    instructor: {
      name: "Md. Rakibul Islam",
      role: "Founder, AI Sorix · Sorix Scholars",
      bio: "AI Sorix-এর প্রতিষ্ঠাতা। বিশ্বজুড়ে প্রফেশনাল ও টিমের জন্য frontier AI প্রোডাক্ট তৈরি ও ship করার অভিজ্ঞতা থেকে এই কোর্সের সব lesson তৈরি।",
    },
    faqs: [
      {
        q: "কোডিং জানা লাগবে?",
        a: "না। সম্পূর্ণ কোর্সটি no-code, শুধু AI টুল ব্যবহার শেখানো হবে।",
      },
      {
        q: "কোর্স access কতদিন?",
        a: "একবার enroll করলে lifetime access — যত খুশি revisit করতে পারবেন।",
      },
      {
        q: "Certificate পাব?",
        a: "হ্যাঁ, capstone সম্পন্ন করলে Sorix Scholars verified certificate পাবেন।",
      },
    ],
  },
];


export interface Competition {
  slug: string;
  title: string;
  tagline: string;
  prize: string;
  status: string;
  cover: string;
  overview: string;
  tracks: { title: string; desc: string }[];
  criteria: { title: string; desc: string }[];
  timeline: { date: string; title: string; desc: string }[];
  prizes: { place: string; reward: string }[];
  rules: string[];
  faqs: { q: string; a: string }[];
}

export const competitions: Competition[] = [
  {
    slug: "ai-challenge",
    title: "Sorixlab Build Challenge",
    tagline: "Build a useful AI product in 30 days. Win cash, credits, and a launch spotlight.",
    prize: "$15,000 prize pool",
    status: "Applications close",
    cover: aiCompImg,
    overview:
      "A worldwide, online-first hackathon for anyone building with AI. Ship a working product — agent, app, workflow, or research tool — using any model and any stack. Judged on usefulness, craft, and what real users say after a week of testing.",
    tracks: [
      { title: "Agents & Automation", desc: "Autonomous systems that finish real-world tasks unattended." },
      { title: "Creative & Multimodal", desc: "Image, video, voice, and design tools that delight." },
      { title: "Research & Science", desc: "Tools that move scientific or analytical workflows forward." },
      { title: "Open Track", desc: "Anything that meaningfully uses AI to improve a workflow." },
    ],
    criteria: [
      { title: "Usefulness", desc: "Does a real person want to use it again tomorrow?" },
      { title: "Craft", desc: "Quality of execution — design, code, polish, reliability." },
      { title: "Novelty", desc: "What is genuinely new or sharper than existing solutions?" },
      { title: "Responsibility", desc: "Safety, transparency, and respect for user trust." },
    ],
    timeline: [
      { date: "Week 1", title: "Applications close", desc: "Submit a 200-word idea and team profile." },
      { date: "Week 2", title: "Kickoff & resources", desc: "Office hours, model credits, and mentor matching." },
      { date: "Weeks 3-4", title: "Build sprint", desc: "Ship a working prototype on a public URL." },
      { date: "Week 5", title: "User testing", desc: "Real users try your build. Judges read the feedback." },
      { date: "Week 6", title: "Demo day", desc: "Live online showcase. Winners announced same day." },
    ],
    prizes: [
      { place: "Grand Prize", reward: "$8,000 cash + AI Sorix credits + launch feature" },
      { place: "Runner-up (×2)", reward: "$2,500 cash + credits + launch feature" },
      { place: "Track winners (×4)", reward: "$500 cash + credits + mentor session" },
    ],
    rules: [
      "Open to individuals and teams of up to four, worldwide.",
      "Projects must use AI in a non-trivial way and ship a working URL.",
      "You retain full ownership of your code, models, and IP.",
      "Pre-existing projects are fine if substantial new work is done during the challenge window.",
      "Final judging weights user feedback heavily — invite real people to try your build.",
    ],
    faqs: [
      { q: "Is it free to enter?", a: "Yes. The challenge is free and fully online." },
      { q: "What models can I use?", a: "Any. We provide credits but you may use any provider, open or hosted." },
      { q: "Who owns the IP?", a: "You do. Always." },
    ],
  },
  {
    slug: "startup-funding",
    title: "SorixLab Startup Funding Competition",
    tagline: "Pitch an AI-first startup. Best teams receive funding, mentorship, and a launch runway.",
    prize: "Up to $50,000 + 12 weeks of mentorship",
    status: "Applications close",
    cover: startupCompImg,
    overview:
      "An online-first competition for founders building AI-native companies. Shortlisted teams present to a panel of operators, engineers, and investors. Winners receive funding, hands-on mentorship from the SorixLab team, and a launch runway through the AI Sorix ecosystem.",
    tracks: [
      { title: "Productivity & Workspace", desc: "AI tools that change how individuals or teams work." },
      { title: "Vertical AI", desc: "Domain-specific products — health, agro, education, finance, climate." },
      { title: "Developer Tools", desc: "Infrastructure, agents, eval, observability, security." },
      { title: "Consumer AI", desc: "Apps people love. Habits, not curiosities." },
    ],
    criteria: [
      { title: "Problem clarity", desc: "Is the problem real, painful, and well understood?" },
      { title: "Solution insight", desc: "What do you see that others do not?" },
      { title: "Team", desc: "Why are you the right people, right now?" },
      { title: "Execution path", desc: "Can you ship and reach early users credibly?" },
    ],
    timeline: [
      { date: "Week 1", title: "Applications close", desc: "Submit a one-page memo and a 2-minute video." },
      { date: "Week 3", title: "Shortlist announced", desc: "Top 30 teams invited to a deep dive." },
      { date: "Week 5", title: "Mentor sprint", desc: "Two weeks of 1:1 mentorship with the SorixLab team." },
      { date: "Week 7", title: "Pitch day", desc: "Live online pitch to investor panel." },
      { date: "Week 8", title: "Funding decisions", desc: "Winners and runners-up announced and contracted." },
    ],
    prizes: [
      { place: "1st place", reward: "$50,000 + 12-week mentorship + AI Sorix launch spotlight" },
      { place: "2nd place", reward: "$25,000 + 8-week mentorship" },
      { place: "3rd place", reward: "$10,000 + 4-week mentorship" },
      { place: "Finalists (×7)", reward: "AI Sorix credits + mentor intros" },
    ],
    rules: [
      "Open to early-stage teams worldwide. Pre-incorporation is fine.",
      "At least one founder must commit to the program full-time during the funding window.",
      "Equity terms for funded teams are disclosed up front and standardised.",
      "Solo founders welcome. Side-projects with traction welcome.",
      "Any AI stack permitted. The product must use AI meaningfully.",
    ],
    faqs: [
      {
        q: "Do you take equity?",
        a: "For funded teams only, on standard, founder-friendly terms disclosed before you accept.",
      },
      {
        q: "Do I need a working prototype?",
        a: "Not required, but strongly preferred. A clickable demo or pilot is enough.",
      },
      { q: "Is it remote-friendly?", a: "Entirely. Everything is online." },
    ],
  },
];

export function getCourse(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

export function getCompetition(slug: string): Competition | undefined {
  return competitions.find((c) => c.slug === slug);
}
