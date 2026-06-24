import React, { useState, useEffect, useRef } from 'react';
import { Camera, ChevronDown, User, Check, LogOut, Trash2, Loader2, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useChatStore } from '@/stores/chatStore';
import DeleteAccountModal from '@/components/shared/DeleteAccountModal';

const COUNTRY_CODES = [
  { code: '+880', country: 'BD', flag: '🇧🇩' },
  { code: '+1', country: 'US', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+61', country: 'AU', flag: '🇦🇺' },
  { code: '+81', country: 'JP', flag: '🇯🇵' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+86', country: 'CN', flag: '🇨🇳' },
  { code: '+971', country: 'AE', flag: '🇦🇪' },
];

const ProfileTab = () => {
  const { user, signOut, session } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { language } = useChatStore();
  const bn = language === 'bn';

  const [fullName, setFullName] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [countryOpen, setCountryOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  const email = user?.email || '';
  const googleAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

  // Load profile
  useEffect(() => {
    if (!user) return;
    const loadProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('full_name, avatar_url, phone, country_code, bio')
        .eq('user_id', user.id)
        .maybeSingle();
      if (data) {
        setFullName(data.full_name || user.user_metadata?.full_name || '');
        setAvatarUrl(data.avatar_url || null);
        setPhone(data.phone || '');
        setCountryCode(data.country_code || '+1');
        setBio((data as any).bio || '');
      } else {
        setFullName(user.user_metadata?.full_name || '');
      }
      setLoading(false);
    };
    loadProfile();
  }, [user]);

  const displayAvatar = avatarUrl || googleAvatar;

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (!file.type.startsWith('image/')) {
      toast.error(bn ? 'অনুগ্রহ করে একটি ছবি নির্বাচন করুন' : 'Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(bn ? 'ছবি ৫MB এর কম হতে হবে' : 'Image must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${user.id}/avatar.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('profile-avatars')
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-avatars')
        .getPublicUrl(path);
      
      const url = `${publicUrl}?t=${Date.now()}`;
      setAvatarUrl(url);
      
      await supabase.from('profiles').update({ avatar_url: url }).eq('user_id', user.id);
      const store = useChatStore.getState();
      store.setUser({ ...store.user, avatar: url });
      toast.success(bn ? 'প্রোফাইল ছবি আপডেট হয়েছে' : 'Profile picture updated');
    } catch (err: any) {
      toast.error(err.message || (bn ? 'আপলোড ব্যর্থ হয়েছে' : 'Failed to upload'));
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName, phone, country_code: countryCode, bio } as any)
        .eq('user_id', user.id);
      if (error) throw error;
      setHasChanges(false);
      const store = useChatStore.getState();
      store.setUser({ ...store.user, name: fullName || store.user.name });
      toast.success(bn ? 'প্রোফাইল আপডেট হয়েছে' : 'Profile updated successfully');
    } catch (err: any) {
      toast.error(err.message || (bn ? 'প্রোফাইল আপডেট ব্যর্থ' : 'Failed to update profile'));
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };


  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    setHasChanges(true);
  };

  const selectedCountry = COUNTRY_CODES.find(c => c.code === countryCode);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />

      <div className="mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-bold">{bn ? 'প্রোফাইল তথ্য' : 'Profile Information'}</h3>
        <p className="text-xs sm:text-sm mt-1 text-muted-foreground">{bn ? 'আপনার মৌলিক প্রোফাইল বিবরণ পরিচালনা করুন' : 'Manage your basic profile details'}</p>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 sm:pr-2 space-y-4 sm:space-y-5">
        {/* Profile Picture */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center bg-gradient-to-br from-primary to-accent overflow-hidden">
              {displayAvatar ? (
                <img src={displayAvatar} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <User className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground" />
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className={cn(
                'absolute -bottom-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center',
                'bg-card border-2 border-background',
                'hover:bg-accent transition-all duration-200'
              )}
            >
              {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Camera className="w-3 h-3 sm:w-4 sm:h-4" />}
            </button>
          </div>
          <div>
            <p className="font-medium text-sm sm:text-base">{bn ? 'প্রোফাইল ছবি' : 'Profile picture'}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">{bn ? 'নতুন ছবি আপলোড করতে ক্লিক করুন' : 'Click to upload a new photo'}</p>
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">{bn ? 'পুরো নাম' : 'Full name'}</label>
          <input
            type="text"
            value={fullName}
            onChange={handleInputChange(setFullName)}
            className={cn(
              'w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-200 text-sm sm:text-base',
              'bg-muted border border-border',
              'placeholder:text-muted-foreground',
              'focus:outline-none focus:border-primary/50 focus:shadow-glow'
            )}
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">{bn ? 'ফোন' : 'Phone'}</label>
          <div className="flex gap-2">
            <div className="relative">
              <button
                onClick={() => setCountryOpen(!countryOpen)}
                className={cn(
                  'flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-200',
                  'bg-muted border border-border',
                  'hover:border-primary/50'
                )}
              >
                <span className="text-base sm:text-lg">{selectedCountry?.flag}</span>
                <span className="text-sm sm:text-base">{selectedCountry?.code}</span>
                <ChevronDown className={cn('w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 text-muted-foreground', countryOpen && 'rotate-180')} />
              </button>
              {countryOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setCountryOpen(false)} />
                  <div className={cn('absolute top-full left-0 mt-2 rounded-lg sm:rounded-xl shadow-xl z-20 overflow-hidden min-w-[120px] sm:min-w-[140px] max-h-48 overflow-y-auto', 'bg-popover border border-border backdrop-blur-xl')}>
                    {COUNTRY_CODES.map((country) => (
                      <button
                        key={country.code}
                        onClick={() => { setCountryCode(country.code); setCountryOpen(false); setHasChanges(true); }}
                        className={cn(
                          'w-full flex items-center gap-2 px-2.5 sm:px-3 py-2 sm:py-2.5 text-left transition-all duration-200 text-sm sm:text-base',
                          countryCode === country.code ? 'bg-primary/10' : 'hover:bg-accent'
                        )}
                      >
                        <span className="text-base sm:text-lg">{country.flag}</span>
                        <span className="flex-1">{country.code}</span>
                        {countryCode === country.code && <Check className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <input
              type="tel"
              value={phone}
              onChange={handleInputChange(setPhone)}
              placeholder="e.g. 555-123-4567"
              className={cn(
                'flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-200 text-sm sm:text-base',
                'bg-muted border border-border',
                'placeholder:text-muted-foreground',
                'focus:outline-none focus:border-primary/50 focus:shadow-glow'
              )}
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            {bn ? 'বায়ো' : 'Bio'}
          </label>
          <textarea
            value={bio}
            onChange={(e) => { setBio(e.target.value); setHasChanges(true); }}
            maxLength={300}
            rows={3}
            placeholder={bn ? 'নিজের সম্পর্কে কিছু লিখুন…' : 'Tell us a bit about yourself…'}
            className={cn(
              'w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-200 text-sm sm:text-base resize-none',
              'bg-muted border border-border placeholder:text-muted-foreground',
              'focus:outline-none focus:border-primary/50 focus:shadow-glow'
            )}
          />
          <p className="text-[10px] sm:text-xs mt-1 text-muted-foreground">{bio.length}/300</p>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">{bn ? 'ইমেইল' : 'Email'}</label>
          <input
            type="email"
            value={email}
            disabled
            className={cn('w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl cursor-not-allowed text-sm sm:text-base', 'bg-muted/50 border border-border text-muted-foreground')}
          />
          <p className="text-[10px] sm:text-xs mt-1 text-muted-foreground">{bn ? 'ইমেইল পরিবর্তন করা যাবে না' : 'Email cannot be changed'}</p>
        </div>

        {/* Sign Out */}
        <div className="pt-2">
          <button onClick={handleSignOut} className={cn('w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium text-sm sm:text-base transition-all duration-200', 'bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20')}>
            <LogOut className="w-4 h-4" />
            {bn ? 'সাইন আউট' : 'Sign Out'}
          </button>
        </div>

        {/* Delete Account */}
        <div>
          <button onClick={() => setShowDeleteDialog(true)} className={cn('w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium text-sm sm:text-base transition-all duration-200', 'bg-destructive text-destructive-foreground hover:bg-destructive/90')}>
            <Trash2 className="w-4 h-4" />
            {bn ? 'অ্যাকাউন্ট মুছুন' : 'Delete Account'}
          </button>
          <p className="text-[10px] sm:text-xs mt-1 text-muted-foreground text-center">
            {bn ? '৩০ দিন পর্যন্ত পুনরুদ্ধারযোগ্য, তারপর স্থায়ীভাবে মুছে যাবে' : 'Recoverable for 30 days, then permanently deleted'}
          </p>
        </div>
      </div>


      {/* Update Button */}
      <div className="pt-4 sm:pt-6 mt-auto">
        <button
          onClick={handleUpdateProfile}
          disabled={saving || !hasChanges}
          className={cn(
            'w-full py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium text-sm sm:text-base transition-all duration-200',
            hasChanges
              ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-glow'
              : 'bg-primary/50 text-primary-foreground/50 cursor-not-allowed'
          )}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (bn ? 'প্রোফাইল আপডেট করুন' : 'Update Profile')}
        </button>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{bn ? 'অ্যাকাউন্ট মুছুন' : 'Delete Account'}</AlertDialogTitle>
            <AlertDialogDescription>
              {bn ? 'এটি আপনার অ্যাকাউন্ট, সমস্ত ডেটা, প্রকল্প এবং সাবস্ক্রিপশন স্থায়ীভাবে মুছে ফেলবে। এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।' : 'This will permanently delete your account, all your data, projects, and subscription. This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>{bn ? 'বাতিল' : 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAccount} disabled={deleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {bn ? 'চিরতরে মুছুন' : 'Delete Forever'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProfileTab;
