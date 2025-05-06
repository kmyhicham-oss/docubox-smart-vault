
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { DocumentType } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Eye, MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";
import { CategoryTag } from "./CategoryTag";
import { DocumentMenu } from "./DocumentMenu";

interface DocumentCardProps {
  document: DocumentType;
}

export function DocumentCard({ document }: DocumentCardProps) {
  const { id, name, category, expirationDate, createdAt, thumbnailPath } = document;

  const isExpiringSoon = expirationDate && 
    expirationDate > new Date() && 
    expirationDate < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    
  // Placeholder image based on category if no thumbnailPath is provided
  const getDefaultThumbnail = () => {
    switch(category) {
      case "identity": return "/placeholder.svg";
      case "health": return "/placeholder.svg";
      case "vehicle": return "/placeholder.svg";
      case "contract": return "/placeholder.svg";
      case "other": return "/placeholder.svg";
      default: return "/placeholder.svg";
    }
  };

  const thumbnailSrc = thumbnailPath?.startsWith("/") ? thumbnailPath : getDefaultThumbnail();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative h-36 bg-muted overflow-hidden">
          <img 
            src={thumbnailSrc} 
            alt={name} 
            className="w-full h-full object-cover" 
            onError={(e) => {
              // If image fails to load, replace with default placeholder
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
          <div className="absolute top-2 right-2">
            <DocumentMenu documentId={id} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium line-clamp-1" title={name}>
            {name}
          </h3>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <CategoryTag category={category} />
          <span className="text-xs text-muted-foreground">
            {format(createdAt, "dd MMM yyyy", { locale: fr })}
          </span>
        </div>
        {expirationDate && (
          <div className={`mt-2 text-xs ${isExpiringSoon ? "text-docubox-identity" : "text-muted-foreground"}`}>
            {isExpiringSoon ? "⚠️ " : ""}
            Expire: {format(expirationDate, "dd MMM yyyy", { locale: fr })}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-2">
        <Button asChild variant="ghost" className="w-full">
          <Link to={`/documents/${id}`}>
            <Eye className="mr-2" size={16} />
            Consulter
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
