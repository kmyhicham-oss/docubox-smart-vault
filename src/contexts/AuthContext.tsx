import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "./LanguageContext";

type User = {
  email: string;
  name?: string;
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: (redirectTo?: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    // Check if user is stored in localStorage on initial load
    const storedUser = localStorage.getItem("docubox-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // In a real application, you would validate credentials against a backend
      // For this example, we'll just simulate a successful login after a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Simple validation (would be done on the server in a real app)
      if (password.length < 6) {
        throw new Error(t("auth.errors.passwordLength"));
      }
      
      const userData: User = { email };
      setUser(userData);
      localStorage.setItem("docubox-user", JSON.stringify(userData));
      
      toast({
        title: t("auth.login.success"),
        description: t("auth.login.welcomeMessage")
      });
      
      navigate("/");
    } catch (error) {
      toast({
        title: t("auth.errors.loginFailed"),
        description: error instanceof Error ? error.message : t("auth.errors.generic"),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, confirmPassword: string) => {
    setIsLoading(true);
    
    try {
      // In a real application, you would send this data to a backend
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Validate password
      if (password.length < 6) {
        throw new Error(t("auth.errors.passwordLength"));
      }
      
      if (password !== confirmPassword) {
        throw new Error(t("auth.errors.passwordMismatch"));
      }
      
      const userData: User = { email };
      setUser(userData);
      localStorage.setItem("docubox-user", JSON.stringify(userData));
      
      toast({
        title: t("auth.register.success"),
        description: t("auth.register.accountCreated")
      });
      
      navigate("/");
    } catch (error) {
      toast({
        title: t("auth.errors.registrationFailed"),
        description: error instanceof Error ? error.message : t("auth.errors.generic"),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (redirectTo: string = "/signin") => {
    setUser(null);
    localStorage.removeItem("docubox-user");
    toast({
      title: t("auth.logout.success"),
      description: t("auth.logout.message")
    });
    navigate(redirectTo);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
