
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, UserPlus } from "lucide-react";

const SignupForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register, isLoading } = useAuth();
  const { t } = useLanguage();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await register(email, password, confirmPassword);
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
          {t("auth.fullName")}
        </label>
        <Input
          id="fullName"
          type="text"
          placeholder={t("auth.fullNamePlaceholder")}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
      </div>
      
      <div>
        <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-1">
          {t("auth.email")}
        </label>
        <Input
          id="register-email"
          type="email"
          placeholder={t("auth.emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
      </div>
      
      <div>
        <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">
          {t("auth.password")}
        </label>
        <div className="relative">
          <Input
            id="register-password"
            type={showPassword ? "text" : "password"}
            placeholder={t("auth.passwordPlaceholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 top-0 h-full px-3"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
        </div>
      </div>
      
      <div>
        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
          {t("auth.confirmPassword")}
        </label>
        <div className="relative">
          <Input
            id="confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder={t("auth.confirmPasswordPlaceholder")}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-0 top-0 h-full px-3"
          >
            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
        </div>
      </div>
      
      <Button
        type="submit"
        className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
        disabled={isLoading}
      >
        <UserPlus className="mr-2 h-4 w-4" />
        {isLoading ? t("auth.register.processing") : t("auth.register.action")}
      </Button>
      
      <div className="text-center text-sm mt-4">
        <p>
          {t("auth.haveAccount")}{" "}
          <a href="#login" className="text-primary hover:underline font-medium">
            {t("auth.login.action")}
          </a>
        </p>
      </div>
    </form>
  );
};

export default SignupForm;
