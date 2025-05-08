
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { downloadDocument } from "@/services/documentService";

export function useDocumentDownload(documentId: string | undefined, documentName: string) {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadedFiles, setDownloadedFiles] = useState<string[]>(() => {
    // Get downloaded files from localStorage if available
    const saved = localStorage.getItem('downloadedDocuments');
    return saved ? JSON.parse(saved) : [];
  });
  
  const isDownloaded = documentId ? downloadedFiles.includes(documentId) : false;

  const handleDownload = async () => {
    if (!documentId) return;
    
    // Start download progress simulation
    setIsDownloading(true);
    setDownloadProgress(0);
    
    // Simulate download progress
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
        }
        return newProgress;
      });
    }, 300);
    
    try {
      await downloadDocument(documentId, documentName);
      
      toast({
        title: "Téléchargement terminé",
        description: `Le document "${documentName}" est maintenant disponible dans votre dossier Téléchargements`,
      });
    } catch (error) {
      console.error("Erreur lors du téléchargement du document:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du téléchargement du document",
        variant: "destructive",
      });
    }
  };

  return {
    isDownloading,
    downloadProgress,
    isDownloaded,
    handleDownload
  };
}
