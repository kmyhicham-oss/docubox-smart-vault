
import { useState } from "react";
import { Logo } from "@/components/shared/Logo";
import LoginForm from "@/components/auth/LoginForm";
import { LanguageSelector } from "@/components/settings/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { SafeImage } from "@/components/shared/SafeImage";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-docubox-gray-light">
      {/* Left side - Login form */}
      <div className="w-full md:w-1/2 p-6 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden p-8">
          <div className="absolute top-4 right-4">
            <LanguageSelector />
          </div>
          
          <div className="mb-6 text-center">
            <Logo />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t("auth.login.welcomeBack")}</h2>
          <p className="text-gray-600 mb-6">{t("auth.login.accountAccess")}</p>
          
          <LoginForm />
          
          <div className="text-center text-sm mt-6">
            <p>
              {t("auth.noAccount")}{" "}
              <Button 
                variant="link" 
                className="p-0 h-auto text-primary hover:underline font-medium"
                onClick={() => navigate("/signup")}
              >
                {t("auth.register.action")}
              </Button>
            </p>
          </div>
        </div>
      </div>
      
      {/* Right side - Brand image */}
      <div className="hidden md:flex md:w-1/2 bg-emerald-600 p-6 items-center justify-center">
        <div className="max-w-md text-white">
          <SafeImage className="mb-8 max-w-[280px] mx-auto" />
          
          <h2 className="text-3xl font-bold mb-4">DocuBox</h2>
          <p className="text-xl mb-6">📋 {t("auth.register.tagline")}</p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="inline-flex items-center bg-white/20 text-white text-sm px-3 py-1 rounded-full">
              🏥 {t("categories.health")}
            </span>
            <span className="inline-flex items-center bg-white/20 text-white text-sm px-3 py-1 rounded-full">
              🪪 {t("categories.identity")}
            </span>
            <span className="inline-flex items-center bg-white/20 text-white text-sm px-3 py-1 rounded-full">
              🚗 {t("categories.vehicle")}
            </span>
            <span className="inline-flex items-center bg-white/20 text-white text-sm px-3 py-1 rounded-full">
              📑 {t("categories.contract")}
            </span>
          </div>
          
          <p className="mb-2">🔒 {t("auth.register.secure")}</p>
          <p>📱 {t("auth.register.join")}</p>
        </div>
      </div>
    </div>
  );
}
