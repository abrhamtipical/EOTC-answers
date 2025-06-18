
import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'am';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.teachings': 'Teachings',
    'nav.articles': 'Articles',
    'nav.faq': 'FAQ',
    'nav.ebooks': 'eBooks',
    'nav.contact': 'Contact',
    'nav.search': 'Search',
    'nav.bookmarks': 'Bookmarks',
    'nav.settings': 'Settings',
    'nav.auth': 'Sign In',
    'nav.admin': 'Admin',
    
    // Common
    'common.loading': 'Loading...',
    'common.search': 'Search',
    'common.read_more': 'Read More',
    'common.download': 'Download',
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    
    // Home page
    'home.title': 'Welcome to EOTC Answers',
    'home.subtitle': 'Explore the rich teachings and traditions of the Ethiopian Orthodox Tewahedo Church',
    'home.ask_ai': 'Ask Our AI Assistant',
    'home.ask_ai_desc': 'Have a question about Orthodox faith, traditions, or theology? Our AI assistant is here to help.',
    'home.teachings_title': 'Sacred Teachings',
    'home.faq_title': 'Frequently Asked',
    
    // Download section
    'download.title': 'Download Our App',
    'download.subtitle': 'Get the full EOTC Answers experience on your mobile device',
    'download.playstore': 'Get it on Google Play',
    'download.appstore': 'Download on App Store',
  },
  am: {
    // Navigation
    'nav.home': 'መነሻ',
    'nav.teachings': 'ትምህርቶች',
    'nav.articles': 'ጽሑፎች',
    'nav.faq': 'ጥያቄና መልስ',
    'nav.ebooks': 'መጽሐፍት',
    'nav.contact': 'አድራሻ',
    'nav.search': 'ፈልግ',
    'nav.bookmarks': 'ምልክቶች',
    'nav.settings': 'ቅንብሮች',
    'nav.auth': 'ግባ',
    'nav.admin': 'አስተዳዳሪ',
    
    // Common
    'common.loading': 'በመጫን ላይ...',
    'common.search': 'ፈልግ',
    'common.read_more': 'ተጨማሪ አንብብ',
    'common.download': 'አውርድ',
    'common.submit': 'ላክ',
    'common.cancel': 'ሰርዝ',
    'common.save': 'አስቀምጥ',
    'common.edit': 'አርም',
    'common.delete': 'ሰርዝ',
    'common.back': 'ተመለስ',
    'common.next': 'ቀጣይ',
    'common.previous': 'ቀዳሚ',
    
    // Home page
    'home.title': 'እንኳን ወደ ኢ.ኦ.ተ.ቤ መልሶች በደህና መጡ',
    'home.subtitle': 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያንን ሀብታም ትምህርቶች እና ወጎች ያግኙ',
    'home.ask_ai': 'የአርቲፊሻል ኢንተለጀንስ ረዳቶቻችንን ይጠይቁ',
    'home.ask_ai_desc': 'ስለ ኦርቶዶክስ እምነት፣ ወጎች ወይም መጽሐፍ ቅዱስ ጥያቄ አለዎት? የአርቲፊሻል ኢንተለጀንስ ረዳቶቻችን እርስዎን ለመርዳት እዚህ ይገኛሉ።',
    'home.teachings_title': 'ቅዱሳን ትምህርቶች',
    'home.faq_title': 'ተደጋጋሚ ጥያቄዎች',
    
    // Download section
    'download.title': 'መተግበሪያችንን ያውርዱ',
    'download.subtitle': 'በሞባይል መሳሪያዎ ላይ ሙሉውን የኢ.ኦ.ተ.ቤ መልሶች ተሞክሮ ያግኙ',
    'download.playstore': 'በጉግል ፕሌይ ያውርዱ',
    'download.appstore': 'በመተግበሪያ ስቶር ያውርዱ',
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string, fallback?: string) => {
    return translations[language][key] || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
