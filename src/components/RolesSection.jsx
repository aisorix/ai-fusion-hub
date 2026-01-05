import React, { useState } from 'react';
import { 
  Rocket, MessageCircle, GraduationCap, FileText, Users,
  Presentation, TrendingUp, Target, DollarSign,
  Lightbulb, FileEdit, Search, Image,
  BookOpen, ClipboardList, SearchCheck, Briefcase,
  FileSpreadsheet, Database, PenTool, Library,
  FileCheck, UserCheck, ClipboardCheck, BarChart3
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const RolesSection = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('entrepreneurs');

  const tabs = [
    { id: 'entrepreneurs', label: language === 'en' ? 'Entrepreneurs' : 'উদ্যোক্তা', icon: Rocket },
    { id: 'creators', label: language === 'en' ? 'Content Creators' : 'কন্টেন্ট ক্রিয়েটর', icon: MessageCircle },
    { id: 'students', label: language === 'en' ? 'Students' : 'শিক্ষার্থী', icon: GraduationCap },
    { id: 'consultants', label: language === 'en' ? 'Consultants' : 'কনসালট্যান্ট', icon: FileText },
    { id: 'hr', label: language === 'en' ? 'HR Professionals' : 'এইচআর প্রফেশনাল', icon: Users },
  ];

  const roleContent = {
    entrepreneurs: [
      {
        icon: Presentation,
        title: language === 'en' ? 'Business Plans' : 'বিজনেস প্ল্যান',
        desc: language === 'en' 
          ? 'Create comprehensive business plans and pitch decks to secure funding from investors in Bangladesh and abroad.'
          : 'বাংলাদেশ ও বিদেশে বিনিয়োগকারীদের কাছ থেকে ফান্ডিং পেতে ব্যাপক বিজনেস প্ল্যান এবং পিচ ডেক তৈরি করুন।'
      },
      {
        icon: TrendingUp,
        title: language === 'en' ? 'Market Research' : 'মার্কেট রিসার্চ',
        desc: language === 'en'
          ? 'Analyze market trends, competitors, and opportunities in the Bangladeshi market with AI-driven insights.'
          : 'AI-চালিত ইনসাইট দিয়ে বাংলাদেশি মার্কেটে ট্রেন্ড, প্রতিযোগী এবং সুযোগ বিশ্লেষণ করুন।'
      },
      {
        icon: Target,
        title: language === 'en' ? 'Product Strategy' : 'প্রোডাক্ট স্ট্র্যাটেজি',
        desc: language === 'en'
          ? 'Develop product roadmaps, features, and go-to-market strategies for the South Asian market.'
          : 'দক্ষিণ এশিয়ান মার্কেটের জন্য প্রোডাক্ট রোডম্যাপ, ফিচার এবং গো-টু-মার্কেট স্ট্র্যাটেজি তৈরি করুন।'
      },
      {
        icon: DollarSign,
        title: language === 'en' ? 'Financial Modeling' : 'ফিন্যান্সিয়াল মডেলিং',
        desc: language === 'en'
          ? 'Build financial projections, budgets, and forecasts for your startup in BDT and USD.'
          : 'আপনার স্টার্টআপের জন্য BDT ও USD-তে আর্থিক প্রজেকশন, বাজেট এবং ফোরকাস্ট তৈরি করুন।'
      }
    ],
    creators: [
      {
        icon: Lightbulb,
        title: language === 'en' ? 'Content Ideas' : 'কন্টেন্ট আইডিয়া',
        desc: language === 'en'
          ? 'Generate endless content ideas for blogs, videos, and social media that resonate with Bangladeshi audiences.'
          : 'বাংলাদেশি দর্শকদের সাথে মিলে যায় এমন ব্লগ, ভিডিও এবং সোশ্যাল মিডিয়ার জন্য অসীম কন্টেন্ট আইডিয়া তৈরি করুন।'
      },
      {
        icon: FileEdit,
        title: language === 'en' ? 'Script Writing' : 'স্ক্রিপ্ট রাইটিং',
        desc: language === 'en'
          ? 'Create engaging scripts for videos, podcasts, and presentations in minutes — in Bengali or English.'
          : 'মিনিটেই ভিডিও, পডকাস্ট এবং প্রেজেন্টেশনের জন্য আকর্ষণীয় স্ক্রিপ্ট তৈরি করুন — বাংলা বা ইংরেজিতে।'
      },
      {
        icon: Search,
        title: language === 'en' ? 'SEO Optimization' : 'এসইও অপটিমাইজেশন',
        desc: language === 'en'
          ? 'Optimize your content for search engines with AI-powered keyword research and recommendations.'
          : 'AI-চালিত কীওয়ার্ড রিসার্চ এবং সুপারিশ দিয়ে সার্চ ইঞ্জিনের জন্য আপনার কন্টেন্ট অপটিমাইজ করুন।'
      },
      {
        icon: Image,
        title: language === 'en' ? 'Visual Assets' : 'ভিজ্যুয়াল অ্যাসেট',
        desc: language === 'en'
          ? 'Generate stunning images, graphics, and thumbnails to make your content stand out.'
          : 'আপনার কন্টেন্টকে আলাদা করে তুলতে অসাধারণ ছবি, গ্রাফিক্স এবং থাম্বনেইল তৈরি করুন।'
      }
    ],
    students: [
      {
        icon: BookOpen,
        title: language === 'en' ? 'Essay Writing' : 'প্রবন্ধ লেখা',
        desc: language === 'en'
          ? 'Get help with research, outlines, and drafting essays for any subject — from SSC to university level.'
          : 'SSC থেকে বিশ্ববিদ্যালয় পর্যন্ত যেকোনো বিষয়ে রিসার্চ, আউটলাইন এবং প্রবন্ধ লেখায় সাহায্য পান।'
      },
      {
        icon: ClipboardList,
        title: language === 'en' ? 'Study Guides' : 'স্টাডি গাইড',
        desc: language === 'en'
          ? 'Create personalized study materials, flashcards, and practice questions for exams.'
          : 'পরীক্ষার জন্য ব্যক্তিগত স্টাডি ম্যাটেরিয়াল, ফ্ল্যাশকার্ড এবং প্র্যাকটিস প্রশ্ন তৈরি করুন।'
      },
      {
        icon: SearchCheck,
        title: language === 'en' ? 'Research Assistant' : 'রিসার্চ অ্যাসিস্ট্যান্ট',
        desc: language === 'en'
          ? 'Find sources, summarize papers, and organize research for your thesis and projects.'
          : 'আপনার থিসিস এবং প্রজেক্টের জন্য সোর্স খুঁজুন, পেপার সংক্ষেপ করুন এবং রিসার্চ সংগঠিত করুন।'
      },
      {
        icon: Briefcase,
        title: language === 'en' ? 'Career Planning' : 'ক্যারিয়ার প্ল্যানিং',
        desc: language === 'en'
          ? 'Build resumes, prepare for interviews, and explore career paths in Bangladesh and globally.'
          : 'রেজিউম তৈরি করুন, ইন্টারভিউয়ের জন্য প্রস্তুতি নিন এবং বাংলাদেশ ও বিশ্বে ক্যারিয়ার পথ অন্বেষণ করুন।'
      }
    ],
    consultants: [
      {
        icon: FileSpreadsheet,
        title: language === 'en' ? 'Client Reports' : 'ক্লায়েন্ট রিপোর্ট',
        desc: language === 'en'
          ? 'Generate professional reports and presentations for client deliverables quickly.'
          : 'ক্লায়েন্ট ডেলিভারেবলের জন্য দ্রুত প্রফেশনাল রিপোর্ট এবং প্রেজেন্টেশন তৈরি করুন।'
      },
      {
        icon: Database,
        title: language === 'en' ? 'Data Analysis' : 'ডাটা অ্যানালাইসিস',
        desc: language === 'en'
          ? 'Analyze complex data sets and extract actionable insights for your clients.'
          : 'জটিল ডাটা সেট বিশ্লেষণ করুন এবং আপনার ক্লায়েন্টদের জন্য কার্যকর ইনসাইট বের করুন।'
      },
      {
        icon: PenTool,
        title: language === 'en' ? 'Proposal Writing' : 'প্রপোজাল রাইটিং',
        desc: language === 'en'
          ? 'Create winning proposals and statements of work to land new clients in Bangladesh.'
          : 'বাংলাদেশে নতুন ক্লায়েন্ট পেতে বিজয়ী প্রপোজাল এবং স্টেটমেন্ট অফ ওয়ার্ক তৈরি করুন।'
      },
      {
        icon: Library,
        title: language === 'en' ? 'Knowledge Base' : 'নলেজ বেস',
        desc: language === 'en'
          ? 'Build and maintain consulting frameworks and best practices library.'
          : 'কনসালটিং ফ্রেমওয়ার্ক এবং বেস্ট প্র্যাকটিস লাইব্রেরি তৈরি ও রক্ষণাবেক্ষণ করুন।'
      }
    ],
    hr: [
      {
        icon: FileCheck,
        title: language === 'en' ? 'Job Descriptions' : 'জব ডেস্ক্রিপশন',
        desc: language === 'en'
          ? 'Create compelling job postings that attract top talent with AI-optimized language.'
          : 'AI-অপটিমাইজড ভাষায় আকর্ষণীয় জব পোস্টিং তৈরি করুন যা সেরা প্রতিভা আকর্ষণ করে।'
      },
      {
        icon: UserCheck,
        title: language === 'en' ? 'Interview Prep' : 'ইন্টারভিউ প্রস্তুতি',
        desc: language === 'en'
          ? 'Generate interview questions and evaluation criteria tailored to specific roles.'
          : 'নির্দিষ্ট পদের জন্য উপযোগী ইন্টারভিউ প্রশ্ন এবং মূল্যায়ন মানদণ্ড তৈরি করুন।'
      },
      {
        icon: ClipboardCheck,
        title: language === 'en' ? 'Policy Drafting' : 'পলিসি ড্রাফটিং',
        desc: language === 'en'
          ? 'Draft HR policies, employee handbooks, and compliance documents efficiently.'
          : 'দক্ষতার সাথে HR পলিসি, এমপ্লয়ি হ্যান্ডবুক এবং কমপ্লায়েন্স ডকুমেন্ট ড্রাফট করুন।'
      },
      {
        icon: BarChart3,
        title: language === 'en' ? 'Performance Reviews' : 'পারফরম্যান্স রিভিউ',
        desc: language === 'en'
          ? 'Generate constructive feedback and performance review templates for your team.'
          : 'আপনার টিমের জন্য গঠনমূলক ফিডব্যাক এবং পারফরম্যান্স রিভিউ টেমপ্লেট তৈরি করুন।'
      }
    ]
  };

  return (
    <section className="py-10 sm:py-16 md:py-24 bg-primary/5 relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground px-2">
            {language === 'en' ? 'For Every Role & Every Need' : 'প্রতিটি ভূমিকা ও প্রয়োজনের জন্য'}
          </h2>
        </div>

        {/* Tabs Navigation - Horizontal scroll on mobile */}
        <div className="flex overflow-x-auto gap-2 sm:gap-3 md:gap-4 mb-8 sm:mb-12 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center scrollbar-hide">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 md:py-4 rounded-xl font-medium transition-all duration-300 flex-shrink-0 ${
                  isActive
                    ? 'bg-card shadow-lg border border-primary/30 text-primary'
                    : 'bg-card/50 text-muted-foreground hover:text-foreground hover:bg-card hover:shadow-md border border-transparent'
                }`}
              >
                <div className={`p-1.5 sm:p-2 rounded-lg ${isActive ? 'bg-primary/10' : 'bg-muted'}`}>
                  <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'text-primary' : ''}`} />
                </div>
                <span className="text-xs sm:text-sm md:text-base whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="bg-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 border border-border shadow-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            {roleContent[activeTab].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="flex items-start gap-3 sm:gap-4 group">
                  <div className="flex-shrink-0 p-2.5 sm:p-3 rounded-xl bg-muted text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground mb-1 sm:mb-2">{item.title}</h3>
                    <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RolesSection;
