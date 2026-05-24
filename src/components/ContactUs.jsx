import React, { useState } from "react";
import { Mail, MapPin, Phone, Send, MessageSquare, Clock, ExternalLink } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const ContactUs = ({ onOpenChat }) => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Create mailto link with form data
    const mailtoLink = `mailto:support@aisorix.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`)}`;
    window.location.href = mailtoLink;
  };

  const contactInfo = [
    {
      icon: Mail,
      title: language === "en" ? "Email Us" : "ইমেইল করুন",
      value: "support@aisorix.com",
      link: "mailto:support@aisorix.com",
      description: language === "en" ? "For general inquiries and support" : "সাধারণ জিজ্ঞাসা ও সাপোর্টের জন্য",
    },
    {
      icon: MapPin,
      title: language === "en" ? "Our Office" : "আমাদের অফিস",
      value: language === "en" ? "Uttara, Dhaka" : "ঢাকা",
      description: language === "en" ? "AI Sorix HQ, Bangladesh" : "AI Sorix সদর দপ্তর, বাংলাদেশ",
    },
    {
      icon: Clock,
      title: language === "en" ? "Business Hours" : "কার্যকাল",
      value: language === "en" ? "Sat - Thu: 10AM - 6PM" : "শনি - বৃহস্পতি: সকাল ১০টা - সন্ধ্যা ৬টা",
      description: language === "en" ? "Bangladesh Standard Time (BST)" : "বাংলাদেশ স্ট্যান্ডার্ড টাইম (BST)",
    },
  ];

  const quickLinks = [
    {
      icon: MessageSquare,
      title: language === "en" ? "Live Chat" : "লাইভ চ্যাট",
      description: language === "en" ? "Chat with our support team" : "আমাদের সাপোর্ট টিমের সাথে চ্যাট করুন",
      action: language === "en" ? "Chat Now" : "চ্যাট করুন",
      isChat: true,
    },
    {
      icon: ExternalLink,
      title: language === "en" ? "Help Center" : "হেল্প সেন্টার",
      description: language === "en" ? "Browse FAQs and guides" : "FAQ ও গাইড ব্রাউজ করুন",
      action: language === "en" ? "Visit FAQs" : "FAQ দেখুন",
      link: "#faq",
    },
  ];

  return (
    <section id="contact" className="py-12 sm:py-16 md:py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/20 via-background to-background" />

      {/* Decorative Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/3 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] animate-pulse-slow" />
        <div
          className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-primary text-sm font-semibold mb-6">
            <Mail className="w-4 h-4" />
            {language === "en" ? "Contact Us" : "যোগাযোগ করুন"}
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-foreground mb-6 font-display">
            {language === "en" ? "Get In Touch" : "যোগাযোগ করুন"}
            <br />
            <span className="animated-gradient-text">
              {language === "en" ? "We'd Love to Hear From You" : "আপনার কথা শুনতে চাই"}
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {language === "en"
              ? "Have questions, feedback, or need assistance? Our team is here to help you make the most of AI Sorix."
              : "কোনো প্রশ্ন, মতামত বা সাহায্য দরকার? আমাদের টিম AI Sorix থেকে সর্বোচ্চ সুবিধা পেতে আপনাকে সাহায্য করতে প্রস্তুত।"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="futuristic-card p-6 rounded-2xl group hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:shadow-glow transition-all duration-300">
                    <info.icon className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-foreground mb-1">{info.title}</h4>
                    {info.link ? (
                      <a href={info.link} className="text-primary hover:underline font-medium block mb-1">
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-foreground font-medium mb-1">{info.value}</p>
                    )}
                    <p className="text-sm text-muted-foreground">{info.description}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-foreground">{language === "en" ? "Quick Links" : "দ্রুত লিঙ্ক"}</h4>
              {quickLinks.map((link, index) =>
                link.isChat ? (
                  <button
                    key={index}
                    onClick={onOpenChat}
                    className="glass-card p-4 rounded-xl flex items-center gap-4 group hover:border-primary/30 transition-all duration-300 w-full text-left"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <link.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-foreground">{link.title}</h5>
                      <p className="text-xs text-muted-foreground">{link.description}</p>
                    </div>
                    <span className="text-xs font-medium text-primary">{link.action}</span>
                  </button>
                ) : (
                  <a
                    key={index}
                    href={link.link || "#"}
                    className="glass-card p-4 rounded-xl flex items-center gap-4 group hover:border-primary/30 transition-all duration-300 block"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <link.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-foreground">{link.title}</h5>
                      <p className="text-xs text-muted-foreground">{link.description}</p>
                    </div>
                    <span className="text-xs font-medium text-primary">{link.action}</span>
                  </a>
                ),
              )}
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="futuristic-card p-6 sm:p-8 lg:p-10 rounded-3xl">
              <h3 className="text-2xl font-bold text-foreground mb-6">
                {language === "en" ? "Send us a Message" : "আমাদের মেসেজ পাঠান"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {language === "en" ? "Your Name" : "আপনার নাম"}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 text-foreground placeholder:text-muted-foreground"
                      placeholder={language === "en" ? "John Doe" : "আপনার নাম"}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {language === "en" ? "Your Email" : "আপনার ইমেইল"}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 text-foreground placeholder:text-muted-foreground"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {language === "en" ? "Subject" : "বিষয়"}
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 text-foreground placeholder:text-muted-foreground"
                    placeholder={language === "en" ? "How can we help?" : "আমরা কিভাবে সাহায্য করতে পারি?"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {language === "en" ? "Message" : "মেসেজ"}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 text-foreground placeholder:text-muted-foreground resize-none"
                    placeholder={
                      language === "en" ? "Tell us more about your inquiry..." : "আপনার জিজ্ঞাসা সম্পর্কে আরও বলুন..."
                    }
                  />
                </div>
                <button
                  type="submit"
                  className="w-full gradient-primary py-4 rounded-xl font-semibold text-foreground flex items-center justify-center gap-2 shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:scale-[1.02]"
                >
                  <Send className="w-5 h-5" />
                  {language === "en" ? "Send Message" : "মেসেজ পাঠান"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
