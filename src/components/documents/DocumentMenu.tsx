
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
import { mockDocuments } from "@/utils/mock-data";
import { useNavigate } from "react-router-dom";

interface DocumentMenuProps {
  documentId: string;
}

export function DocumentMenu({ documentId }: DocumentMenuProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const document = mockDocuments.find(doc => doc.id === documentId);

  const handleDelete = () => {
    toast({
      title: "Document supprimé",
      description: "Le document a été supprimé avec succès",
    });
  };
  
  const handleDownload = () => {
    if (!document) return;
    
    // Dans une application réelle, nous récupérerions le fichier à partir du serveur
    // Ici, nous simulons un téléchargement
    toast({
      title: "Téléchargement démarré",
      description: `Le document "${document.name}" est en cours de téléchargement`,
    });
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
        <DropdownMenuItem onClick={handleDownload}>
          <Download className="mr-2" size={16} />
          <span>Télécharger</span>
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
