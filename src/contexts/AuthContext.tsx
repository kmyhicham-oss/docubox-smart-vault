
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "./LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { User, Session } from '@supabase/supabase-js';

type AuthUser = {
  email: string;
  name?: string;
  id: string;
};

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithMicrosoft: () => Promise<void>;
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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        if (currentSession?.user) {
          const authUser: AuthUser = {
            id: currentSession.user.id,
            email: currentSession.user.email || "",
            name: currentSession.user.user_metadata.name
          };
          setUser(authUser);
        } else {
          setUser(null);
        }
      }
    );

    // Then check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (initialSession?.user) {
          const authUser: AuthUser = {
            id: initialSession.user.id,
            email: initialSession.user.email || "",
            name: initialSession.user.user_metadata.name
          };
          setUser(authUser);
          setSession(initialSession);
        }
      } catch (error) {
        console.error("Error checking auth session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: t("auth.login.success"),
        description: t("auth.login.welcomeMessage")
      });
      
      navigate("/");
    } catch (error: any) {
      toast({
        title: t("auth.errors.loginFailed"),
        description: error.message || t("auth.errors.generic"),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          scopes: 'https://www.googleapis.com/auth/drive.readonly',
          redirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      toast({
        title: t("auth.errors.loginFailed"),
        description: error.message || t("auth.errors.generic"),
        variant: "destructive"
      });
    }
  };

  const loginWithMicrosoft = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          scopes: 'https://graph.microsoft.com/Files.Read',
          redirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      toast({
        title: t("auth.errors.loginFailed"),
        description: error.message || t("auth.errors.generic"),
        variant: "destructive"
      });
    }
  };

  const register = async (email: string, password: string, confirmPassword: string) => {
    setIsLoading(true);
    
    try {
      // Validate password
      if (password.length < 6) {
        throw new Error(t("auth.errors.passwordLength"));
      }
      
      if (password !== confirmPassword) {
        throw new Error(t("auth.errors.passwordMismatch"));
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: t("auth.register.success"),
        description: t("auth.register.accountCreated")
      });
      
      navigate("/");
    } catch (error: any) {
      toast({
        title: t("auth.errors.registrationFailed"),
        description: error.message || t("auth.errors.generic"),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (redirectTo: string = "/signin") => {
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      // Clear user from state
      setUser(null);
      setSession(null);
      
      // Show success message
      toast({
        title: t("auth.logout.success"),
        description: t("auth.logout.message")
      });
      
      // Use a small timeout to ensure the state is updated before navigation
      setTimeout(() => {
        navigate(redirectTo);
      }, 100);
    } catch (error: any) {
      toast({
        title: "Erreur de déconnexion",
        description: error.message || "Une erreur est survenue lors de la déconnexion.",
        variant: "destructive"
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, loginWithGoogle, loginWithMicrosoft, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
