
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
    "app.tagline": "Gérez vos documents importants",
    "app.logout": "Se déconnecter",
    
    // Navigation
    "nav.home": "Accueil",
    "nav.documents": "Documents",
    "nav.add": "Ajouter",
    "nav.settings": "Paramètres",
    
    // Authentication
    "auth.email": "Email",
    "auth.emailPlaceholder": "Entrez votre email...",
    "auth.password": "Mot de passe",
    "auth.passwordPlaceholder": "Entrez votre mot de passe...",
    "auth.confirmPassword": "Confirmer le mot de passe",
    "auth.confirmPasswordPlaceholder": "Confirmez votre mot de passe...",
    "auth.fullName": "Nom complet",
    "auth.fullNamePlaceholder": "Entrez votre nom complet...",
    "auth.forgotPassword": "Mot de passe oublié ?",
    "auth.noAccount": "Vous n'avez pas de compte ?",
    "auth.haveAccount": "Vous avez déjà un compte ?",
    
    "auth.login.title": "Connexion",
    "auth.login.welcomeBack": "Bon retour !",
    "auth.login.accountAccess": "Accédez à votre compte",
    "auth.login.action": "CONNEXION",
    "auth.login.processing": "Connexion en cours...",
    "auth.login.success": "Connexion réussie",
    "auth.login.welcomeMessage": "Bienvenue sur DocuBox",
    
    "auth.register.title": "Inscription",
    "auth.register.action": "S'INSCRIRE",
    "auth.register.tagline": "Numérisez, stockez et recevez des rappels pour vos documents",
    "auth.register.secure": "Restez organisé. Restez en sécurité.",
    "auth.register.join": "Rejoignez-nous — votre vie numérique, simplifiée",
    "auth.register.processing": "Inscription en cours...",
    "auth.register.success": "Inscription réussie",
    "auth.register.accountCreated": "Votre compte a été créé avec succès",
    
    "auth.logout.success": "Déconnexion réussie",
    "auth.logout.message": "À bientôt !",
    
    "auth.errors.loginFailed": "Échec de la connexion",
    "auth.errors.registrationFailed": "Échec de l'inscription",
    "auth.errors.passwordLength": "Le mot de passe doit comporter au moins 6 caractères",
    "auth.errors.passwordMismatch": "Les mots de passe ne correspondent pas",
    "auth.errors.generic": "Une erreur est survenue. Veuillez réessayer.",
    
    // Catégories
    "categories.health": "Santé",
    "categories.identity": "Identité",
    "categories.vehicle": "Véhicule",
    "categories.contract": "Contrats",
    "categories.other": "Autre",
    
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
    "app.tagline": "Manage your important documents",
    "app.logout": "Log out",
    
    // Navigation
    "nav.home": "Home",
    "nav.documents": "Documents",
    "nav.add": "Add",
    "nav.settings": "Settings",
    
    // Authentication
    "auth.email": "Email",
    "auth.emailPlaceholder": "Enter your email...",
    "auth.password": "Password",
    "auth.passwordPlaceholder": "Enter your password...",
    "auth.confirmPassword": "Confirm Password",
    "auth.confirmPasswordPlaceholder": "Confirm your password...",
    "auth.fullName": "Full Name",
    "auth.fullNamePlaceholder": "Enter your full name...",
    "auth.forgotPassword": "Forgot password?",
    "auth.noAccount": "Don't have an account?",
    "auth.haveAccount": "Already have an account?",
    
    "auth.login.title": "Log In",
    "auth.login.welcomeBack": "Welcome Back!",
    "auth.login.accountAccess": "Log into your account",
    "auth.login.action": "LOGIN",
    "auth.login.processing": "Logging in...",
    "auth.login.success": "Login successful",
    "auth.login.welcomeMessage": "Welcome to DocuBox",
    
    "auth.register.title": "Sign Up",
    "auth.register.action": "SIGNUP",
    "auth.register.tagline": "Scan, store & get reminders for your documents",
    "auth.register.secure": "Stay organized. Stay secure.",
    "auth.register.join": "Join now — your digital life, simplified",
    "auth.register.processing": "Signing up...",
    "auth.register.success": "Registration successful",
    "auth.register.accountCreated": "Your account has been created successfully",
    
    "auth.logout.success": "Successfully logged out",
    "auth.logout.message": "See you soon!",
    
    "auth.errors.loginFailed": "Login failed",
    "auth.errors.registrationFailed": "Registration failed",
    "auth.errors.passwordLength": "Password must be at least 6 characters long",
    "auth.errors.passwordMismatch": "Passwords do not match",
    "auth.errors.generic": "An error occurred. Please try again.",
    
    // Categories
    "categories.health": "Health",
    "categories.identity": "Identity",
    "categories.vehicle": "Vehicle",
    "categories.contract": "Contracts",
    "categories.other": "Other",
    
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
    "app.tagline": "إدارة مستنداتك المهمة",
    "app.logout": "تسجيل الخروج",
    
    // Navigation
    "nav.home": "الرئيسية",
    "nav.documents": "المستندات",
    "nav.add": "إضافة",
    "nav.settings": "الإعدادات",
    
    // Authentication
    "auth.email": "البريد الإلكتروني",
    "auth.emailPlaceholder": "أدخل بريدك الإلكتروني...",
    "auth.password": "كلمة المرور",
    "auth.passwordPlaceholder": "أدخل كلمة المرور...",
    "auth.confirmPassword": "تأكيد كلمة المرور",
    "auth.confirmPasswordPlaceholder": "أكد كلمة المرور...",
    "auth.fullName": "الاسم الكامل",
    "auth.fullNamePlaceholder": "أدخل اسمك الكامل...",
    "auth.forgotPassword": "نسيت كلمة المرور؟",
    "auth.noAccount": "ليس لديك حساب؟",
    "auth.haveAccount": "لديك حساب بالفعل؟",
    
    "auth.login.title": "تسجيل الدخول",
    "auth.login.welcomeBack": "مرحبًا بعودتك!",
    "auth.login.accountAccess": "تسجيل الدخول إلى حسابك",
    "auth.login.action": "تسجيل الدخول",
    "auth.login.processing": "جاري تسجيل الدخول...",
    "auth.login.success": "تم تسجيل الدخول بنجاح",
    "auth.login.welcomeMessage": "مرحبًا بك في دوكوبوكس",
    
    "auth.register.title": "إنشاء حساب",
    "auth.register.action": "التسجيل",
    "auth.register.tagline": "مسح وتخزين والحصول على تذكيرات لمستنداتك",
    "auth.register.secure": "ابق منظمًا. ابق آمنًا.",
    "auth.register.join": "انضم الآن — حياتك الرقمية، بسيطة",
    "auth.register.processing": "جاري التسجيل...",
    "auth.register.success": "تم التسجيل بنجاح",
    "auth.register.accountCreated": "تم إنشاء حسابك بنجاح",
    
    "auth.logout.success": "تم تسجيل الخروج بنجاح",
    "auth.logout.message": "إلى اللقاء!",
    
    "auth.errors.loginFailed": "فشل تسجيل الدخول",
    "auth.errors.registrationFailed": "فشل التسجيل",
    "auth.errors.passwordLength": "يجب أن تكون كلمة المرور 6 أحرف على الأقل",
    "auth.errors.passwordMismatch": "كلمات المرور غير متطابقة",
    "auth.errors.generic": "حدث خطأ. يرجى المحاولة مرة أخرى.",
    
    // Categories
    "categories.health": "الصحة",
    "categories.identity": "الهوية",
    "categories.vehicle": "المركبات",
    "categories.contract": "العقود",
    "categories.other": "أخرى",
    
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
