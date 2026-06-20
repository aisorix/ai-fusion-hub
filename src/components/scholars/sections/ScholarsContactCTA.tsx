import { Mail, MessageCircle, MapPin, Facebook, Instagram, Youtube, Twitter, Linkedin, Headphones, MessagesSquare } from "lucide-react";
import { useScholarsLang } from "@/contexts/ScholarsI18nContext";
import { openScholarsChat } from "../scholarsChatRef";

const socials = [
  { Icon: Facebook, href: "https://facebook.com/profile.php?id=61586687081259", label: "Facebook" },
  { Icon: Instagram, href: "https://instagram.com/aisorix_", label: "Instagram" },
  { Icon: Youtube, href: "https://youtube.com/@aisorix", label: "YouTube" },
  { Icon: Twitter, href: "https://twitter.com/aisorix_", label: "Twitter" },
  { Icon: Linkedin, href: "https://linkedin.com/company/aisorix", label: "LinkedIn" },
];

export default function ScholarsContactCTA() {
  const { t } = useScholarsLang();

  return (
    <section className="bg-background py-14 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden rounded-3xl p-6 sm:p-10 lg:p-12 text-white"
          style={{ background: "linear-gradient(135deg, #0B1437 0%, #060B22 100%)" }}
        >
          <div
            className="absolute inset-0 opacity-[0.08] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-white/90 mb-5">
                <Headphones className="w-3.5 h-3.5 text-primary" />
                {t("সাপোর্ট টিম", "Support team")}
              </span>
              <h2
                className="text-2xl sm:text-3xl lg:text-[40px] leading-tight font-bold"
                style={{ fontFamily: "'Playfair Display', 'Noto Serif Bengali', Georgia, serif" }}
              >
                {t("যেকোনো প্রয়োজনে", "For anything you need")}
                <br />
                <span style={{ color: "#60A5FA" }}>{t("যোগাযোগ করুন", "get in touch")}</span>
              </h2>
              <p className="mt-4 text-sm sm:text-base text-white/70 leading-relaxed max-w-md">
                {t(
                  "প্ল্যাটফর্ম, কোর্স বা পেমেন্ট সংক্রান্ত বিস্তারিত জানতে আমাদের সাপোর্ট টিমের সাথে সরাসরি কথা বলুন — ইমেইল, লাইভ চ্যাট বা হোয়াটসঅ্যাপে।",
                  "Talk to our support team directly about the platform, courses, or payment — over email, live chat, or WhatsApp."
                )}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={openScholarsChat}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/30 hover:opacity-90 transition-opacity"
                >
                  <MessagesSquare className="w-4 h-4" />
                  {t("লাইভ চ্যাট শুরু করুন", "Start live chat")}
                </button>
                <a
                  href="https://wa.me/8801933554982"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  {t("হোয়াটসঅ্যাপ", "WhatsApp")}
                </a>
                <a
                  href="mailto:support@aisorix.com"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white text-sm font-semibold border border-white/15 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  {t("ইমেইল", "Email")}
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <a
                  href="mailto:support@aisorix.com"
                  className="rounded-2xl bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition-colors block"
                >
                  <span className="w-11 h-11 rounded-xl bg-primary/15 grid place-items-center mb-4">
                    <Mail className="w-5 h-5 text-primary" />
                  </span>
                  <div className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                    {t("ইমেইল সাপোর্ট", "Email support")}
                  </div>
                  <div className="block mt-1 text-sm sm:text-base font-bold text-white break-all">
                    support@aisorix.com
                  </div>
                </a>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                  <span className="w-11 h-11 rounded-xl bg-primary/15 grid place-items-center mb-4">
                    <Facebook className="w-5 h-5 text-primary" />
                  </span>
                  <div className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                    {t("সোশ্যাল মিডিয়া", "Social media")}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {socials.map(({ Icon, href, label }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={label}
                        className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 grid place-items-center text-white/90 hover:text-white transition-colors"
                      >
                        <Icon className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white/5 border border-white/10 p-5 flex gap-4">
                <span className="w-11 h-11 rounded-xl bg-primary/15 grid place-items-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </span>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                    {t("অফিস ঠিকানা", "Office address")}
                  </div>
                  <p className="mt-1 text-xs sm:text-sm text-white/90 leading-relaxed">
                    {t("উত্তরা, ঢাকা ১২৩০, বাংলাদেশ", "Uttara, Dhaka 1230, Bangladesh")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
