
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { DocumentType } from "@/types";

export function useDocumentDownload() {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  
  const downloadDocument = async (document: DocumentType) => {
    if (!document) return;
    
    setIsDownloading(true);
    toast({
      title: "Téléchargement démarré",
      description: `Le document "${document.name}" est en cours de téléchargement`,
    });
    
    try {
      // Simulate file download
      const url = URL.createObjectURL(new Blob([`Document content for ${document.name}`], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = document.name + '.pdf';
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      // Save downloaded status
      const savedFiles = localStorage.getItem('downloadedDocuments') || '[]';
      const downloadedFiles = JSON.parse(savedFiles);
      if (!downloadedFiles.includes(document.id)) {
        downloadedFiles.push(document.id);
        localStorage.setItem('downloadedDocuments', JSON.stringify(downloadedFiles));
      }
      
      // Show completion toast
      toast({
        title: "Téléchargement terminé",
        description: `Le document "${document.name}" est maintenant disponible`,
      });
      
      return true;
    } catch (error) {
      console.error("Erreur lors du téléchargement du document:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du téléchargement",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsDownloading(false);
    }
  };
  
  return { downloadDocument, isDownloading };
}
