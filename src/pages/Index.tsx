
import { useAuth } from "@/contexts/AuthContext";
import { ExpiringDocuments } from "@/components/dashboard/ExpiringDocuments";
import { RecentDocuments } from "@/components/dashboard/RecentDocuments";
import { StatsByCategory } from "@/components/dashboard/StatsByCategory";
import BottomNav from "@/components/layout/BottomNav";
import { DocumentLimitWarning } from "@/components/payment/DocumentLimitWarning";
import { mockDocuments } from "@/utils/mock-data";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

export default function Index() {
  const { t } = useLanguage();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-4">{t('dashboard.welcome')}, {user?.email}</h1>
        <p className="text-muted-foreground mb-8">{t('dashboard.manageDocuments')}</p>

        <DocumentLimitWarning documentCount={mockDocuments.length} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <StatsByCategory />
          <RecentDocuments />
          <ExpiringDocuments />
        </div>

        <div className="mt-8 text-center">
          <Button asChild>
            <Link to="/add-document">{t('dashboard.addFirstDocument')}</Link>
          </Button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
