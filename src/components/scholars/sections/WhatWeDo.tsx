import { Link } from "react-router-dom";
import { Users, BookOpen, Video, Book, ArrowRight } from "lucide-react";
import { useScholarsLang } from "@/contexts/ScholarsI18nContext";

export default function WhatWeDo() {
    const { t } = useScholarsLang();
    const items = [
        {
            icon: Users,
            num: t("", ""),
            title: t("১:১ AI মেন্টরশিপস", "1:1 AI Mentorships"),
            body: t(
                "টপ-নচ মেন্টরদের ওয়ান-টু-ওয়ান গাইডলাইনে আপনার ক্যারিয়ার ও বিজনেসকে AI-এর মাধ্যমে রকেট গতিতে এগিয়ে নিন!",
                "Rocket your career and business forward with AI through one-to-one guidelines from top-notch mentors!"
            ),
            href: "/sorixscholars/workshops",
        },
        {
            icon: BookOpen,
            num: t("", ""),
            title: t("অনলাইন কোর্সেস", "Online Courses"),
            body: t(
                "পেশাগত ব্যস্ততার সাথে সামঞ্জস্য রেখে আমাদের বিশেষায়িত কোর্সগুলো আপনাকে প্রদান করবে একটি সুবিন্যস্ত ও পরিপূর্ণ লার্নিং অভিজ্ঞতা।",
                "Aligning with professional schedules, our specialized courses provide a well-structured and complete learning experience."
            ),
            href: "/sorixscholars/courses",
        },
        {
            icon: Video,
            num: t("", ""),
            title: t("লাইভ ওয়ার্কশপস", "Live Workshops"),
            body: t(
                "১০০% প্র্যাক্টিক্যাল লাইভ ট্রেনিং! সরাসরি হাতে-কলমে ট্রেন্ডিং AI টুলস ব্যবহার শিখুন এবং নিজের ভ্যালু বাড়ান নিমেষেই।",
                "100% practical live training! Learn trending AI tools hands-on and instantly boost your market value."
            ),
            href: "/sorixscholars/workshops",
        },
        {
            icon: Book,
            num: t("", ""),
            title: t("ইবুক ও রিসোর্সেস", "eBooks & Resources"),
            body: t(
                "নিজেকে স্মার্টলি আপডেট রাখতে চান? প্রয়োজনীয় সব প্র্যাক্টিক্যাল AI রিসোর্স এখন ডিজিটাল ফরম্যাটে সরাসরি আপনার স্মার্টফোনেই!",
                "Want to update yourself smartly? All the necessary practical AI resources are now in digital format, directly on your smartphone!"
            ),
            href: "/sorixscholars/courses",
        },
    ];

    return (
        <section className="py-14 sm:py-20 lg:py-24" style={{ backgroundColor: "#FAF7EE" }}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
                    <h2
                        className="text-2xl sm:text-3xl lg:text-[44px] leading-tight font-bold"
                        style={{
                            fontFamily: "'Playfair Display', 'Noto Serif Bengali', Georgia, serif",
                            color: "#0F1B3D",
                        }}
                    >
                        {t("আমরা যা করি", "What we do")}
                    </h2>
                    <p className="mt-4 text-sm sm:text-base leading-relaxed" style={{ color: "#475569" }}>
                        {t(
                            "পার্সোনাল ও প্রফেশনাল লাইফে সফল হতে চান? আমাদের সর্বাধুনিক AI কোর্সগুলোর মাধ্যমে আপনার ক্যারিয়ারকে নিয়ে যান এক নতুন উচ্চতায়!",
                            "Want success in your personal and professional life? Elevate your career to new heights with our cutting-edge AI courses!"
                        )}
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                    {items.map((it) => (
                        <Link
                            key={it.title}
                            to={it.href}
                            className="relative overflow-hidden rounded-2xl bg-white border-l-4 p-5 sm:p-7 group hover:shadow-lg transition-shadow"
                            style={{ borderLeftColor: "#0F1B3D" }}
                        >
                            <span
                                aria-hidden
                                className="absolute right-3 bottom-1 text-[120px] sm:text-[140px] font-bold leading-none opacity-[0.05] select-none"
                                style={{ color: "#0F1B3D", fontFamily: "'Playfair Display', 'Noto Serif Bengali', serif" }}
                            >
                                {it.num}
                            </span>
                            <div className="relative flex items-center gap-3 mb-3">
                                <span
                                    className="w-10 h-10 rounded-xl grid place-items-center"
                                    style={{ backgroundColor: "#EEF2FF" }}
                                >
                                    <it.icon className="w-5 h-5" style={{ color: "#0F1B3D" }} />
                                </span>
                                <h3
                                    className="text-lg sm:text-xl font-bold"
                                    style={{ color: "#0F1B3D", fontFamily: "'Playfair Display', 'Noto Serif Bengali', serif" }}
                                >
                                    {it.title}
                                </h3>
                            </div>
                            <p className="relative text-sm leading-relaxed" style={{ color: "#475569" }}>
                                {it.body}
                            </p>
                            <span
                                className="relative inline-flex items-center gap-1 text-xs sm:text-sm font-semibold mt-4 group-hover:gap-2 transition-all"
                                style={{ color: "#0F1B3D" }}
                            >
                                {t("বিস্তারিত দেখুন", "Learn more")} <ArrowRight className="w-4 h-4" />
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
