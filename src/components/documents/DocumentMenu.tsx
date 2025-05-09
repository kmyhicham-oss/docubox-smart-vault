
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, MoreVertical, Pencil, Share, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { deleteDocument, getDocumentById } from "@/services/documentService";
import { DocumentType } from "@/types";

interface DocumentMenuProps {
  documentId: string;
}

export function DocumentMenu({ documentId }: DocumentMenuProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [document, setDocument] = useState<DocumentType | null>(null);
  const [downloadedFiles, setDownloadedFiles] = useState<string[]>([]);
  
  useEffect(() => {
    // Get downloaded files from localStorage if available
    const saved = localStorage.getItem('downloadedDocuments');
    if (saved) {
      setDownloadedFiles(JSON.parse(saved));
    }
    
    // Récupérer les informations du document
    const fetchDocument = async () => {
      try {
        const doc = await getDocumentById(documentId);
        setDocument(doc);
      } catch (error) {
        console.error("Erreur lors de la récupération du document:", error);
      }
    };
    
    fetchDocument();
  }, [documentId]);
  
  const isDownloaded = downloadedFiles.includes(documentId);

  const handleDelete = async () => {
    try {
      const result = await deleteDocument(documentId);
      
      if (result && result.success) {
        toast({
          title: "Document supprimé",
          description: "Le document a été supprimé avec succès",
        });
        // Rafraîchir la page ou la liste des documents
        window.location.reload();
      } else {
        throw new Error("Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du document:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du document",
        variant: "destructive",
      });
    }
  };
  
  const handleDownload = async () => {
    if (!document) return;
    
    toast({
      title: "Téléchargement démarré",
      description: `Le document "${document.name}" est en cours de téléchargement dans votre dossier Téléchargements`,
    });
    
    try {
      // Simulate download
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
      if (!downloadedFiles.includes(documentId)) {
        downloadedFiles.push(documentId);
        localStorage.setItem('downloadedDocuments', JSON.stringify(downloadedFiles));
      }
      
      // Show completion toast
      toast({
        title: "Téléchargement terminé",
        description: `Le document "${document.name}" est maintenant disponible dans votre dossier Téléchargements`,
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
  
  const handleShare = () => {
    if (!document) return;
    
    // Dans une application réelle, nous ouvririons une boîte de dialogue pour partager
    // Ici, nous simulons un partage
    navigator.clipboard.writeText(`https://docubox.app/share/${documentId}`)
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="h-8 w-8">
          <MoreVertical size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleDownload} className="relative">
          <Download className="mr-2" size={16} />
          <span>{isDownloaded ? "Télécharger à nouveau" : "Télécharger"}</span>
          {isDownloaded && (
            <div className="h-2 w-2 rounded-full bg-green-500 absolute left-1"></div>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleShare}>
          <Share className="mr-2" size={16} />
          <span>Partager</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate(`/documents/${documentId}`)}>
          <Pencil className="mr-2" size={16} />
          <span>Modifier</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} className="text-destructive">
          <Trash2 className="mr-2" size={16} />
          <span>Supprimer</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
