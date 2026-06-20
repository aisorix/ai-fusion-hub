import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Calendar, Clock, MapPin } from "lucide-react";
import SorixDetailPage from "@/components/scholars/SorixDetailPage";
import { getWorkshop } from "@/data/workshops";
import founderAsset from "@/assets/founder-rakib.jpg.asset.json";
import { supabase } from "@/integrations/supabase/client";

export default function WorkshopDetailPage() {
  const { slug = "" } = useParams();
  const w = getWorkshop(slug);
  const [dbItem, setDbItem] = useState<any>(null);
  useEffect(() => {
    supabase.from("workshops").select("id, slug, title, price_bdt, seats_total, seats_booked").eq("slug", slug).maybeSingle()
      .then(({ data }) => setDbItem(data));
  }, [slug]);
  if (!w) return <Navigate to="/sorixscholars/workshops" replace />;
  const seatsLeft = dbItem?.seats_total ? Math.max(0, (dbItem.seats_total || 0) - (dbItem.seats_booked || 0)) : null;

  return (
    <SorixDetailPage
      cfg={{
        seoTitle: `${w.title} · Sorix Scholars Workshop`,
        seoDescription: w.desc,
        seoPath: `/sorixscholars/workshops/${w.slug}`,
        backHref: "/sorixscholars/workshops",
        backLabel: "সব ওয়ার্কশপ",

        heroBadge: w.badge,
        heroTitleLines: w.heroTitleLines,
        heroTagline: w.heroTagline,
        heroPills: [
          { icon: <Calendar className="w-4 h-4" />, label: w.date },
          { icon: <Clock className="w-4 h-4" />, label: w.time },
          { icon: <MapPin className="w-4 h-4" />, label: w.location },
        ],
        heroCoverUrl: w.cover,
        primaryCtaLabel: "সিট বুক করুন",
        curriculumCtaLabel: "কারিকুলাম দেখুন",
        deadlineISO: w.deadlineISO,

        problemsTitle: "কেন এই ওয়ার্কশপটি আপনার প্রয়োজন?",
        problems: w.problems,
        problemsFootnote:
          "এই ওয়ার্কশপে আমরা ধাপে ধাপে এই সমস্যাগুলোর সমাধান করবো যাতে আপনি AI ব্যবহার করে নিজের কাজ দ্রুত, স্মার্ট এবং প্রফেশনালভাবে শেষ করতে পারেন।",

        learningsTitle: "এই ওয়ার্কশপ থেকে যা যা শিখবেন",
        learnings: w.learnings,

        curriculumTitle: "ওয়ার্কশপ কারিকুলাম",
        curriculumPill: "মোট {n} টি সেশন • {t} টি টপিক",
        curriculum: w.curriculum,

        mentorPill: "আপনার ইনস্ট্রাক্টর",
        mentorName: "Md. Rakibul Islam",
        mentorRole: "Founder, AI Sorix",
        mentorBio:
          "AI এবং টেকনোলজি নিয়ে কাজ করার দীর্ঘ অভিজ্ঞতা থেকে তিনি এই ওয়ার্কশপটি এমনভাবে সাজিয়েছেন যেনো যে কেউ খুব সহজেই AI শিখে নিজের কাজকে দ্রুত এবং প্রোডাক্টিভ করে তুলতে পারেন।",
        mentorImageUrl: founderAsset.url,

        faqsTitle: "সচরাচর জিজ্ঞাসিত প্রশ্ন",
        faqs: w.faqs,

        enrollTitle: "এখনই রেজিস্ট্রেশন করুন",
        enrollSubtitle:
          "সীমিত সিট, সীমিত সময়। আজই রেজিস্ট্রেশন করে নিজের জায়গা নিশ্চিত করুন।",
        enrollPerks: w.perks,
        price: w.price,
        oldPrice: w.oldPrice,
        discountLabel: w.oldPrice ? "৫৩% ছাড়" : undefined,
        enrollCtaLabel: "রেজিস্ট্রেশন করুন",

        contactSubjectPrefix: `Workshop Booking: ${w.title}`,
        contactModalTitle: `সিট বুকিং · ${w.title}`,

        enrollKind: "workshop",
        enrollSlug: w.slug,
        enrollPriceBdt: dbItem ? Number(dbItem.price_bdt) : undefined,
        enrollItemTitle: dbItem?.title || w.title,
        enrollSeatsAvailable: seatsLeft,
      }}
    />
  );
}
