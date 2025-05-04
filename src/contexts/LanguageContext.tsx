
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";

// Définir les langues disponibles
export type Language = "fr" | "en" | "ar";

// Interface pour le contexte de langue
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: Record<string, string>;
  t: (key: string) => string;
}

// Traductions de base (nous allons les étendre plus tard)
const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Général
    "app.name": "DocuBox",
    "app.logout": "Se déconnecter",
    
    // Navigation
    "nav.home": "Accueil",
    "nav.documents": "Documents",
    "nav.add": "Ajouter",
    "nav.settings": "Paramètres",
    
    // Paramètres
    "settings.title": "Paramètres",
    "settings.profile": "Profil",
    "settings.profile.desc": "Gérer vos informations personnelles",
    "settings.email": "Email",
    "settings.password": "Mot de passe",
    "settings.password.lastModified": "Dernière modification il y a 2 mois",
    "settings.edit": "Modifier",
    
    "settings.notifications": "Notifications",
    "settings.notifications.desc": "Gérer vos préférences de notification",
    "settings.notifications.expiring": "Documents expirants",
    "settings.notifications.expiring.desc": "Notifications pour documents qui expirent",
    "settings.notifications.timing": "Timing des alertes",
    "settings.notifications.timing.desc": "30 jours, 7 jours et jour d'expiration",
    "settings.notifications.configure": "Configurer",
    
    "settings.security": "Sécurité",
    "settings.security.desc": "Paramètres de sécurité de votre compte",
    "settings.security.pin": "Verrouillage par code PIN",
    "settings.security.pin.desc": "Protéger l'accès à l'application",
    "settings.security.biometric": "Authentification biométrique",
    "settings.security.biometric.desc": "Déverrouillage par empreinte digitale",
    
    "settings.language": "Langue",
    "settings.language.desc": "Changer la langue de l'application",
    "settings.language.fr": "Français",
    "settings.language.en": "Anglais",
    "settings.language.ar": "Arabe",
    
    "settings.logout": "Déconnexion",
    "settings.logout.success": "Déconnexion réussie",
    "settings.logout.message": "À bientôt !",
  },
  en: {
    // General
    "app.name": "DocuBox",
    "app.logout": "Log out",
    
    // Navigation
    "nav.home": "Home",
    "nav.documents": "Documents",
    "nav.add": "Add",
    "nav.settings": "Settings",
    
    // Settings
    "settings.title": "Settings",
    "settings.profile": "Profile",
    "settings.profile.desc": "Manage your personal information",
    "settings.email": "Email",
    "settings.password": "Password",
    "settings.password.lastModified": "Last modified 2 months ago",
    "settings.edit": "Edit",
    
    "settings.notifications": "Notifications",
    "settings.notifications.desc": "Manage your notification preferences",
    "settings.notifications.expiring": "Expiring documents",
    "settings.notifications.expiring.desc": "Notifications for expiring documents",
    "settings.notifications.timing": "Alert timing",
    "settings.notifications.timing.desc": "30 days, 7 days and expiration day",
    "settings.notifications.configure": "Configure",
    
    "settings.security": "Security",
    "settings.security.desc": "Security settings for your account",
    "settings.security.pin": "PIN lock",
    "settings.security.pin.desc": "Protect access to the application",
    "settings.security.biometric": "Biometric authentication",
    "settings.security.biometric.desc": "Unlock with fingerprint",
    
    "settings.language": "Language",
    "settings.language.desc": "Change application language",
    "settings.language.fr": "French",
    "settings.language.en": "English",
    "settings.language.ar": "Arabic",
    
    "settings.logout": "Log out",
    "settings.logout.success": "Successfully logged out",
    "settings.logout.message": "See you soon!",
  },
  ar: {
    // General
    "app.name": "دوكوبوكس",
    "app.logout": "تسجيل الخروج",
    
    // Navigation
    "nav.home": "الرئيسية",
    "nav.documents": "المستندات",
    "nav.add": "إضافة",
    "nav.settings": "الإعدادات",
    
    // Settings
    "settings.title": "الإعدادات",
    "settings.profile": "الملف الشخصي",
    "settings.profile.desc": "إدارة معلوماتك الشخصية",
    "settings.email": "البريد الإلكتروني",
    "settings.password": "كلمة المرور",
    "settings.password.lastModified": "آخر تعديل منذ شهرين",
    "settings.edit": "تعديل",
    
    "settings.notifications": "الإشعارات",
    "settings.notifications.desc": "إدارة تفضيلات الإشعارات",
    "settings.notifications.expiring": "المستندات منتهية الصلاحية",
    "settings.notifications.expiring.desc": "إشعارات للمستندات التي ستنتهي صلاحيتها",
    "settings.notifications.timing": "توقيت التنبيهات",
    "settings.notifications.timing.desc": "30 يوم، 7 أيام ويوم انتهاء الصلاحية",
    "settings.notifications.configure": "تكوين",
    
    "settings.security": "الأمان",
    "settings.security.desc": "إعدادات الأمان لحسابك",
    "settings.security.pin": "قفل رمز PIN",
    "settings.security.pin.desc": "حماية الوصول إلى التطبيق",
    "settings.security.biometric": "المصادقة البيومترية",
    "settings.security.biometric.desc": "فتح القفل ببصمة الإصبع",
    
    "settings.language": "اللغة",
    "settings.language.desc": "تغيير لغة التطبيق",
    "settings.language.fr": "الفرنسية",
    "settings.language.en": "الإنجليزية",
    "settings.language.ar": "العربية",
    
    "settings.logout": "تسجيل الخروج",
    "settings.logout.success": "تم تسجيل الخروج بنجاح",
    "settings.logout.message": "إلى اللقاء!",
  },
};

// Créer le contexte
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider component
export function LanguageProvider({ children }: { children: ReactNode }) {
  // Récupérer la langue du localStorage ou utiliser 'fr' par défaut
  const [language, setLanguage] = useState<Language>(() => {
    const storedLang = localStorage.getItem("language") as Language;
    return storedLang && ["fr", "en", "ar"].includes(storedLang) ? storedLang : "fr";
  });

  // Mettre à jour localStorage quand la langue change
  useEffect(() => {
    localStorage.setItem("language", language);
    // Si la langue est l'arabe, ajouter une classe RTL au body
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  // Fonction de traduction
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const value = {
    language,
    setLanguage,
    translations: translations[language],
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook pour utiliser le contexte
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
