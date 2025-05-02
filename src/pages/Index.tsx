import { ExpiringDocuments } from "@/components/dashboard/ExpiringDocuments";
import { RecentDocuments } from "@/components/dashboard/RecentDocuments";
import { StatsByCategory } from "@/components/dashboard/StatsByCategory";
import { BottomNav } from "@/components/layout/BottomNav";
import { mockDocuments } from "@/utils/mock-data";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/shared/Logo";

export default function Index() {
  return (
    <div className="pb-20">
      <header className="bg-background border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="text-docubox-blue">Docu</span>Box
          </h1>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="icon">
              <Link to="/notifications">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-docubox-blue opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-docubox-blue"></span>
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 space-y-6 max-w-lg">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-docubox-blue/10 p-4 rounded-lg">
            <div className="text-3xl font-bold text-docubox-blue">{mockDocuments.length}</div>
            <div className="text-sm text-muted-foreground">Documents stockés</div>
          </div>
          <div className="bg-docubox-identity/10 p-4 rounded-lg">
            <div className="text-3xl font-bold text-docubox-identity">
              {mockDocuments.filter(doc => doc.expirationDate && doc.expirationDate < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).length}
            </div>
            <div className="text-sm text-muted-foreground">À renouveler</div>
          </div>
        </div>

        {/* Quick action button */}
        <Button asChild className="w-full">
          <Link to="/add-document">
            <PlusIcon className="mr-2" />
            Ajouter un document
          </Link>
        </Button>

        {/* Expiring docs */}
        <ExpiringDocuments />

        {/* Recent docs */}
        <RecentDocuments />

        {/* Stats by category */}
        <StatsByCategory />
        
        {/* Signature logo at the bottom */}
        <div className="pt-4 mt-6 border-t border-gray-100">
          <Logo />
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
