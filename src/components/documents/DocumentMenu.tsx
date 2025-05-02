
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

interface DocumentMenuProps {
  documentId: string;
}

export function DocumentMenu({ documentId }: DocumentMenuProps) {
  const { toast } = useToast();

  const handleDelete = () => {
    toast({
      title: "Document supprimé",
      description: "Le document a été supprimé avec succès",
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
        <DropdownMenuItem>
          <Download className="mr-2" size={16} />
          <span>Télécharger</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Share className="mr-2" size={16} />
          <span>Partager</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
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
