
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, Clock } from "lucide-react";
import { DocumentType } from "@/types";
import { CategoryTag } from "@/components/documents/CategoryTag";
import { Badge } from "@/components/ui/badge";

interface DocumentInfoProps {
  document: DocumentType;
}

export function DocumentInfo({ document }: DocumentInfoProps) {
  const isExpiringSoon = document.expiration_date && 
    new Date(document.expiration_date) > new Date() && 
    new Date(document.expiration_date) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">{document.name}</h2>
        <div className="flex items-center space-x-2 mt-1">
          <CategoryTag category={document.category as any} />
          
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
            {format(new Date(document.created_at), "dd MMMM yyyy", { locale: fr })}
          </div>
        </div>

        {document.expiration_date && (
          <div className="p-3 bg-muted/50 rounded-md">
            <div className="text-xs text-muted-foreground mb-1">Expire le</div>
            <div className="flex items-center">
              <Calendar size={14} className="mr-2" />
              {format(new Date(document.expiration_date), "dd MMMM yyyy", { locale: fr })}
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
    </div>
  );
}
