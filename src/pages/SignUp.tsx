
import { useState } from "react";
import { Logo } from "@/components/shared/Logo";
import SignupForm from "@/components/auth/SignupForm";
import { LanguageSelector } from "@/components/settings/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { SafeImage } from "@/components/shared/SafeImage";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-docubox-gray-light">
      {/* Left side - Brand info (visible only on larger screens) */}
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
      
      {/* Right side - Signup form */}
      <div className="w-full md:w-1/2 p-6 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden p-8">
          <div className="absolute top-4 right-4">
            <LanguageSelector />
          </div>
          
          <div className="mb-6 text-center">
            <Logo />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">DocuBox</h2>
          <p className="text-gray-600 mb-2">📋 {t("auth.register.tagline")}</p>
          
          {/* Categories section for mobile */}
          <div className="flex flex-wrap gap-2 mb-4 md:hidden">
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
          
          <p className="text-gray-600 mb-2 md:hidden">🔒 {t("auth.register.secure")}</p>
          <p className="text-gray-600 mb-6 md:hidden">📱 {t("auth.register.join")}</p>
          
          <SignupForm />
          
          <div className="text-center text-sm mt-6">
            <p>
              {t("auth.haveAccount")}{" "}
              <Button 
                variant="link" 
                className="p-0 h-auto text-primary hover:underline font-medium"
                onClick={() => navigate("/signin")}
              >
                {t("auth.login.action")}
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
