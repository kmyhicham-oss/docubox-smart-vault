
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useDocumentDetail } from "@/hooks/useDocumentDetail";
import { useDocumentDownload } from "@/hooks/useDocumentDownload";
import { DocumentHeader } from "@/components/documents/DocumentHeader";
import { DocumentDetailDisplay } from "@/components/documents/DocumentDetailDisplay";

export default function DocumentDetail() {
  const { 
    id, 
    document, 
    isLoading, 
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleDelete, 
    getImageUrl 
  } = useDocumentDetail();
  
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  const { 
    isDownloading, 
    downloadProgress, 
    isDownloaded, 
    handleDownload 
  } = useDocumentDownload(id, document?.name || "");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Document introuvable</h1>
          <p className="mt-2 text-muted-foreground">
            Le document que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <Button asChild className="mt-4">
            <Link to="/documents">Retour aux documents</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  const handleShare = () => {
    // Dans une application réelle, nous ouvririons une boîte de dialogue pour partager
    // Ici, nous simulons un partage
    navigator.clipboard.writeText(`https://docubox.app/share/${id}`)
      .then(() => {
        toast({
          title: "Lien de partage copié",
          description: "Le lien de partage a été copié dans le presse-papier",
        });
      })
      .catch(() => {
        toast({
          title: "Erreur",
          description: "Impossible de copier le lien de partage",
          variant: "destructive",
        });
      });
  };
  
  const handleEdit = () => {
    // Activer le mode édition
    setIsEditing(true);
    
    // Show toast about edit mode
    toast({
      title: "Mode édition",
      description: `Vous pouvez maintenant modifier les informations de "${document.name}"`,
    });
  };

  return (
    <div className="pb-20">
      <DocumentHeader title={document.name} />

      <DocumentDetailDisplay 
        document={document}
        isDownloaded={isDownloaded}
        isDownloading={isDownloading}
        downloadProgress={downloadProgress}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        getImageUrl={getImageUrl}
        handleDownload={handleDownload}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        handleShare={handleShare}
      />

      <BottomNav />
    </div>
  );
}
