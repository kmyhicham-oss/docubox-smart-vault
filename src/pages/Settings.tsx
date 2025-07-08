// Import BottomNav correctly
import BottomNav from "@/components/layout/BottomNav";
import { LanguageSelector } from "@/components/settings/LanguageSelector";
import SignOutButton from "@/components/auth/SignOutButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Languages, Info, CreditCard, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Settings() {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="container mx-auto py-10">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><User className="mr-2 h-4 w-4" />{t('settings.profile')}</CardTitle>
              <CardDescription>{t('settings.profileDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm font-medium">{user?.email}</div>
                {/* Additional profile information can be added here */}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Languages className="mr-2 h-4 w-4" />{t('settings.language')}</CardTitle>
              <CardDescription>{t('settings.languageDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <LanguageSelector />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Info className="mr-2 h-4 w-4" />{t('settings.about')}</CardTitle>
              <CardDescription>{t('settings.aboutDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{t('settings.ourMission')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><CreditCard className="mr-2 h-4 w-4" />{t('settings.plan')}</CardTitle>
              <CardDescription>{t('settings.planDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{t('settings.currentPlan')}: Free</p>
              <Button asChild>
                <Link to="/payment-plans">{t('settings.upgradePlan')}</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Trash2 className="mr-2 h-4 w-4" />{t('settings.dangerZone')}</CardTitle>
              <CardDescription>{t('settings.deleteAccountDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-red-500">{t('settings.irreversibleAction')}</p>
              <Button variant="destructive">{t('settings.deleteAccount')}</Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <SignOutButton />
            </CardContent>
          </Card>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
