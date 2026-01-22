import { useLanguage } from '../contexts/LanguageContext';
import { Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Testimonials = () => {
  const { language } = useLanguage();

  const testimonials = [
    {
      name: "Rafiq Ahmed",
      role: language === 'en' ? "Startup Founder" : "স্টার্টআপ প্রতিষ্ঠাতা",
      review: language === 'en' 
        ? "AI Sorix replaced 4 different AI subscriptions for me. Having ChatGPT, DeepSeek, Gemini and 7+ models in one place is a game-changer for my workflow."
        : "AI Sorix আমার ৪টি ভিন্ন AI সাবস্ক্রিপশন প্রতিস্থাপন করেছে। এক জায়গায় ChatGPT, DeepSeek, Gemini এবং ৭+ মডেল থাকা আমার কাজের জন্য অসাধারণ।",
      rating: 5
    },
    {
      name: "Fatima Khan",
      role: language === 'en' ? "Content Creator" : "কন্টেন্ট ক্রিয়েটর",
      review: language === 'en'
        ? "The Legends feature is incredible! I use it daily for writing scripts and creating social media content. The Bengali support is amazing."
        : "Legends ফিচারটি অবিশ্বাস্য! আমি প্রতিদিন স্ক্রিপ্ট লেখা এবং সোশ্যাল মিডিয়া কন্টেন্ট তৈরিতে এটি ব্যবহার করি।",
      rating: 5
    },
    {
      name: "Arjun Das",
      role: language === 'en' ? "University Student" : "বিশ্ববিদ্যালয় শিক্ষার্থী",
      review: language === 'en'
        ? "As a student, having access to all major AI models at an affordable price is perfect. Sorix Search helps me with research papers."
        : "একজন ছাত্র হিসেবে, সাশ্রয়ী মূল্যে সব AI মডেল অ্যাক্সেস করা দারুণ। Sorix Search আমার গবেষণা পত্রে সাহায্য করে।",
      rating: 5
    },
    {
      name: "Priya Sharma",
      role: language === 'en' ? "HR Manager" : "এইচআর ম্যানেজার",
      review: language === 'en'
        ? "I use AI Sorix for drafting job descriptions, interview questions, and employee communications. It saves me hours every week."
        : "আমি চাকরির বিবরণ, ইন্টারভিউ প্রশ্ন এবং কর্মচারী যোগাযোগের জন্য AI Sorix ব্যবহার করি। এটি প্রতি সপ্তাহে ঘণ্টা বাঁচায়।",
      rating: 5
    },
    {
      name: "Kamal Hossain",
      role: language === 'en' ? "Freelance Developer" : "ফ্রিল্যান্স ডেভেলপার",
      review: language === 'en'
        ? "The code assistance across different AI models is fantastic. I can compare outputs and choose the best solution for my projects."
        : "বিভিন্ন AI মডেলে কোড সহায়তা অসাধারণ। আমি আউটপুট তুলনা করে আমার প্রজেক্টের জন্য সেরাটি বেছে নিতে পারি।",
      rating: 5
    },
    {
      name: "Nusrat Jahan",
      role: language === 'en' ? "Business Consultant" : "ব্যবসায় পরামর্শদাতা",
      review: language === 'en'
        ? "Finally, a platform that understands our needs! The multi-model approach and local payment options make it perfect for Bangladesh."
        : "অবশেষে একটি প্ল্যাটফর্ম যা আমাদের চাহিদা বোঝে! মাল্টি-মডেল এবং স্থানীয় পেমেন্ট অপশন বাংলাদেশের জন্য উপযুক্ত।",
      rating: 5
    }
  ];

  const stats = [
    { value: "500+", label: language === 'en' ? "Beta Users" : "বেটা ব্যবহারকারী" },
    { value: "10+", label: language === 'en' ? "AI Models" : "AI মডেল" },
    { value: "85%", label: language === 'en' ? "Cost Savings" : "খরচ সাশ্রয়" },
    { value: "5x", label: language === 'en' ? "Productivity" : "উৎপাদনশীলতা" }
  ];

  return (
    <section className="py-10 sm:py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3 px-2">
            {language === 'en' ? (
              <>What Our <span className="text-primary">Early Adopters</span> Say</>
            ) : (
              <><span className="text-primary">প্রাথমিক ব্যবহারকারীরা</span> কী বলছেন</>
            )}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
            {language === 'en' 
              ? "Join hundreds of professionals, creators, and students who are already experiencing the future of AI"
              : "শত শত পেশাদার, ক্রিয়েটর এবং শিক্ষার্থীদের সাথে যোগ দিন যারা ইতিমধ্যে AI এর ভবিষ্যৎ অনুভব করছেন"}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-10 sm:mb-12">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-card border border-border rounded-xl p-4 sm:p-5 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-2 sm:mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              
              {/* Review */}
              <p className="text-primary text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                "{testimonial.review}"
              </p>
              
              {/* Author */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs sm:text-sm font-semibold text-primary">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-foreground text-xs sm:text-sm truncate">{testimonial.name}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* See All Reviews Button */}
        <div className="text-center mb-10">
          <Link 
            to="/reviews"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 hover:bg-primary/20 text-primary font-medium rounded-full transition-all duration-300 group"
          >
            <span>{language === 'en' ? 'See All 100 Reviews' : 'সব ১০০টি রিভিউ দেখুন'}</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-border">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-500 via-emerald-500 to-indigo-500 bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
