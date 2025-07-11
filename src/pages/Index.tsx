
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
import { DraggableResizable } from "@/components/ui/draggable-resizable";
import { DesignModeProvider, DesignModeToggle, useDesignMode } from "@/components/ui/design-mode";

function IndexContent() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { isDesignMode } = useDesignMode();

  return (
    <div className="min-h-screen bg-background relative">
      <DesignModeToggle />
      
      <div className="container py-12">
        <DraggableResizable
          disabled={!isDesignMode}
          initialX={0}
          initialY={0}
          initialWidth={600}
          initialHeight={100}
        >
          <h1 className="text-3xl font-bold mb-4">{t('dashboard.welcome')}, {user?.email}</h1>
          <p className="text-muted-foreground mb-8">{t('dashboard.manageDocuments')}</p>
        </DraggableResizable>

        <DraggableResizable
          disabled={!isDesignMode}
          initialX={0}
          initialY={120}
          initialWidth={400}
          initialHeight={80}
        >
          <DocumentLimitWarning documentCount={mockDocuments.length} />
        </DraggableResizable>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <DraggableResizable
            disabled={!isDesignMode}
            initialX={0}
            initialY={220}
            initialWidth={300}
            initialHeight={200}
          >
            <StatsByCategory />
          </DraggableResizable>
          
          <DraggableResizable
            disabled={!isDesignMode}
            initialX={320}
            initialY={220}
            initialWidth={300}
            initialHeight={200}
          >
            <RecentDocuments />
          </DraggableResizable>
          
          <DraggableResizable
            disabled={!isDesignMode}
            initialX={640}
            initialY={220}
            initialWidth={300}
            initialHeight={200}
          >
            <ExpiringDocuments />
          </DraggableResizable>
        </div>

        <DraggableResizable
          disabled={!isDesignMode}
          initialX={200}
          initialY={440}
          initialWidth={200}
          initialHeight={60}
        >
          <div className="text-center">
            <Button asChild>
              <Link to="/add-document">{t('dashboard.addFirstDocument')}</Link>
            </Button>
          </div>
        </DraggableResizable>
      </div>
      <BottomNav />
    </div>
  );
}

export default function Index() {
  return (
    <DesignModeProvider>
      <IndexContent />
    </DesignModeProvider>
  );
}
