// Internationalization translations for the chat interface
// Supports English and Bengali

export const translations = {
  en: {
    // Common
    newChat: 'New Chat',
    searchChats: 'Search chats',
    multiWindowChat: 'Multi-Window Chat',
    settings: 'Settings',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    
    // Sidebar
    today: 'Today',
    yesterday: 'Yesterday',
    thisWeek: 'This Week',
    older: 'Older',
    projects: 'Projects',
    tools: 'Tools',
    
    // Chat
    typeMessage: 'Type a message...',
    send: 'Send',
    stop: 'Stop',
    regenerate: 'Regenerate',
    copy: 'Copy',
    share: 'Share',
    
    // Models
    selectModel: 'Select Model',
    freeModels: 'Free Models',
    premiumModels: 'Premium Models',
    tokensUsed: 'Tokens Used',
    
    // Settings
    general: 'General',
    profile: 'Profile',
    plansTokens: 'Plans & Tokens',
    subscription: 'Subscription',
    paymentHistory: 'Payment History',
    reportBug: 'Report Bug',
    helpCenter: 'Help Center',
    terms: 'Terms of Use',
    
    // Auth
    signIn: 'Sign In',
    signOut: 'Sign Out',
    signUp: 'Sign Up',
    
    // Voice
    voiceMode: 'Voice Mode',
    listening: 'Listening...',
    speaking: 'Speaking...',
    
    // Health
    healthMode: 'Health Mode',
    healthAnalysis: 'Health Analysis',
    
    // Errors
    errorOccurred: 'An error occurred',
    tryAgain: 'Try again',
    networkError: 'Network error. Please check your connection.',
    
    // Empty state
    welcomeMessage: 'What would you like to explore today?',
    suggestCode: 'Write code',
    suggestExplain: 'Explain',
    suggestBrainstorm: 'Brainstorm',
    suggestCreate: 'Create',
  },
  
  bn: {
    // Common
    newChat: 'নতুন চ্যাট',
    searchChats: 'চ্যাট খুঁজুন',
    multiWindowChat: 'মাল্টি-উইন্ডো চ্যাট',
    settings: 'সেটিংস',
    lightMode: 'লাইট মোড',
    darkMode: 'ডার্ক মোড',
    
    // Sidebar
    today: 'আজ',
    yesterday: 'গতকাল',
    thisWeek: 'এই সপ্তাহ',
    older: 'পুরনো',
    projects: 'প্রকল্পসমূহ',
    tools: 'টুলস',
    
    // Chat
    typeMessage: 'মেসেজ লিখুন...',
    send: 'পাঠান',
    stop: 'থামুন',
    regenerate: 'পুনরায় তৈরি করুন',
    copy: 'কপি',
    share: 'শেয়ার',
    
    // Models
    selectModel: 'মডেল নির্বাচন করুন',
    freeModels: 'ফ্রি মডেল',
    premiumModels: 'প্রিমিয়াম মডেল',
    tokensUsed: 'টোকেন ব্যবহৃত',
    
    // Settings
    general: 'সাধারণ',
    profile: 'প্রোফাইল',
    plansTokens: 'প্ল্যান ও টোকেন',
    subscription: 'সাবস্ক্রিপশন',
    paymentHistory: 'পেমেন্ট ইতিহাস',
    reportBug: 'বাগ রিপোর্ট করুন',
    helpCenter: 'হেল্প সেন্টার',
    terms: 'ব্যবহারের শর্তাবলী',
    
    // Auth
    signIn: 'সাইন ইন',
    signOut: 'সাইন আউট',
    signUp: 'সাইন আপ',
    
    // Voice
    voiceMode: 'ভয়েস মোড',
    listening: 'শুনছি...',
    speaking: 'বলছি...',
    
    // Health
    healthMode: 'হেলথ মোড',
    healthAnalysis: 'স্বাস্থ্য বিশ্লেষণ',
    
    // Errors
    errorOccurred: 'একটি ত্রুটি ঘটেছে',
    tryAgain: 'আবার চেষ্টা করুন',
    networkError: 'নেটওয়ার্ক ত্রুটি। আপনার সংযোগ পরীক্ষা করুন।',
    
    // Empty state
    welcomeMessage: 'আজ কী অন্বেষণ করতে চান?',
    suggestCode: 'কোড লিখুন',
    suggestExplain: 'ব্যাখ্যা করুন',
    suggestBrainstorm: 'আইডিয়া',
    suggestCreate: 'তৈরি করুন',
  },
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;

export default translations;
