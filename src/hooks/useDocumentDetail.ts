
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { deleteDocument, getDocumentById } from "@/services/documentService";
import { DocumentType } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export function useDocumentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [document, setDocument] = useState<DocumentType | null>(null);
  
  useEffect(() => {
    const fetchDocument = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const doc = await getDocumentById(id);
        setDocument(doc);
      } catch (error) {
        console.error("Erreur lors de la récupération du document:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger le document demandé",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocument();
  }, [id, toast]);

  const handleDelete = async () => {
    try {
      if (!document) return;
      
      const result = await deleteDocument(document.id);
      
      if (result.success) {
        toast({
          title: "Document supprimé",
          description: "Le document a été supprimé avec succès",
        });
        navigate("/documents");
      } else {
        throw result.error;
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

  const getImageUrl = async () => {
    if (!document || !document.thumbnailPath) {
      switch(document?.category) {
        case "identity": return "/images/id-preview.png";
        case "health": return "/images/health-preview.png";
        case "vehicle": return "/images/vehicle-preview.png";
        case "contract": return "/images/lease-preview.png";
        case "other": return "/images/diploma-preview.png";
        default: return "/placeholder.svg";
      }
    }
    
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(document.thumbnailPath, 60);
        
      if (error || !data) {
        throw error;
      }
      
      return data.signedUrl;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'URL de l'image:", error);
      return "/placeholder.svg";
    }
  };

  return {
    id,
    document,
    isLoading,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleDelete,
    getImageUrl
  };
}
