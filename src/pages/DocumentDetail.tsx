// Import BottomNav correctly
import { useParams, useNavigate } from "react-router-dom";
import BottomNav from "@/components/layout/BottomNav";
import { DocumentDetailDisplay } from "@/components/documents/DocumentDetailDisplay";
import { useDocumentDetail } from "@/hooks/useDocumentDetail";

export default function DocumentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { document, isLoading, error } = useDocumentDetail(id!);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen">Error: {error.message}</div>;
  }

  if (!document) {
    return <div className="flex items-center justify-center min-h-screen">Document non trouvé.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          Retour
        </Button>
      </header>

      <main className="container mx-auto p-4 flex-grow">
        <DocumentDetailDisplay document={document} />
      </main>

      <BottomNav />
    </div>
  );
}

import { Button } from "@/components/ui/button";
