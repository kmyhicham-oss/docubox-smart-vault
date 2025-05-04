
import { cn } from "@/lib/utils";
import { FilePlus, FilesIcon, Home, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export function BottomNav() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { t } = useLanguage();

  const navItems = [
    {
      label: t("nav.home"),
      href: "/",
      icon: Home,
    },
    {
      label: t("nav.documents"),
      href: "/documents",
      icon: FilesIcon,
    },
    {
      label: t("nav.add"),
      href: "/add-document",
      icon: FilePlus,
      isMain: true,
    },
    {
      label: t("nav.settings"),
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t pb-safe-bottom z-50">
      <div className="grid grid-cols-4 gap-1 h-16">
        {navItems.map((item) => {
          const isActive = currentPath === item.href;
          
          return (
            <Link
              to={item.href}
              key={item.href}
              className={cn(
                "flex flex-col items-center justify-center px-2",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {item.isMain ? (
                <div className="flex flex-col items-center">
                  <div className="bg-primary text-primary-foreground rounded-full p-3 -mt-8 shadow-lg">
                    <item.icon size={22} />
                  </div>
                  <span className="text-xs mt-1">{item.label}</span>
                </div>
              ) : (
                <>
                  <item.icon size={20} />
                  <span className="text-xs mt-1">{item.label}</span>
                </>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
