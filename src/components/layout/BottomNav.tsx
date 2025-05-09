
import { Link, useLocation } from "react-router-dom";
import { Home, FileText, PlusCircle, Settings, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

export default function BottomNav() {
  const location = useLocation();
  const { t } = useLanguage();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { 
      path: '/', 
      icon: <Home className="h-6 w-6" />, 
      label: t('navigation.home'), 
      active: isActive('/') 
    },
    { 
      path: '/documents', 
      icon: <FileText className="h-6 w-6" />, 
      label: t('navigation.documents'), 
      active: isActive('/documents') 
    },
    { 
      path: '/add-document', 
      icon: <PlusCircle className="h-6 w-6" />, 
      label: t('navigation.addDocument'), 
      active: isActive('/add-document') 
    },
    { 
      path: '/payment-plans', 
      icon: <CreditCard className="h-6 w-6" />, 
      label: t('navigation.payment'), 
      active: isActive('/payment-plans') 
    },
    { 
      path: '/settings', 
      icon: <Settings className="h-6 w-6" />, 
      label: t('navigation.settings'), 
      active: isActive('/settings') 
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t h-16 flex items-center justify-around px-2 z-50">
      {navItems.map((item) => (
        <Link 
          key={item.path} 
          to={item.path}
          className={cn(
            "flex flex-col items-center justify-center w-full h-full",
            item.active 
              ? "text-primary" 
              : "text-muted-foreground hover:text-primary"
          )}
        >
          {item.icon}
          <span className="text-xs mt-1">{item.label}</span>
        </Link>
      ))}
    </div>
  );
}
