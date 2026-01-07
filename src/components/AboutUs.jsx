import React from 'react';
import { Users, Target, Lightbulb, Globe, Rocket, Heart } from 'lucide-react';
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

  return (
    <section id="about" className="py-20 sm:py-28 md:py-36 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      
      {/* Decorative Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-16 sm:mb-20">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-primary text-sm font-semibold mb-6">
            <Target className="w-4 h-4" />
            {language === 'en' ? 'About Us' : 'আমাদের সম্পর্কে'}
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-foreground mb-6 font-display">
            {language === 'en' ? 'Empowering Bangladesh' : 'বাংলাদেশকে শক্তিশালী করা'}
            <br />
            <span className="animated-gradient-text">
              {language === 'en' ? 'With AI Innovation' : 'AI উদ্ভাবনের মাধ্যমে'}
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            {language === 'en' 
              ? 'AI Sorix is Bangladesh\'s first unified AI platform, bringing together the world\'s most powerful AI models in one place. We\'re on a mission to democratize AI access for every Bangladeshi.' 
              : 'AI Sorix হল বাংলাদেশের প্রথম ইউনিফাইড AI প্ল্যাটফর্ম, বিশ্বের সবচেয়ে শক্তিশালী AI মডেলগুলোকে এক জায়গায় একত্রিত করে। আমরা প্রতিটি বাংলাদেশীর জন্য AI অ্যাক্সেস গণতান্ত্রিক করার মিশনে আছি।'}
          </p>
        </div>

        {/* Logo and Mission */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 mb-20">
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
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
        <div className="text-center mb-12">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            {language === 'en' ? 'Our Core Values' : 'আমাদের মূল মূল্যবোধ'}
          </h3>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {language === 'en' 
              ? 'The principles that guide everything we do at AI Sorix' 
              : 'যে নীতিগুলো AI Sorix-এ আমাদের সব কাজ পরিচালনা করে'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </div>
    </section>
  );
};

export default AboutUs;
