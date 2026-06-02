// Centralized content for SorixLab Project / AI Sorix Academy.
// Edit text and pricing here — pages re-render automatically.
import promptImg from "@/assets/course-prompt.jpg";
import agentsImg from "@/assets/course-agents.jpg";
import pmImg from "@/assets/course-pm.jpg";
import visionImg from "@/assets/course-vision.jpg";
import researchImg from "@/assets/course-research.jpg";
import llmopsImg from "@/assets/course-llmops.jpg";
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
    slug: "prompt-engineering-foundations",
    title: "Prompt Engineering Foundations",
    tagline: "From your first prompt to production-grade systems",
    level: "Beginner",
    duration: "6 hours · 4 modules",
    priceLabel: "Free",
    cover: promptImg,
    overview:
      "A no-fluff masterclass on writing prompts that actually work across GPT, Claude, Gemini, and open models. You will leave with a personal prompt library, a tested system-prompt template, and a clear mental model for when to reach for retrieval, tools, or fine-tuning.",
    outcomes: [
      "Design clear, testable prompts for any model",
      "Build reusable system-prompt templates",
      "Compare model outputs systematically",
      "Recognise and prevent hallucinations",
      "Apply role, context, and constraint patterns",
      "Use few-shot examples without overfitting",
      "Chain prompts safely for multi-step tasks",
      "Ship a prompt to a real workflow by day three",
    ],
    curriculum: [
      {
        title: "Module 1 · Mental models",
        lessons: [
          "How modern LLMs actually reason",
          "Tokens, context windows and cost",
          "Choosing the right model for the job",
        ],
      },
      {
        title: "Module 2 · Prompt anatomy",
        lessons: [
          "Role, task, context, constraints",
          "Few-shot examples that generalise",
          "Structured output with JSON schemas",
        ],
      },
      {
        title: "Module 3 · Evaluation",
        lessons: [
          "Building a personal eval set",
          "A/B testing prompts across models",
          "Detecting regressions early",
        ],
      },
      {
        title: "Module 4 · Shipping",
        lessons: [
          "From prompt to product",
          "Safety, guardrails, and red-teaming",
          "Capstone: ship one workflow you actually use",
        ],
      },
    ],
    instructor: {
      name: "The AI Sorix Team",
      role: "Frontier AI educators",
      bio: "Lessons compiled from real production work shipping multi-model AI features used by thousands of professionals worldwide.",
    },
    faqs: [
      { q: "Do I need a coding background?", a: "No. Module 1 through 3 require zero code. The shipping module shows simple no-code and low-code paths." },
      { q: "Which models will I use?", a: "GPT, Claude, Gemini, and at least one open-source model so you understand provider trade-offs." },
    ],
  },
  {
    slug: "build-ai-agents",
    title: "Build AI Agents with Sorix Agent",
    tagline: "Design autonomous agents that ship real work",
    level: "Intermediate",
    duration: "10 hours · 5 modules",
    priceLabel: "$79",
    cover: agentsImg,
    overview:
      "Move beyond chat. Design, deploy, and supervise autonomous agents that browse the web, call your APIs, and finish multi-step tasks unattended. Built around the Sorix Agent OS, but every pattern transfers to LangGraph, CrewAI, or your own stack.",
    outcomes: [
      "Decompose tasks into agent-friendly steps",
      "Pick the right tool surface for each agent",
      "Design memory that does not bloat context",
      "Add approval gates for high-risk actions",
      "Monitor agents in production",
      "Recover gracefully from tool failures",
      "Cost-optimise long-running workflows",
      "Ship a working agent to a real workflow",
    ],
    curriculum: [
      { title: "Module 1 · Agent fundamentals", lessons: ["Reactive vs deliberative agents", "Planning loops", "When NOT to use agents"] },
      { title: "Module 2 · Tool design", lessons: ["Function calling that scales", "Browser, file, and API tools", "Permission scoping"] },
      { title: "Module 3 · Memory & state", lessons: ["Working vs long-term memory", "Vector recall patterns", "Avoiding context drift"] },
      { title: "Module 4 · Supervision", lessons: ["Human-in-the-loop checkpoints", "Eval harnesses for agents", "Cost and latency budgets"] },
      { title: "Module 5 · Capstone", lessons: ["Build a research agent", "Build an outreach agent", "Deploy to your team"] },
    ],
    instructor: { name: "The AI Sorix Team", role: "Agent engineers", bio: "Patterns drawn from running the Sorix Agent OS at scale." },
    faqs: [
      { q: "Do I need an API budget?", a: "A small one. Allow roughly $10 of model credits to complete every exercise." },
      { q: "Can I use my own framework?", a: "Yes. We use Sorix Agent for examples but every concept maps to other frameworks." },
    ],
  },
  {
    slug: "ai-for-product-managers",
    title: "AI for Product Managers",
    tagline: "Ship AI features users actually keep using",
    level: "Intermediate",
    duration: "7 hours · 4 modules",
    priceLabel: "$59",
    cover: pmImg,
    overview:
      "A practical course for PMs who need to scope, prioritise, and measure AI features without drowning in jargon. Learn how to write AI PRDs that engineers respect and how to spot the failure modes that kill AI launches.",
    outcomes: [
      "Translate user problems into AI capabilities",
      "Write PRDs that include eval criteria",
      "Choose between RAG, fine-tuning, and prompting",
      "Estimate cost and latency early",
      "Run AI feature betas without burning trust",
      "Measure quality with the right metrics",
      "Negotiate model trade-offs with engineering",
      "Plan responsible rollout and kill criteria",
    ],
    curriculum: [
      { title: "Module 1 · Opportunity sizing", lessons: ["Where AI wins, where it loses", "User-job mapping", "Risk and trust budgets"] },
      { title: "Module 2 · Spec writing", lessons: ["The AI PRD template", "Defining 'good enough'", "Eval criteria up front"] },
      { title: "Module 3 · Build & beta", lessons: ["Working with prompt and model engineers", "Closed beta playbook", "Telemetry that matters"] },
      { title: "Module 4 · Launch & learn", lessons: ["Quality dashboards", "Drift and incident response", "When to deprecate a model"] },
    ],
    instructor: { name: "The AI Sorix Team", role: "Product strategy", bio: "From PMs who have shipped AI features used by professionals worldwide." },
    faqs: [
      { q: "Will I write code?", a: "Optional. The course is framework-agnostic and focuses on decisions, not implementation." },
    ],
  },
  {
    slug: "computer-vision-for-builders",
    title: "Computer Vision for Builders",
    tagline: "Real-world CV without a PhD",
    level: "Advanced",
    duration: "12 hours · 6 modules",
    priceLabel: "$119",
    cover: visionImg,
    overview:
      "A hands-on tour of modern vision models — from CLIP and SAM to multimodal LLMs — focused on what actually ships. Build a defect-detection pipeline, a document parser, and a real-time analytics demo by the end.",
    outcomes: [
      "Choose between open and hosted vision models",
      "Build robust image pipelines",
      "Use multimodal LLMs for OCR and parsing",
      "Fine-tune small CV models on your data",
      "Deploy vision inference at low cost",
      "Handle edge cases and adversarial inputs",
      "Combine CV with LLM reasoning",
      "Ship one vision feature end-to-end",
    ],
    curriculum: [
      { title: "Module 1 · Vision landscape", lessons: ["CNNs, ViTs, multimodal LLMs", "Open vs hosted trade-offs", "Lab setup"] },
      { title: "Module 2 · Pipelines", lessons: ["Preprocessing and augmentation", "Batch and stream inference", "Caching and cost"] },
      { title: "Module 3 · OCR & parsing", lessons: ["Document understanding with multimodal LLMs", "Tables and forms", "Quality gates"] },
      { title: "Module 4 · Detection & segmentation", lessons: ["SAM, Grounding DINO, YOLO", "Custom classes", "Active learning"] },
      { title: "Module 5 · Fine-tuning", lessons: ["LoRA for small models", "Data curation", "Eval and shipping"] },
      { title: "Module 6 · Capstone", lessons: ["Real-time analytics demo", "Defect detection pipeline", "Document parser"] },
    ],
    instructor: { name: "The AI Sorix Team", role: "Vision engineers", bio: "Patterns from production vision systems serving global customers." },
    faqs: [
      { q: "GPU required?", a: "A free-tier Colab is enough for most exercises. Fine-tuning works on a single consumer GPU." },
    ],
  },
  {
    slug: "ai-for-researchers-writers",
    title: "AI for Researchers & Writers",
    tagline: "Literature, synthesis and writing — at AI speed, with rigour",
    level: "Beginner",
    duration: "5 hours · 3 modules",
    priceLabel: "Free",
    cover: researchImg,
    overview:
      "A workflow-first course for academics, journalists, and serious writers. Use AI to map a literature, draft with discipline, and keep citations honest. We treat hallucination as a process problem, not a model problem.",
    outcomes: [
      "Build a fast, honest literature map",
      "Use AI without losing your voice",
      "Manage citations and provenance",
      "Avoid the most common hallucination traps",
      "Synthesize across sources at scale",
      "Outline long-form work with AI",
      "Edit with a model that respects your style",
      "Ship a publishable draft in one week",
    ],
    curriculum: [
      { title: "Module 1 · Research workflows", lessons: ["Sourcing", "Note systems", "AI-assisted synthesis"] },
      { title: "Module 2 · Writing with AI", lessons: ["Voice preservation", "Outlines and drafts", "Editing passes"] },
      { title: "Module 3 · Integrity", lessons: ["Citation hygiene", "Detecting fabrications", "Reader trust"] },
    ],
    instructor: { name: "The AI Sorix Team", role: "Research & editorial", bio: "Built from real workflows of researchers and writers using AI Sorix daily." },
    faqs: [
      { q: "Will my voice survive?", a: "Yes. The course is structured around protecting it." },
    ],
  },
  {
    slug: "llm-ops-and-evaluation",
    title: "LLM Ops & Evaluation",
    tagline: "Run AI features in production without surprises",
    level: "Advanced",
    duration: "9 hours · 5 modules",
    priceLabel: "$99",
    cover: llmopsImg,
    overview:
      "The course you wish your team had before launching its first AI feature. Set up evals, dashboards, drift detection, cost controls, and an incident playbook. Bring your own model stack — every pattern is provider-agnostic.",
    outcomes: [
      "Design an eval set that catches real regressions",
      "Track quality, cost, and latency in one view",
      "Detect model drift early",
      "Build kill-switches and fallbacks",
      "Run safe model migrations",
      "Manage prompt versions in production",
      "Respond to AI incidents like an SRE",
      "Forecast and cap AI spend",
    ],
    curriculum: [
      { title: "Module 1 · Eval foundations", lessons: ["Golden sets", "LLM-as-judge", "Human review queues"] },
      { title: "Module 2 · Observability", lessons: ["Traces and spans for LLMs", "Quality dashboards", "Drift signals"] },
      { title: "Module 3 · Cost & latency", lessons: ["Budgets and caps", "Caching strategies", "Routing across models"] },
      { title: "Module 4 · Safety & incidents", lessons: ["Kill-switches", "Rollback playbooks", "Postmortems"] },
      { title: "Module 5 · Migrations", lessons: ["Provider swaps", "Prompt versioning", "Shadow launches"] },
    ],
    instructor: { name: "The AI Sorix Team", role: "AI Ops", bio: "Practices used to keep AI Sorix running for users in many countries every day." },
    faqs: [
      { q: "Tooling required?", a: "Bring any observability stack. Examples use open tools so the patterns transfer anywhere." },
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
    title: "AI Sorix Build Challenge",
    tagline: "Build a useful AI product in 30 days. Win cash, credits, and a launch spotlight.",
    prize: "$15,000 prize pool",
    status: "Applications open",
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
      { date: "Week 1", title: "Applications open", desc: "Submit a 200-word idea and team profile." },
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
    status: "Applications open",
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
      { date: "Week 1", title: "Applications open", desc: "Submit a one-page memo and a 2-minute video." },
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
      { q: "Do you take equity?", a: "For funded teams only, on standard, founder-friendly terms disclosed before you accept." },
      { q: "Do I need a working prototype?", a: "Not required, but strongly preferred. A clickable demo or pilot is enough." },
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
