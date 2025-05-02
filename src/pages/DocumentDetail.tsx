import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { mockDocuments } from "@/utils/mock-data";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowLeft, Calendar, Clock, Download, Edit, Share, Trash } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CategoryTag } from "@/components/documents/CategoryTag";
import { Badge } from "@/components/ui/badge";
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
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Logo } from "@/components/shared/Logo";

export default function DocumentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const document = mockDocuments.find(doc => doc.id === id);

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

  const handleDelete = () => {
    toast({
      title: "Document supprimé",
      description: "Le document a été supprimé avec succès",
    });
    navigate("/documents");
  };

  const isExpiringSoon = document.expirationDate && 
    document.expirationDate > new Date() && 
    document.expirationDate < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  return (
    <div className="pb-20">
      <header className="bg-background border-b px-4 py-4">
        <div className="flex items-center">
          <Link to="/documents" className="mr-3">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-bold tracking-tight line-clamp-1">
            {document.name}
          </h1>
        </div>
      </header>

      <main className="container mx-auto p-4 max-w-lg space-y-6">
        <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden">
          {document.thumbnailPath ? (
            <img 
              src={document.thumbnailPath} 
              alt={document.name} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-muted-foreground">Aperçu indisponible</span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold">{document.name}</h2>
            <div className="flex items-center space-x-2 mt-1">
              <CategoryTag category={document.category} />
              
              {isExpiringSoon && (
                <Badge variant="outline" className="bg-docubox-identity/10 text-docubox-identity border-docubox-identity/30">
                  Expiration proche
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-muted/50 rounded-md">
              <div className="text-xs text-muted-foreground mb-1">Ajouté le</div>
              <div className="flex items-center">
                <Clock size={14} className="mr-2" />
                {format(document.createdAt, "dd MMMM yyyy", { locale: fr })}
              </div>
            </div>

            {document.expirationDate && (
              <div className="p-3 bg-muted/50 rounded-md">
                <div className="text-xs text-muted-foreground mb-1">Expire le</div>
                <div className="flex items-center">
                  <Calendar size={14} className="mr-2" />
                  {format(document.expirationDate, "dd MMMM yyyy", { locale: fr })}
                </div>
              </div>
            )}
          </div>

          {document.description && (
            <div className="p-4 bg-muted/50 rounded-md">
              <h3 className="text-sm font-medium mb-1">Description</h3>
              <p className="text-sm text-muted-foreground">
                {document.description}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-4">
            <Button variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Télécharger
            </Button>
            <Button variant="outline" className="w-full">
              <Share className="mr-2 h-4 w-4" />
              Partager
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="secondary" className="w-full">
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
                  <AlertDialogAction onClick={handleDelete}>
                    Confirmer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="text-center pt-6 border-t border-gray-100">
          <Logo />
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
