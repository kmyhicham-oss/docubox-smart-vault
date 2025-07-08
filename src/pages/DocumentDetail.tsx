// Import BottomNav correctly
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/layout/BottomNav";
import { DocumentInfo } from "@/components/documents/DocumentInfo";
import { DocumentActions } from "@/components/documents/DocumentActions";
import { DocumentImage } from "@/components/documents/DocumentImage";
import { useDocumentDetail } from "@/hooks/useDocumentDetail";
import { useDocumentDownload } from "@/hooks/useDocumentDownload";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function DocumentDetail() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    document, 
    isLoading, 
    isDeleteDialogOpen, 
    setIsDeleteDialogOpen, 
    handleDelete, 
    getImageUrl 
  } = useDocumentDetail();
  
  const { downloadDocument, isDownloading } = useDocumentDownload();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }

  if (!document) {
    return <div className="flex items-center justify-center min-h-screen">Document non trouvé.</div>;
  }

  const handleDownload = () => {
    downloadDocument(document);
  };

  const handleEdit = () => {
    // TODO: Navigate to edit page
    toast({
      title: "Fonction à venir",
      description: "La modification sera bientôt disponible",
    });
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    toast({
      title: "Fonction à venir", 
      description: "Le partage sera bientôt disponible",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          Retour
        </Button>
      </header>

      <main className="container mx-auto p-4 flex-grow max-w-lg space-y-6">
        <DocumentImage 
          imageUrlFn={getImageUrl} 
          isDownloaded={false} 
        />

        <DocumentInfo document={document} />
        
        <DocumentActions 
          isDownloaded={false}
          isDownloading={isDownloading}
          downloadProgress={0}
          isDeleteDialogOpen={isDeleteDialogOpen}
          setIsDeleteDialogOpen={setIsDeleteDialogOpen}
          onDownload={handleDownload}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onShare={handleShare}
        />
      </main>

      <BottomNav />
    </div>
  );
}
