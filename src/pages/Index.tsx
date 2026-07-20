import { useAuth } from "@/contexts/AuthContext";
import { ExpiringDocuments } from "@/components/dashboard/ExpiringDocuments";
import { RecentDocuments } from "@/components/dashboard/RecentDocuments";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { CategoryChart } from "@/components/dashboard/CategoryChart";
import BottomNav from "@/components/layout/BottomNav";
import { DocumentLimitWarning } from "@/components/payment/DocumentLimitWarning";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDocuments } from "@/services/documentService";
import { ScanLine, Plus } from "lucide-react";

export default function Index() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { data: documents = [] } = useQuery({ queryKey: ["documents"], queryFn: getDocuments });

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container py-8 space-y-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {t("dashboard.welcome")}, {user?.email?.split("@")[0]}
            </h1>
            <p className="text-muted-foreground text-sm">{t("dashboard.manageDocuments")}</p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/add-document"><Plus className="mr-1" size={16} /> Ajouter</Link>
            </Button>
            <Button asChild size="lg" className="shadow-md">
              <Link to="/add-document?tab=scan">
                <ScanLine className="mr-2" size={18} /> Scanner
              </Link>
            </Button>
          </div>
        </header>

        <DocumentLimitWarning documentCount={documents.length} />

        <DashboardStats documents={documents} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategoryChart documents={documents} />
          <ExpiringDocuments />
        </div>

        <RecentDocuments />
      </div>
      <BottomNav />
    </div>
  );
}
