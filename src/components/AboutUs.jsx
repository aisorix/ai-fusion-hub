import React from 'react';
import { Users, Target, Lightbulb, Globe, Rocket, Heart, Code, Briefcase, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import logo from '../assets/logo.png';

const AboutUs = () => {
  const { language } = useLanguage();

  const values = [
    {
      icon: Lightbulb,
      title: language === 'en' ? 'Innovation First' : 'উদ্ভাবন প্রথম',
      description: language === 'en' 
        ? 'We push boundaries to bring cutting-edge AI technology to everyone.' 
        : 'আমরা সবার কাছে অত্যাধুনিক AI প্রযুক্তি পৌঁছে দিতে সীমানা ভাঙি।'
    },
    {
      icon: Users,
      title: language === 'en' ? 'User Centric' : 'ব্যবহারকারী কেন্দ্রিক',
      description: language === 'en' 
        ? 'Every feature we build starts with understanding our users\' needs.' 
        : 'প্রতিটি ফিচার তৈরি করি ব্যবহারকারীদের চাহিদা বুঝে।'
    },
    {
      icon: Globe,
      title: language === 'en' ? 'Local Focus' : 'স্থানীয় ফোকাস',
      description: language === 'en' 
        ? 'Built in Bangladesh, for Bangladesh, with local payment support.' 
        : 'বাংলাদেশে তৈরি, বাংলাদেশের জন্য, স্থানীয় পেমেন্ট সাপোর্ট সহ।'
    },
    {
      icon: Heart,
      title: language === 'en' ? 'Accessibility' : 'সহজলভ্যতা',
      description: language === 'en' 
        ? 'Making premium AI accessible and affordable for everyone.' 
        : 'প্রিমিয়াম AI সবার জন্য সহজলভ্য ও সাশ্রয়ী করা।'
    },
  ];

  const stats = [
    { value: '10+', label: language === 'en' ? 'AI Models' : 'AI মডেল' },
    { value: '10K+', label: language === 'en' ? 'Active Users' : 'সক্রিয় ব্যবহারকারী' },
    { value: '1M+', label: language === 'en' ? 'Queries Processed' : 'কোয়েরি প্রসেসড' },
    { value: '24/7', label: language === 'en' ? 'Support' : 'সাপোর্ট' },
  ];

  const teamMembers = [
    {
      name: 'Rakib Eslam',
      role: language === 'en' ? 'Founder' : 'প্রতিষ্ঠাতা',
      icon: Star,
    },
    {
      name: 'Shahadat Hossain',
      role: language === 'en' ? 'Lead Developer' : 'লিড ডেভেলপার',
      icon: Code,
    },
  ];

  return (
    <section id="about" className="py-12 sm:py-16 md:py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      
      {/* Decorative Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-primary text-sm font-semibold mb-6">
            <Target className="w-4 h-4" />
            {language === 'en' ? 'About Us' : 'আমাদের সম্পর্কে'}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-foreground mb-4 font-display">
            {language === 'en' ? 'Empowering Bangladesh' : 'বাংলাদেশকে শক্তিশালী করা'}
            <br />
            <span className="animated-gradient-text">
              {language === 'en' ? 'With AI Innovation' : 'AI উদ্ভাবনের মাধ্যমে'}
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {language === 'en' 
              ? 'AI Sorix is Bangladesh\'s first unified AI platform, bringing together the world\'s most powerful AI models in one place. We\'re on a mission to democratize AI access for every Bangladeshi.' 
              : 'AI Sorix হল বাংলাদেশের প্রথম ইউনিফাইড AI প্ল্যাটফর্ম, বিশ্বের সবচেয়ে শক্তিশালী AI মডেলগুলোকে এক জায়গায় একত্রিত করে। আমরা প্রতিটি বাংলাদেশীর জন্য AI অ্যাক্সেস গণতান্ত্রিক করার মিশনে আছি।'}
          </p>
        </div>

        {/* Logo and Mission */}
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 mb-12">
          <div className="relative group">
            <div className="absolute inset-0 gradient-primary blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 scale-150" />
            <div className="relative futuristic-card p-8 sm:p-12 rounded-3xl">
              <img src={logo} alt="AI Sorix" className="w-32 h-32 sm:w-40 sm:h-40 object-contain animate-float-slow" />
            </div>
          </div>
          <div className="flex-1 text-center lg:text-left">
            <div className="flex items-center gap-3 mb-4 justify-center lg:justify-start">
              <Rocket className="w-6 h-6 text-primary" />
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                {language === 'en' ? 'Our Mission' : 'আমাদের মিশন'}
              </h3>
            </div>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-6">
              {language === 'en' 
                ? 'We believe everyone deserves access to powerful AI tools. AI Sorix was founded to break down barriers and make premium AI models accessible to students, professionals, and businesses in Bangladesh at affordable prices with local payment options.' 
                : 'আমরা বিশ্বাস করি সবাই শক্তিশালী AI টুলস অ্যাক্সেস পাওয়ার যোগ্য। AI Sorix প্রতিষ্ঠিত হয়েছে বাধা ভেঙে বাংলাদেশের ছাত্র, পেশাদার এবং ব্যবসায়ীদের কাছে প্রিমিয়াম AI মডেল সাশ্রয়ী মূল্যে স্থানীয় পেমেন্ট অপশন সহ সহজলভ্য করতে।'}
            </p>
            <div className="glass-card inline-flex items-center gap-3 px-6 py-3 rounded-xl">
              <span className="text-sm font-semibold text-foreground">📍 {language === 'en' ? 'Proudly Made in Bangladesh' : 'গর্বের সাথে বাংলাদেশে তৈরি'}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="futuristic-card p-6 sm:p-8 rounded-2xl text-center group hover:-translate-y-2 transition-all duration-300"
            >
              <div className="text-3xl sm:text-4xl md:text-5xl font-black text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="text-sm sm:text-base text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="text-center mb-8">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            {language === 'en' ? 'Our Core Values' : 'আমাদের মূল মূল্যবোধ'}
          </h3>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {language === 'en' 
              ? 'The principles that guide everything we do at AI Sorix' 
              : 'যে নীতিগুলো AI Sorix-এ আমাদের সব কাজ পরিচালনা করে'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {values.map((value, index) => (
            <div 
              key={index} 
              className="futuristic-card p-6 rounded-2xl group hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-glow transition-all duration-300">
                <value.icon className="w-7 h-7 text-foreground" />
              </div>
              <h4 className="text-lg font-bold text-foreground mb-2">{value.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>

        {/* Sorix Lab Section */}
        <div id="sorix-lab" className="relative mt-12 scroll-mt-24">
          <div className="absolute inset-0 gradient-primary opacity-5 rounded-3xl blur-3xl" />
          <div className="relative futuristic-card rounded-3xl p-8 sm:p-12 lg:p-16 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-[60px]" />
            
            <div className="relative z-10">
              {/* Sorix Lab Header */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6">
                  <Rocket className="w-4 h-4" />
                  {language === 'en' ? 'Our Parent Company' : 'আমাদের মূল কোম্পানি'}
                </div>
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
                  {language === 'en' ? 'About' : ''} <span className="animated-gradient-text">Sorix Lab</span>
                </h3>
                <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  {language === 'en' 
                    ? 'Sorix Lab is a Bangladesh-based R&D hub dedicated to shaping the future of AI, Education, and Social Innovation. Our mission is to build impactful technology that empowers the next generation.' 
                    : 'সোরিক্স ল্যাব বাংলাদেশ-ভিত্তিক একটি R&D হাব যা AI, শিক্ষা এবং সামাজিক উদ্ভাবনের ভবিষ্যৎ গঠনে নিবেদিত। আমাদের মিশন হল পরবর্তী প্রজন্মকে শক্তিশালী করে এমন প্রভাবশালী প্রযুক্তি তৈরি করা।'}
                </p>
              </div>

              {/* AI Sorix Highlight */}
              <div className="glass-card p-6 sm:p-8 rounded-2xl mb-12 border border-primary/20">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center flex-shrink-0">
                    <img src={logo} alt="AI Sorix" className="w-12 h-12 object-contain" />
                  </div>
                  <div className="text-center md:text-left">
                    <h4 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                      {language === 'en' ? 'AI Sorix — Our Flagship Product' : 'AI Sorix — আমাদের ফ্ল্যাগশিপ পণ্য'}
                    </h4>
                    <p className="text-muted-foreground">
                      {language === 'en' 
                        ? 'A first step toward a comprehensive ecosystem designed to revolutionize how students and researchers interact with intelligence.' 
                        : 'শিক্ষার্থী এবং গবেষকরা কীভাবে বুদ্ধিমত্তার সাথে যোগাযোগ করে তা বিপ্লব করার জন্য ডিজাইন করা একটি সমগ্র ইকোসিস্টেমের দিকে প্রথম পদক্ষেপ।'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Team Section */}
              <div className="text-center mb-8">
                <h4 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  {language === 'en' ? 'Meet the Team' : 'টিমের সাথে পরিচিত হন'}
                </h4>
                <p className="text-muted-foreground">
                  {language === 'en' ? 'The minds behind Sorix Lab' : 'সোরিক্স ল্যাবের পেছনের মস্তিষ্করা'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 max-w-2xl mx-auto">
                {teamMembers.map((member, index) => (
                  <div 
                    key={index}
                    className="group relative bg-background/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <member.icon className="w-8 h-8 text-foreground" />
                    </div>
                    <h5 className="text-lg font-bold text-foreground text-center mb-1">{member.name}</h5>
                    <p className="text-sm text-primary font-medium text-center mb-2">{member.role}</p>
                    {member.description && (
                      <p className="text-xs text-muted-foreground text-center leading-relaxed">{member.description}</p>
                    )}
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
