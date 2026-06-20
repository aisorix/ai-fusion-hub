import founderAsset from "@/assets/founder-rakib.jpg.asset.json";

export interface WorkshopData {
  slug: string;
  badge: string;
  title: string;
  desc: string;
  price: string;
  oldPrice?: string;
  date: string;
  time: string;
  location: string;
  cover: string;
  // Detail-page extras
  heroTitleLines: string[];
  heroTagline: string;
  deadlineISO: string;
  problems: string[];
  learnings: { title: string; desc: string }[];
  curriculum: { title: string; lessons: string[] }[];
  faqs: { q: string; a: string }[];
  perks: string[];
}

export const WORKSHOPS: WorkshopData[] = [
  {
    slug: "ai-private-batch-2month",
    badge: "লাইভ ওয়ার্কশপ",
    title: "২ মাসের AI প্রাইভেট ব্যাচ",
    desc: "আপনার লক্ষ্য অনুযায়ী AI শেখার জন্য জয়েন করুন আমাদের প্রাইভেট ব্যাচে।",
    price: "৳৫০০০",
    date: "১ জুলাই – ৩১ আগস্ট",
    time: "রাত ৯ টা",
    location: "Google Meet",
    cover: founderAsset.url,
    heroTitleLines: ["২ মাসের AI", "প্রাইভেট ব্যাচ"],
    heroTagline:
      "আপনার লক্ষ্য, আপনার গতি — ছোট ব্যাচে ১:১ মেন্টরিং নিয়ে AI শিখুন। প্রতিদিন প্র্যাকটিকাল প্রজেক্ট, সাপ্তাহিক রিভিউ আর প্রাইভেট সাপোর্ট গ্রুপ।",
    deadlineISO: new Date(Date.now() + 23 * 86400000 + 2 * 3600000).toISOString(),
    problems: [
      "ভিডিও কোর্স কিনে রেখেছেন, কিন্তু একা একা শেষ করতে পারছেন না।",
      "AI টুল অনেক, কিন্তু আপনার নির্দিষ্ট জব/ব্যবসায় কোনটা কিভাবে কাজে লাগাবেন বুঝতে পারছেন না।",
      "প্রশ্ন করার জায়গা নেই — আটকে গেলে দিন পার হয়ে যায়।",
      "নিজে একটা real workflow build করতে পারছেন না।",
    ],
    learnings: [
      {
        title: "Personal AI roadmap",
        desc: "আপনার জব/ব্যবসার জন্য customized ৮ সপ্তাহের শেখার roadmap।",
      },
      {
        title: "Live mentor sessions",
        desc: "সপ্তাহে ৩টি লাইভ ক্লাস + Q&A। মেন্টরের সরাসরি সাপোর্ট।",
      },
      {
        title: "Hands-on projects",
        desc: "প্রতি সপ্তাহে একটি real-world AI project — review সহ।",
      },
      {
        title: "Private community",
        desc: "ছোট ব্যাচের প্রাইভেট গ্রুপে peer learning ও সাপোর্ট।",
      },
    ],
    curriculum: [
      {
        title: "Week 1-2 · Foundation",
        lessons: [
          "AI mindset ও frontier টুল পরিচিতি",
          "ChatGPT, Claude, Gemini hands-on",
          "Prompt engineering essentials",
          "নিজের প্রথম AI workflow setup",
        ],
      },
      {
        title: "Week 3-4 · Writing & Communication",
        lessons: [
          "Professional email automation",
          "Long-form content + report generation",
          "Tone, style ও audience control",
          "Meeting note → structured summary",
        ],
      },
      {
        title: "Week 5-6 · Presentation, Research & Data",
        lessons: [
          "AI দিয়ে slide ও speaker note তৈরি",
          "Research workflow + source verification",
          "Spreadsheet ও data analysis",
          "Insight extraction storytelling",
        ],
      },
      {
        title: "Week 7-8 · Build Your Own AI Workflow",
        lessons: [
          "Custom GPT / agent তৈরি",
          "API + automation basics (no-code)",
          "Capstone project + portfolio তৈরি",
          "Career & freelancing roadmap",
        ],
      },
    ],
    faqs: [
      { q: "ক্লাস কি লাইভ হবে?", a: "হ্যাঁ, সম্পূর্ণ লাইভ Google Meet-এ। প্রতিটি ক্লাসের রেকর্ডিং ও পাবেন।" },
      { q: "ব্যাচ সাইজ কত?", a: "প্রতি ব্যাচে সর্বোচ্চ ১৫ জন — যাতে সবাই individual attention পান।" },
      { q: "আমি একদম নতুন, পারবো?", a: "অবশ্যই। ফাউন্ডেশন থেকে শুরু করে আমরা ধাপে ধাপে নিয়ে যাবো।" },
      { q: "সার্টিফিকেট পাবো?", a: "হ্যাঁ, capstone সম্পন্ন করলে AI Sorix verified certificate পাবেন।" },
      { q: "পেমেন্ট কিভাবে?", a: "bKash, Nagad, কার্ড সহ সকল নিরাপদ পেমেন্ট মেথড সাপোর্ট করি।" },
    ],
    perks: [
      "৮ সপ্তাহের নিবিড় লাইভ ট্রেনিং",
      "Personalized AI roadmap",
      "সাপ্তাহিক ১:১ মেন্টর রিভিউ",
      "প্রাইভেট WhatsApp সাপোর্ট গ্রুপ",
      "১০০+ প্র্যাকটিকাল প্রম্পট টেমপ্লেট",
      "লাইফটাইম রেকর্ডিং অ্যাক্সেস + সার্টিফিকেট",
    ],
  },
  {
    slug: "ai-smart-productivity-3day",
    badge: "চলমান ব্যাচ: Batch 4",
    title: "৩ দিনের AI লাইভ ওয়ার্কশপ",
    desc: "প্রতিযোগিতায় টিকে থাকতে AI শেখার বিকল্প নেই। আপনার ৫ ঘণ্টার কাজ ৫ মিনিটে নামিয়ে আনতে জয়েন করুন এই প্র্যাক্টিক্যাল সেশনে।",
    price: "৳৪৭০",
    oldPrice: "৳৯৯৯",
    date: "১৬, ১৭, ১৮ জুলাই",
    time: "রাত ৯ টা",
    location: "Google Meet",
    cover: founderAsset.url,
    heroTitleLines: ["৩ দিনের AI", "লাইভ ওয়ার্কশপ"],
    heroTagline:
      "প্রতিযোগিতায় টিকে থাকতে AI শেখার বিকল্প নেই। আপনার ৫ ঘণ্টার কাজ ৫ মিনিটে নামিয়ে আনতে জয়েন করুন এই প্র্যাক্টিক্যাল সেশনে।",
    deadlineISO: new Date(Date.now() + 23 * 86400000 + 2 * 3600000 + 23 * 60000 + 41 * 1000).toISOString(),
    problems: [
      "AI টুলস ব্যবহার করে আশানুরূপ রেজাল্ট পাচ্ছেন না?",
      "কিভাবে সঠিক প্রম্পট লিখতে হয় তা নিয়ে বিভ্রান্তিতে আছেন?",
      "ঘণ্টার পর ঘণ্টা সময় নষ্ট হচ্ছে ভুল আউটপুট ঠিক করতে?",
      "AI-এর কারণে চাকরি বা ফ্রিল্যান্সিংয়ে পিছিয়ে পড়ার ভয়ে আছেন?",
    ],
    learnings: [
      {
        title: "বেসিক টু অ্যাডভান্সড প্রম্পটিং",
        desc: "AI-এর কোর মেকানিজম বুঝে নিখুঁত প্রম্পট লেখার রুলস।",
      },
      {
        title: "কন্টেন্ট অটোমেশন",
        desc: "ঘণ্টার কাজ মিনিটে করার জন্য এআই অটোমেশন ফ্রেমওয়ার্ক।",
      },
      {
        title: "রোল-প্লে ও কনটেক্সট",
        desc: "AI-কে নির্দিষ্ট রোল বা ব্যক্তিত্ব দিয়ে কাজ করিয়ে নেওয়ার উপায়।",
      },
      {
        title: "রিয়েল-লাইফ প্রজেক্ট",
        desc: "ক্লায়েন্টের কাজ বা অফিসের প্রজেক্টে এআই-এর ব্যবহারিক প্রয়োগ।",
      },
    ],
    curriculum: [
      {
        title: "1st Day - ফাউন্ডেশন ও জনপ্রিয় AI টুলস",
        lessons: [
          "The Purpose of learning AI",
          "Prompt Engineering & Context Engineering",
          "ChatGPT এর পরিচিতি, প্রয়োগ ও হাতে কলমে ব্যবহার",
          "Claude এর পরিচিতি, প্রয়োগ ও হাতে কলমে ব্যবহার",
          "Napkin এর পরিচিতি, প্রয়োগ ও হাতে কলমে ব্যবহার",
        ],
      },
      {
        title: "2nd Day - এডভান্সড টুলস ও টেকনিক",
        lessons: [
          "Custom GPT ও AI Agent তৈরি",
          "ছবি ও ভিডিও জেনারেশন (Midjourney, Sora)",
          "Voice ও ট্রান্সক্রিপশন টুলস",
          "Workflow অটোমেশন (Zapier + AI)",
          "AI দিয়ে কন্টেন্ট ক্রিয়েশন pipeline",
        ],
      },
      {
        title: "3rd Day - রিয়েল প্রজেক্ট ও মনিটাইজেশন",
        lessons: [
          "জব ও ফ্রিল্যান্সিংয়ে AI ব্যবহার",
          "৫০+ ready-to-use প্রম্পট টেমপ্লেট",
          "নিজের একটি AI workflow build",
          "প্রশ্ন উত্তর ও কমিউনিটি সাপোর্ট",
        ],
      },
    ],
    faqs: [
      { q: "ক্লাস কি লাইভ হবে?", a: "হ্যাঁ, ক্লাসগুলো সম্পূর্ণ লাইভ হবে Google Meet-এর মাধ্যমে।" },
      { q: "রেকর্ডিং দেওয়া হবে কি?", a: "হ্যাঁ, প্রতিটি ক্লাসের রেকর্ডিং লাইফটাইম এক্সেসসহ পাবেন।" },
      { q: "আমি একদম নতুন, আমি কি পারবো?", a: "অবশ্যই। ওয়ার্কশপটি একদম বেসিক থেকে শুরু হবে — কোনো পূর্ব অভিজ্ঞতা প্রয়োজন নেই।" },
      { q: "সার্টিফিকেট পাবো?", a: "হ্যাঁ, ওয়ার্কশপ শেষে Certificate of Participation পাবেন।" },
    ],
    perks: [
      "২ ঘন্টার নিবিড় লাইভ ট্রেনিং",
      "প্রম্পট ইঞ্জিনিয়ারিংয়ের ৫০+ টেমপ্লেট",
      "লাইফটাইম রেকর্ডিং অ্যাক্সেস",
      "ডেডিকেটেড প্রাইভেট সাপোর্ট গ্রুপ",
      "ওয়ার্কশপ ম্যাটেরিয়ালস",
      "সার্টিফিকেট অফ পার্টিসিপেশন",
    ],
  },
];

export const getWorkshop = (slug: string) =>
  WORKSHOPS.find((w) => w.slug === slug);
