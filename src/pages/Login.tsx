
import { useState } from "react";
import { Logo } from "@/components/shared/Logo";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import { LanguageSelector } from "@/components/settings/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Login() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-docubox-gray-light">
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>
      
      <div className="w-full max-w-5xl flex">
        {/* Tabs for small screens */}
        <div className="md:hidden w-full flex mb-4">
          <button 
            className={`w-1/2 py-2 text-center ${activeTab === 'login' ? 'font-bold border-b-2 border-primary' : 'text-gray-500'}`}
            onClick={() => setActiveTab('login')}
          >
            {t("auth.login.title")}
          </button>
          <button 
            className={`w-1/2 py-2 text-center ${activeTab === 'signup' ? 'font-bold border-b-2 border-primary' : 'text-gray-500'}`}
            onClick={() => setActiveTab('signup')}
          >
            {t("auth.register.title")}
          </button>
        </div>
        
        <div className="hidden md:flex w-full gap-6">
          {/* Login Panel */}
          <div className={`w-1/2 bg-white rounded-lg shadow-lg overflow-hidden ${activeTab === 'signup' ? 'hidden md:block' : ''}`}>
            <div className="p-8">
              <div className="mb-4 text-center">
                <Logo />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{t("auth.login.welcomeBack")}</h2>
              <p className="text-gray-600 mb-6">{t("auth.login.accountAccess")}</p>
              <LoginForm />
            </div>
          </div>
          
          {/* Sign Up Panel */}
          <div className={`w-1/2 bg-white rounded-lg shadow-lg overflow-hidden ${activeTab === 'login' ? 'hidden md:block' : ''}`}>
            <div className="p-8">
              <div className="mb-4 text-center">
                <Logo />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">DocuBox</h2>
              <p className="text-gray-600 mb-2">📋 DocuBox - {t("auth.register.tagline")}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  🏥 {t("categories.health")}
                </span>
                <span className="inline-flex items-center bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                  🪪 {t("categories.identity")}
                </span>
                <span className="inline-flex items-center bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                  🚗 {t("categories.vehicle")}
                </span>
                <span className="inline-flex items-center bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
                  📑 {t("categories.contract")}
                </span>
              </div>
              
              <p className="text-gray-600 mb-2">🔒 {t("auth.register.secure")}</p>
              <p className="text-gray-600 mb-6">📱 {t("auth.register.join")}</p>
              
              <SignupForm />
            </div>
          </div>
          
          {/* Mobile view - show active panel only */}
          <div className="md:hidden w-full">
            {activeTab === 'login' ? (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden p-6">
                <div className="mb-4 text-center">
                  <Logo />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{t("auth.login.welcomeBack")}</h2>
                <p className="text-gray-600 mb-6">{t("auth.login.accountAccess")}</p>
                <LoginForm />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden p-6">
                <div className="mb-4 text-center">
                  <Logo />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">DocuBox</h2>
                <p className="text-gray-600 mb-2">📋 DocuBox - {t("auth.register.tagline")}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    🏥 {t("categories.health")}
                  </span>
                  <span className="inline-flex items-center bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                    🪪 {t("categories.identity")}
                  </span>
                  <span className="inline-flex items-center bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                    🚗 {t("categories.vehicle")}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-2">🔒 {t("auth.register.secure")}</p>
                <p className="text-gray-600 mb-6">📱 {t("auth.register.join")}</p>
                
                <SignupForm />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
