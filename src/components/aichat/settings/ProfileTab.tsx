import React, { useState, useEffect, useRef } from 'react';
import { Camera, Save, KeyRound, Mail, Phone, User as UserIcon, FileText, Trash2, Loader2, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useChatStore } from '@/stores/chatStore';
import DeleteAccountModal from '@/components/shared/DeleteAccountModal';

const ProfileTab = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const { language } = useChatStore();
  const bn = language === 'bn';
  const t = (b: string, e: string) => (bn ? b : e);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [updatingEmail, setUpdatingEmail] = useState(false);
  const [updatingPwd, setUpdatingPwd] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const googleAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from('profiles')
        .select('full_name, phone, country_code, avatar_url, bio')
        .eq('user_id', user.id)
        .maybeSingle();
      if (data) {
        setFullName(data.full_name || user.user_metadata?.full_name || '');
        setPhone(data.phone || '');
        setCountryCode(data.country_code || '+1');
        setAvatarUrl(data.avatar_url || null);
        setBio((data as any).bio || '');
      } else {
        setFullName(user.user_metadata?.full_name || '');
      }
      setEmail(user.email || '');
      setNewEmail(user.email || '');
      setLoading(false);
    })();
  }, [user]);

  const uploadAvatar = async (file: File) => {
    if (!user) return;
    if (!file.type.startsWith('image/')) {
      toast.error(t('অনুগ্রহ করে একটি ছবি নির্বাচন করুন', 'Please select an image file'));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('ছবি ৫MB এর কম হতে হবে', 'Image must be under 5MB'));
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `${user.id}/avatar-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('profile-avatars').upload(path, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from('profile-avatars').getPublicUrl(path);
      const url = `${data.publicUrl}?t=${Date.now()}`;
      setAvatarUrl(url);
      await supabase.from('profiles').update({ avatar_url: url }).eq('user_id', user.id);
      const store = useChatStore.getState();
      store.setUser({ ...store.user, avatar: url });
      toast.success(t('প্রোফাইল ছবি আপডেট হয়েছে', 'Profile photo updated'));
    } catch (err: any) {
      toast.error(err.message || t('আপলোড ব্যর্থ হয়েছে', 'Upload failed'));
    } finally {
      setUploading(false);
    }
  };

  const saveProfile = async () => {
    if (!user) return;
    if (!fullName.trim()) {
      toast.error(t('নাম খালি রাখা যাবে না', 'Name is required'));
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName.trim(),
        phone: phone.trim() || null,
        country_code: countryCode,
        bio: bio.trim() || null,
      } as any)
      .eq('user_id', user.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else {
      const store = useChatStore.getState();
      store.setUser({ ...store.user, name: fullName.trim() });
      toast.success(t('সফলভাবে সংরক্ষিত', 'Profile saved'));
    }
  };

  const updateEmail = async () => {
    if (!newEmail || newEmail === email) return;
    setUpdatingEmail(true);
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    setUpdatingEmail(false);
    if (error) toast.error(error.message);
    else toast.success(t('ইমেইলে কনফার্ম লিংক পাঠানো হয়েছে', 'Confirmation link sent to new email'));
  };

  const updatePassword = async () => {
    if (newPassword.length < 8) {
      toast.error(t('পাসওয়ার্ড কমপক্ষে ৮ অক্ষর', 'Password must be at least 8 characters'));
      return;
    }
    setUpdatingPwd(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setUpdatingPwd(false);
    if (error) toast.error(error.message);
    else {
      toast.success(t('পাসওয়ার্ড আপডেট হয়েছে', 'Password updated'));
      setNewPassword('');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const displayAvatar = avatarUrl || googleAvatar;
  const initials = (fullName || email || 'U').split(' ').map((s) => s[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 sm:mb-5">
        <h3 className="text-lg sm:text-xl font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
          {t('আমার প্রোফাইল', 'My Profile')}
        </h3>
        <p className="text-xs sm:text-sm mt-1 text-muted-foreground">
          {t('নাম, ছবি, ফোন ও পাসওয়ার্ড পরিবর্তন করুন।', 'Update your name, photo, phone and password.')}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 sm:pr-2 space-y-4">
        {/* Avatar card */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              {displayAvatar ? (
                <img src={displayAvatar} alt="" className="w-16 h-16 rounded-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-cyan-500 grid place-items-center text-primary-foreground text-xl font-bold">
                  {initials}
                </div>
              )}
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-foreground text-background grid place-items-center hover:opacity-90 disabled:opacity-50"
                aria-label="Change avatar"
              >
                {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => e.target.files?.[0] && uploadAvatar(e.target.files[0])}
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{fullName || email}</p>
              <p className="text-xs text-muted-foreground truncate">{email}</p>
            </div>
          </div>
        </div>

        {/* Profile form */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <Field label={t('পুরো নাম', 'Full name')} icon={UserIcon}>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              maxLength={120}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </Field>

          <Field label={t('ফোন নম্বর', 'Phone')} icon={Phone}>
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

          <Field label={t('বায়ো', 'Bio')} icon={FileText}>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={300}
              rows={3}
              placeholder={t('নিজের সম্পর্কে কিছু লিখুন…', 'Tell us a bit about yourself…')}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
            <p className="text-[10px] mt-1 text-muted-foreground">{bio.length}/300</p>
          </Field>

          <button
            onClick={saveProfile}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-foreground text-background text-sm font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? t('সংরক্ষণ হচ্ছে…', 'Saving…') : t('সংরক্ষণ', 'Save')}
          </button>
        </div>

        {/* Email change */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <Mail className="w-4 h-4" /> {t('ইমেইল পরিবর্তন', 'Change email')}
          </h2>
          <div className="flex gap-2">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="flex-1 min-w-0 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              onClick={updateEmail}
              disabled={updatingEmail || newEmail === email}
              className="px-4 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-muted/40 disabled:opacity-50 shrink-0"
            >
              {updatingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : t('আপডেট', 'Update')}
            </button>
          </div>
        </div>

        {/* Password */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <KeyRound className="w-4 h-4" /> {t('পাসওয়ার্ড পরিবর্তন', 'Change password')}
          </h2>
          <div className="flex gap-2">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={t('নতুন পাসওয়ার্ড', 'New password')}
              className="flex-1 min-w-0 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              onClick={updatePassword}
              disabled={updatingPwd || !newPassword}
              className="px-4 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-muted/40 disabled:opacity-50 shrink-0"
            >
              {updatingPwd ? <Loader2 className="w-4 h-4 animate-spin" /> : t('আপডেট', 'Update')}
            </button>
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm bg-muted hover:bg-muted/70 border border-border"
        >
          <LogOut className="w-4 h-4" /> {t('সাইন আউট', 'Sign Out')}
        </button>

        {/* Danger zone */}
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5">
          <h2 className="text-sm font-bold text-destructive mb-1 flex items-center gap-2">
            <Trash2 className="w-4 h-4" /> {t('অ্যাকাউন্ট মুছুন', 'Delete account')}
          </h2>
          <p className="text-xs text-muted-foreground mb-3">
            {t(
              'অ্যাকাউন্ট মুছলে ৩০ দিন পর্যন্ত পুনরুদ্ধারযোগ্য থাকবে; এরপর সব ডেটা স্থায়ীভাবে মুছে যাবে।',
              'When you delete your account it stays recoverable for 30 days, then everything is permanently removed.'
            )}
          </p>
          <button
            onClick={() => setShowDelete(true)}
            className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-semibold hover:opacity-90"
          >
            {t('অ্যাকাউন্ট মুছুন', 'Delete my account')}
          </button>
        </div>
      </div>

      <DeleteAccountModal open={showDelete} onClose={() => setShowDelete(false)} bn={bn} />
    </div>
  );
};

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

export default ProfileTab;
