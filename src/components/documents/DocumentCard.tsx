
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
import { Eye, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { CategoryTag } from "./CategoryTag";
import { DocumentMenu } from "./DocumentMenu";
import { useEffect, useState } from "react";

interface DocumentCardProps {
  document: DocumentType;
}

export function DocumentCard({ document }: DocumentCardProps) {
  const { id, name, category, expiration_date, created_at, thumbnail_path } = document;
  const [isDownloaded, setIsDownloaded] = useState(false);
  
  useEffect(() => {
    // Check if this document is in the downloaded list
    const saved = localStorage.getItem('downloadedDocuments');
    if (saved) {
      const downloadedFiles = JSON.parse(saved);
      setIsDownloaded(downloadedFiles.includes(id));
    }
  }, [id]);

  const isExpiringSoon = expiration_date && 
    new Date(expiration_date) > new Date() && 
    new Date(expiration_date) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    
  // Get appropriate image based on category when no thumbnailPath is available
  const getDefaultThumbnail = () => {
    switch(category) {
      case "identity": return "/images/id-preview.png";
      case "health": return "/images/health-preview.png";
      case "vehicle": return "/images/vehicle-preview.png";
      case "contract": return "/images/lease-preview.png";
      case "other": return "/images/diploma-preview.png";
      default: return "/placeholder.svg";
    }
  };

  // Use thumbnail_path if it's a valid path, otherwise use default
  const thumbnailSrc = thumbnail_path || getDefaultThumbnail();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative h-36 bg-muted overflow-hidden">
          <img 
            src={thumbnailSrc} 
            alt={name} 
            className="w-full h-full object-cover" 
            loading="lazy"
            onError={(e) => {
              console.log("Image failed to load:", thumbnailSrc);
              // If image fails to load, replace with default placeholder
              (e.target as HTMLImageElement).src = getDefaultThumbnail();
            }}
          />
          <div className="absolute top-2 right-2">
            <DocumentMenu documentId={id} />
          </div>
          
          {/* Downloaded badge */}
          {isDownloaded && (
            <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-medium shadow-sm">
              <Download className="inline-block mr-1" size={12} />
              Téléchargé
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium line-clamp-1" title={name}>
            {name}
          </h3>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <CategoryTag category={category as any} />
          <span className="text-xs text-muted-foreground">
            {format(new Date(created_at), "dd MMM yyyy", { locale: fr })}
          </span>
        </div>
        {expiration_date && (
          <div className={`mt-2 text-xs ${isExpiringSoon ? "text-docubox-identity" : "text-muted-foreground"}`}>
            {isExpiringSoon ? "⚠️ " : ""}
            Expire: {format(new Date(expiration_date), "dd MMM yyyy", { locale: fr })}
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
