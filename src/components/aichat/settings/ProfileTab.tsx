import React, { useState } from 'react';
import { Camera, ChevronDown, User, Check, LogOut } from 'lucide-react';
import { useChatStore } from '@/stores/chatStore';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const COUNTRY_CODES = [
  { code: '+880', country: 'BD', flag: '🇧🇩' },
  { code: '+1', country: 'US', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
];

const ProfileTab = () => {
  const { user } = useChatStore();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  
  const [fullName, setFullName] = useState(user?.name || 'Sorix User');
  const [countryCode, setCountryCode] = useState('+1');
  const [phone, setPhone] = useState('555-123-4567');
  const [email] = useState(user?.email || 'user@sorix.ai');
  const [countryOpen, setCountryOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  const selectedCountry = COUNTRY_CODES.find(c => c.code === countryCode);
  
  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    setHasChanges(true);
  };
  
  const handleUpdateProfile = () => {
    setHasChanges(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };
  
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-bold">Profile Information</h3>
        <p className="text-xs sm:text-sm mt-1 text-muted-foreground">
          Manage your basic profile details
        </p>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto pr-1 sm:pr-2 space-y-4 sm:space-y-5">
        {/* Profile Picture */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center bg-gradient-to-br from-primary to-accent">
              <User className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground" />
            </div>
            <button className={cn(
              'absolute -bottom-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center',
              'bg-card border-2 border-background',
              'hover:bg-accent transition-all duration-200'
            )}>
              <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
          <div>
            <p className="font-medium text-sm sm:text-base">Profile picture</p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Click to upload a new photo
            </p>
          </div>
        </div>
        
        {/* Full Name */}
        <div>
          <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
            Full name
          </label>
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
          <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
            Phone
          </label>
          <div className="flex gap-2">
            {/* Country Code Selector */}
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
                <ChevronDown className={cn(
                  'w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 text-muted-foreground',
                  countryOpen && 'rotate-180'
                )} />
              </button>
              
              {countryOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setCountryOpen(false)}
                  />
                  <div className={cn(
                    'absolute top-full left-0 mt-2 rounded-lg sm:rounded-xl shadow-xl z-20 overflow-hidden min-w-[120px] sm:min-w-[140px]',
                    'bg-popover border border-border backdrop-blur-xl'
                  )}>
                    {COUNTRY_CODES.map((country) => (
                      <button
                        key={country.code}
                        onClick={() => {
                          setCountryCode(country.code);
                          setCountryOpen(false);
                          setHasChanges(true);
                        }}
                        className={cn(
                          'w-full flex items-center gap-2 px-2.5 sm:px-3 py-2 sm:py-2.5 text-left transition-all duration-200 text-sm sm:text-base',
                          countryCode === country.code
                            ? 'bg-primary/10'
                            : 'hover:bg-accent'
                        )}
                      >
                        <span className="text-base sm:text-lg">{country.flag}</span>
                        <span className="flex-1">{country.code}</span>
                        {countryCode === country.code && (
                          <Check className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            
            {/* Phone Number Input */}
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
        
        {/* Email */}
        <div>
          <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            disabled
            className={cn(
              'w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl cursor-not-allowed text-sm sm:text-base',
              'bg-muted/50 border border-border text-muted-foreground'
            )}
          />
          <p className="text-[10px] sm:text-xs mt-1 text-muted-foreground">
            Email cannot be changed
          </p>
        </div>

        {/* Logout Button */}
        <div className="pt-2">
          <button
            onClick={handleSignOut}
            className={cn(
              'w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium text-sm sm:text-base transition-all duration-200',
              'bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20'
            )}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
      
      {/* Update Button */}
      <div className="pt-4 sm:pt-6 mt-auto">
        <button
          onClick={handleUpdateProfile}
          className={cn(
            'w-full py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium text-sm sm:text-base transition-all duration-200',
            hasChanges
              ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-glow'
              : 'bg-primary text-primary-foreground hover:shadow-glow'
          )}
        >
          Update Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileTab;