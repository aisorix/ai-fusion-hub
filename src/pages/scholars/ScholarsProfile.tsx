import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Save, KeyRound, Mail, Phone, User as UserIcon, FileText, Trash2 } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useScholarsLang } from "@/contexts/ScholarsI18nContext";
import { toast } from "sonner";
import DeleteAccountModal from "@/components/shared/DeleteAccountModal";

export default function ScholarsProfile() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useScholarsLang();
  const nav = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      nav("/login?redirect=/sorixscholars/profile");
      return;
    }
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, phone, country_code, avatar_url, bio")
        .eq("user_id", user.id)
        .single();
      if (data) {
        setFullName(data.full_name || "");
        setPhone(data.phone || "");
        setCountryCode(data.country_code || "+1");
        setAvatarUrl(data.avatar_url || null);
        setBio((data as any).bio || "");
      }
      setEmail(user.email || "");
      setNewEmail(user.email || "");
      setLoading(false);
    })();
  }, [user, authLoading, nav]);

  const uploadAvatar = async (file: File) => {
    if (!user) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("ছবি ৫MB এর কম হতে হবে", "Image must be under 5MB"));
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${user.id}/avatar-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("profile-avatars").upload(path, file, { upsert: true });
    if (error) {
      toast.error(error.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("profile-avatars").getPublicUrl(path);
    setAvatarUrl(data.publicUrl);
    await supabase.from("profiles").update({ avatar_url: data.publicUrl }).eq("user_id", user.id);
    toast.success(t("প্রোফাইল ছবি আপডেট হয়েছে", "Profile photo updated"));
    setUploading(false);
  };

  const saveProfile = async () => {
    if (!user) return;
    if (!fullName.trim()) {
      toast.error(t("নাম খালি রাখা যাবে না", "Name is required"));
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim(),
        phone: phone.trim() || null,
        country_code: countryCode,
        bio: bio.trim() || null,
      } as any)
      .eq("user_id", user.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success(t("সফলভাবে সংরক্ষিত", "Profile saved"));
  };

  const updateEmail = async () => {
    if (!newEmail || newEmail === email) return;
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) toast.error(error.message);
    else toast.success(t("ইমেইলে কনফার্ম লিংক পাঠানো হয়েছে", "Confirmation link sent to new email"));
  };

  const updatePassword = async () => {
    if (newPassword.length < 8) {
      toast.error(t("পাসওয়ার্ড কমপক্ষে ৮ অক্ষর", "Password must be at least 8 characters"));
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) toast.error(error.message);
    else {
      toast.success(t("পাসওয়ার্ড আপডেট হয়েছে", "Password updated"));
      setNewPassword("");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="py-32 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const initials = (fullName || email || "U").split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();

  return (
    <>
      <SEOHead title="My Profile — Sorix Scholars" description="Edit your Sorix Scholars profile, avatar, contact and password." path="/sorixscholars/profile" />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
          {t("আমার প্রোফাইল", "My Profile")}
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          {t("নাম, ছবি, ফোন ও পাসওয়ার্ড পরিবর্তন করুন।", "Update your name, photo, phone and password.")}
        </p>

        {/* Avatar */}
        <div className="rounded-2xl border border-border bg-card p-6 mb-5">
          <div className="flex items-center gap-5">
            <div className="relative">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="w-20 h-20 rounded-full object-cover" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-cyan-500 grid place-items-center text-primary-foreground text-2xl font-bold">
                  {initials}
                </div>
              )}
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-foreground text-background grid place-items-center hover:opacity-90 disabled:opacity-50"
                aria-label="Change avatar"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => e.target.files?.[0] && uploadAvatar(e.target.files[0])}
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{fullName || email}</p>
              <p className="text-xs text-muted-foreground">{email}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-5 mb-5">
          <Field label={t("পুরো নাম", "Full name")} icon={UserIcon}>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              maxLength={120}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </Field>

          <Field label={t("ফোন নম্বর", "Phone")} icon={Phone}>
            <div className="flex gap-2">
              <input
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                maxLength={5}
                className="w-20 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={20}
                className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </Field>

          <Field label={t("বায়ো", "Bio")} icon={FileText}>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={300}
              rows={3}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
          </Field>

          <button
            onClick={saveProfile}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-foreground text-background text-sm font-semibold hover:opacity-90 disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? t("সংরক্ষণ হচ্ছে…", "Saving…") : t("সংরক্ষণ", "Save")}
          </button>
        </div>

        {/* Email change */}
        <div className="rounded-2xl border border-border bg-card p-6 mb-5">
          <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <Mail className="w-4 h-4" /> {t("ইমেইল পরিবর্তন", "Change email")}
          </h2>
          <div className="flex gap-2">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              onClick={updateEmail}
              className="px-4 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-muted/40"
            >
              {t("আপডেট", "Update")}
            </button>
          </div>
        </div>

        {/* Password */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <KeyRound className="w-4 h-4" /> {t("পাসওয়ার্ড পরিবর্তন", "Change password")}
          </h2>
          <div className="flex gap-2">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={t("নতুন পাসওয়ার্ড", "New password")}
              className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              onClick={updatePassword}
              className="px-4 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-muted/40"
            >
              {t("আপডেট", "Update")}
            </button>
          </div>
        </div>

        {/* Danger zone */}
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 mt-5">
          <h2 className="text-sm font-bold text-destructive mb-1 flex items-center gap-2">
            <Trash2 className="w-4 h-4" /> {t("অ্যাকাউন্ট মুছুন", "Delete account")}
          </h2>
          <p className="text-xs text-muted-foreground mb-3">
            {t(
              "অ্যাকাউন্ট মুছলে ৩০ দিন পর্যন্ত পুনরুদ্ধারযোগ্য থাকবে; এরপর সব ডেটা স্থায়ীভাবে মুছে যাবে।",
              "When you delete your account it stays recoverable for 30 days, then everything is permanently removed."
            )}
          </p>
          <button
            onClick={() => setShowDelete(true)}
            className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-semibold hover:opacity-90"
          >
            {t("অ্যাকাউন্ট মুছুন", "Delete my account")}
          </button>
        </div>
      </section>

      <DeleteAccountModal open={showDelete} onClose={() => setShowDelete(false)} bn />
    </>
  );
}


function Field({ label, icon: Icon, children }: { label: string; icon: any; children: React.ReactNode }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-1.5">
        <Icon className="w-3.5 h-3.5" /> {label}
      </label>
      {children}
    </div>
  );
}
