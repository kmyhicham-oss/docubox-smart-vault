
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button, ButtonProps } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface SignOutButtonProps extends ButtonProps {
  showIcon?: boolean;
  redirectTo?: string;
}

const SignOutButton = ({ 
  showIcon = true, 
  className, 
  variant = "destructive",
  size,
  redirectTo = "/signin",
  ...props 
}: SignOutButtonProps) => {
  const { logout } = useAuth();
  const { t } = useLanguage();

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Clear any session data and redirect
    localStorage.removeItem("docubox-user");
    // Use the redirectTo prop for navigation after logout
    logout(redirectTo);
  };

  return (
    <Button 
      variant={variant} 
      size={size}
      className={className}
      onClick={handleLogout}
      {...props}
    >
      {showIcon && <LogOut className="mr-2" size={16} />}
      {t("app.logout")}
    </Button>
  );
};

export default SignOutButton;
