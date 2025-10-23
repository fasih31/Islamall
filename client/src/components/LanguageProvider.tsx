import { createContext, useContext, useEffect, useState } from "react";

export type Language = "en" | "ar" | "ur";

type LanguageProviderProps = {
  children: React.ReactNode;
  defaultLanguage?: Language;
};

type LanguageProviderState = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

const translations = {
  en: {
    home: "Home",
    quran: "Quran",
    hadith: "Hadith",
    books: "Books",
    knowledge_hub: "Knowledge Hub",
    prayer_times: "Prayer Times",
    zakat: "Zakat Calculator",
    calendar: "Islamic Calendar",
    habits: "Habit Tracker",
    duas: "Duas & Supplications",
    dua_recommendations: "Dua Recommendations",
    culture_brotherhood: "Culture & Brotherhood",
    events: "Events",
    community: "Community",
    dashboard: "Dashboard",
    search: "Search",
    learn: "Learn",
    tools: "Tools",
    welcome: "Welcome to Islamic Compass",
    explore: "Explore authentic Islamic knowledge",
  },
  ar: {
    home: "الرئيسية",
    quran: "القرآن",
    hadith: "الحديث",
    books: "الكتب",
    knowledge_hub: "مركز المعرفة",
    prayer_times: "أوقات الصلاة",
    zakat: "حاسبة الزكاة",
    calendar: "التقويم الإسلامي",
    habits: "متتبع العادات",
    duas: "الأدعية",
    dua_recommendations: "توصيات الأدعية",
    culture_brotherhood: "الثقافة والأخوة",
    events: "الفعاليات",
    community: "المجتمع",
    dashboard: "لوحة التحكم",
    search: "بحث",
    learn: "تعلم",
    tools: "أدوات",
    welcome: "مرحباً بك في البوصلة الإسلامية",
    explore: "استكشف المعرفة الإسلامية الأصيلة",
  },
  ur: {
    home: "صفحہ اول",
    quran: "قرآن",
    hadith: "حدیث",
    books: "کتب",
    knowledge_hub: "علمی مرکز",
    prayer_times: "نماز کے اوقات",
    zakat: "زکوٰۃ کیلکولیٹر",
    calendar: "اسلامی کیلنڈر",
    habits: "عادات ٹریکر",
    duas: "دعائیں",
    dua_recommendations: "دعا کی سفارشات",
    culture_brotherhood: "ثقافت اور بھائی چارہ",
    events: "تقریبات",
    community: "کمیونٹی",
    dashboard: "ڈیش بورڈ",
    search: "تلاش",
    learn: "سیکھیں",
    tools: "ٹولز",
    welcome: "اسلامی کمپاس میں خوش آمدید",
    explore: "مستند اسلامی علم دریافت کریں",
  },
};

const LanguageProviderContext = createContext<LanguageProviderState | undefined>(
  undefined
);

export function LanguageProvider({
  children,
  defaultLanguage = "en",
}: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(
    () => (localStorage.getItem("language") as Language) || defaultLanguage
  );

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all language classes
    root.classList.remove("lang-en", "lang-ar", "lang-ur");
    
    // Add current language class
    root.classList.add(`lang-${language}`);
    
    // Set direction for RTL languages
    root.dir = language === "ar" || language === "ur" ? "rtl" : "ltr";
    
    // Store preference
    localStorage.setItem("language", language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageProviderContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageProviderContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageProviderContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
