import { Phone, MessageCircle, MapPin, Facebook, Youtube, Headphones } from "lucide-react";
import { useScholarsLang } from "@/contexts/ScholarsI18nContext";

export default function ScholarsContactCTA() {
  const { t } = useScholarsLang();

  return (
    <section className="bg-background py-14 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden rounded-3xl p-6 sm:p-10 lg:p-12 text-white"
          style={{
            background: "linear-gradient(135deg, #0B1437 0%, #060B22 100%)",
          }}
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
                  "প্ল্যাটফর্ম, কোর্স বা পেমেন্ট সংক্রান্ত বিস্তারিত জানতে আমাদের সাপোর্ট টিমের সাথে সরাসরি কথা বলতে পারেন।",
                  "Talk to our support team directly about the platform, courses or payment questions."
                )}
              </p>
              <a
                href="https://wa.me/8801933554982"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-primary text-primary-foreground text-sm sm:text-base font-semibold shadow-lg shadow-primary/30 hover:opacity-90 transition-opacity"
              >
                <MessageCircle className="w-4 h-4" />
                {t("হোয়াটসঅ্যাপে মেসেজ", "Message on WhatsApp")}
              </a>
            </div>

            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                  <span className="w-11 h-11 rounded-xl bg-primary/15 grid place-items-center mb-4">
                    <Phone className="w-5 h-5 text-primary" />
                  </span>
                  <div className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                    {t("হটলাইন", "Hotline")}
                  </div>
                  <a href="tel:+8801933554982" className="block mt-1 text-sm sm:text-base font-bold text-white">
                    +880 1933-554982
                  </a>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                  <div className="flex gap-2 mb-4">
                    <span className="w-11 h-11 rounded-xl bg-primary/15 grid place-items-center">
                      <Facebook className="w-5 h-5 text-primary" />
                    </span>
                    <span className="w-11 h-11 rounded-xl bg-primary/15 grid place-items-center">
                      <Youtube className="w-5 h-5 text-primary" />
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                    {t("সোশ্যাল মিডিয়া", "Social media")}
                  </div>
                  <div className="mt-1 flex gap-3 text-xs sm:text-sm font-semibold text-white">
                    <a href="#" className="hover:text-primary">Facebook</a>
                    <a href="#" className="hover:text-primary">YouTube</a>
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
                    {t(
                      "১ম তলা, এ-১, ডমিন্যান্ট বিল্ডিংস, হাউজ ৩০/৩২, রোড ৫, সেক্টর ১, ব্লক ই, আফতাবনগর, ঢাকা।",
                      "1st Floor, A-1, Dominant Buildings, House 30/32, Road 5, Sector 1, Block E, Aftabnagar, Dhaka."
                    )}
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
