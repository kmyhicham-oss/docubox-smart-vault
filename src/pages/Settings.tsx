
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { BellRing, Fingerprint, Globe, Lock, LogOut, User2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/settings/LanguageSelector";

export default function Settings() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleLogout = () => {
    toast({
      title: t("settings.logout.success"),
      description: t("settings.logout.message")
    });
    navigate("/login");
  };

  return (
    <div className="pb-20">
      <header className="bg-background border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">{t("settings.title")}</h1>
        </div>
      </header>

      <main className="container mx-auto p-4 space-y-6 max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User2 className="mr-2" size={18} />
              {t("settings.profile")}
            </CardTitle>
            <CardDescription>
              {t("settings.profile.desc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{t("settings.email")}</div>
                <div className="text-sm text-muted-foreground">
                  user@example.com
                </div>
              </div>
              <Button variant="outline" size="sm">
                {t("settings.edit")}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{t("settings.password")}</div>
                <div className="text-sm text-muted-foreground">
                  {t("settings.password.lastModified")}
                </div>
              </div>
              <Button variant="outline" size="sm">
                {t("settings.edit")}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BellRing className="mr-2" size={18} />
              {t("settings.notifications")}
            </CardTitle>
            <CardDescription>
              {t("settings.notifications.desc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">{t("settings.notifications.expiring")}</div>
                <div className="text-sm text-muted-foreground">
                  {t("settings.notifications.expiring.desc")}
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">{t("settings.notifications.timing")}</div>
                <div className="text-sm text-muted-foreground">
                  {t("settings.notifications.timing.desc")}
                </div>
              </div>
              <Button variant="outline" size="sm">
                {t("settings.notifications.configure")}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="mr-2" size={18} />
              {t("settings.security")}
            </CardTitle>
            <CardDescription>
              {t("settings.security.desc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">{t("settings.security.pin")}</div>
                <div className="text-sm text-muted-foreground">
                  {t("settings.security.pin.desc")}
                </div>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">{t("settings.security.biometric")}</div>
                <div className="text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Fingerprint size={14} className="mr-1" />
                    {t("settings.security.biometric.desc")}
                  </div>
                </div>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="mr-2" size={18} />
              {t("settings.language")}
            </CardTitle>
            <CardDescription>
              {t("settings.language.desc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">{t("settings.language")}</div>
              </div>
              <LanguageSelector />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">{t("settings.logout")}</CardTitle>
          </CardHeader>
          <CardFooter>
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="mr-2" size={16} />
              {t("app.logout")}
            </Button>
          </CardFooter>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
}
