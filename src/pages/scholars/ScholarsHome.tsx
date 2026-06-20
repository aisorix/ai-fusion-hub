import SEOHead from "@/components/SEOHead";
import ScholarsHero from "@/components/scholars/sections/ScholarsHero";
import WhyScholars from "@/components/scholars/sections/WhyScholars";
import WhyLearnAI from "@/components/scholars/sections/WhyLearnAI";
import WhatWeDo from "@/components/scholars/sections/WhatWeDo";
import PopularCourses from "@/components/scholars/sections/PopularCourses";
import UpcomingWorkshops from "@/components/scholars/sections/UpcomingWorkshops";
import ScholarsTestimonials from "@/components/scholars/sections/ScholarsTestimonials";
import ScholarsFAQ from "@/components/scholars/sections/ScholarsFAQ";
import ScholarsContactCTA from "@/components/scholars/sections/ScholarsContactCTA";

export default function ScholarsHome() {
  return (
    <>
      <SEOHead
        title="Sorix Scholars — Learn frontier AI, build, get certified"
        description="Sorix Scholars is the learning arm of AI Sorix. Take free and pro courses, enter global competitions, earn recognised certificates."
        path="/sorixscholars"
      />
      <ScholarsHero />
      <WhyScholars />
      <WhyLearnAI />
      <WhatWeDo />
      <PopularCourses />
      <UpcomingWorkshops />
      <span id="testimonials" />
      <ScholarsTestimonials />
      <span id="faq" />
      <ScholarsFAQ />
      <span id="contact" />
      <ScholarsContactCTA />
    </>
  );
}
