
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, LogIn } from "lucide-react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, isLoading } = useAuth();
  const { t } = useLanguage();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          {t("auth.email")}
        </label>
        <Input
          id="email"
          type="email"
          placeholder={t("auth.emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-1">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            {t("auth.password")}
          </label>
          <a href="#" className="text-xs text-primary hover:underline">
            {t("auth.forgotPassword")}
          </a>
        </div>
        <div className="relative">
          <Input
            id="password"
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
      
      <Button
        type="submit"
        className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
        disabled={isLoading}
      >
        <LogIn className="mr-2 h-4 w-4" />
        {isLoading ? t("auth.login.processing") : t("auth.login.action")}
      </Button>
      
      <div className="text-center text-sm mt-4">
        <p>
          {t("auth.noAccount")}{" "}
          <a href="#signup" className="text-primary hover:underline font-medium">
            {t("auth.register.action")}
          </a>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
