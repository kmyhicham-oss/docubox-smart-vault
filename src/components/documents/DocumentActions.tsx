
import { Download, Edit, Share, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";

interface DocumentActionsProps {
  isDownloaded: boolean;
  isDownloading: boolean;
  downloadProgress: number;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  onDownload: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onShare: () => void;
}

export function DocumentActions({
  isDownloaded,
  isDownloading,
  downloadProgress,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  onDownload,
  onDelete,
  onEdit,
  onShare
}: DocumentActionsProps) {
  return (
    <div className="space-y-4">
      {/* Download progress indicator */}
      {isDownloading && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Téléchargement en cours...</span>
            <span className="text-sm font-medium">{downloadProgress}%</span>
          </div>
          <Progress value={downloadProgress} className="h-2" />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 pt-4">
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={onDownload}
          disabled={isDownloading}
        >
          <Download className="mr-2 h-4 w-4" />
          {isDownloaded ? "Téléchargé" : "Télécharger"}
        </Button>
        <Button variant="outline" className="w-full" onClick={onShare}>
          <Share className="mr-2 h-4 w-4" />
          Partager
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="secondary" className="w-full" onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Modifier
        </Button>
        
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full">
              <Trash className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer ce document ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. Le document sera définitivement supprimé.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete}>
                Confirmer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
