import React from "react";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Calendar, Clock, Tag } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "How AI is Transforming Education in Bangladesh",
    excerpt: "Discover how AI Sorix is empowering educators across Bangladesh with intelligent lesson planning, automated grading, and personalized learning pathways powered by advanced AI models.",
    date: "2026-04-10",
    readTime: "6 min read",
    category: "Education",
    slug: "ai-transforming-education-bangladesh",
  },
  {
    id: 2,
    title: "AI-Powered Agriculture: Revolutionizing Farming in South Asia",
    excerpt: "Sorix Agro brings cutting-edge crop disease detection, soil analysis, and yield prediction to farmers in Bangladesh and across Asia — making precision agriculture accessible to everyone.",
    date: "2026-04-05",
    readTime: "7 min read",
    category: "Agriculture",
    slug: "ai-powered-agriculture-south-asia",
  },
  {
    id: 3,
    title: "The Rise of AI Agents: Automating Workflows for Asian Startups",
    excerpt: "AI agents are changing how startups in Bangladesh and Southeast Asia operate. Learn how AI Sorix's autonomous agents handle research, content creation, and data analysis.",
    date: "2026-03-28",
    readTime: "5 min read",
    category: "AI Agents",
    slug: "ai-agents-automating-workflows-asian-startups",
  },
  {
    id: 4,
    title: "Sorix Health: AI-Driven Health Insights for Bangladesh",
    excerpt: "From symptom analysis to nutrition planning, Sorix Health is making AI-powered healthcare guidance accessible to millions across Bangladesh and the broader Asian region.",
    date: "2026-03-20",
    readTime: "6 min read",
    category: "Healthcare",
    slug: "sorix-health-ai-driven-insights-bangladesh",
  },
  {
    id: 5,
    title: "Why AI Sorix is Ranked Among Top 5 AI Tools in Asia",
    excerpt: "With a comprehensive suite of AI-powered tools — from chat and image generation to presentations and flow diagrams — AI Sorix is rapidly becoming the go-to AI platform in Bangladesh and Asia.",
    date: "2026-03-15",
    readTime: "8 min read",
    category: "Product",
    slug: "ai-sorix-top-5-ai-tools-asia",
  },
  {
    id: 6,
    title: "Building the Future of AI Research from Dhaka, Bangladesh",
    excerpt: "Sorix Lab, headquartered in Dhaka, is on a mission to democratize AI across Asia. Learn about our journey, our team, and our vision for making world-class AI accessible to everyone.",
    date: "2026-03-10",
    readTime: "5 min read",
    category: "Company",
    slug: "building-future-ai-research-dhaka-bangladesh",
  },
];

const BlogPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="AI Insights & Blog | AI Sorix - Top AI Platform in Bangladesh"
        description="Explore AI insights, tutorials, and industry trends from AI Sorix. Learn how AI is transforming education, agriculture, and healthcare across Bangladesh and Asia."
        path="/blog"
      />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-24">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Blog & AI Insights
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover how AI is reshaping industries across Bangladesh and Asia. Stay updated with the latest from AI Sorix.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
            >
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[11px] font-medium bg-primary/10 text-primary rounded-full px-3 py-1">
                    {post.category}
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPage;
