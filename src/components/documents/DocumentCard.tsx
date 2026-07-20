
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DocumentType } from "@/types";
import { format, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";
import { Eye, Download, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { CategoryTag } from "./CategoryTag";
import { DocumentMenu } from "./DocumentMenu";
import { useEffect, useState } from "react";
import { getCategoryInfo, normalizeCategory } from "@/utils/categories";

interface DocumentCardProps {
  document: DocumentType;
}

export function DocumentCard({ document }: DocumentCardProps) {
  const { id, name, category, expiration_date, created_at, thumbnail_path } = document;
  const [isDownloaded, setIsDownloaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("downloadedDocuments");
    if (saved) setIsDownloaded(JSON.parse(saved).includes(id));
  }, [id]);

  const catInfo = getCategoryInfo(category);

  // Expiration status
  let expStatus: { label: string; className: string } | null = null;
  if (expiration_date) {
    const days = differenceInDays(new Date(expiration_date), new Date());
    if (days < 0) expStatus = { label: "Expiré", className: "bg-red-100 text-red-700 border-red-200" };
    else if (days <= 30) expStatus = { label: `${days}j restants`, className: "bg-orange-100 text-orange-700 border-orange-200" };
    else expStatus = { label: "À jour", className: "bg-green-100 text-green-700 border-green-200" };
  }

  const thumbnailSrc = thumbnail_path || "";

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div
          className={`relative h-36 overflow-hidden flex items-center justify-center`}
          style={{ backgroundColor: `${catInfo.hex}18` }}
        >
          {thumbnailSrc ? (
            <img
              src={thumbnailSrc}
              alt={name}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <FileText size={44} style={{ color: catInfo.hex }} />
          )}
          <div className="absolute top-2 right-2">
            <DocumentMenu documentId={id} />
          </div>
          {isDownloaded && (
            <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-medium shadow-sm">
              <Download className="inline-block mr-1" size={12} />
              Téléchargé
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="font-medium line-clamp-1" title={name}>
          {name}
        </h3>
        <div className="mt-2 flex items-center justify-between">
          <CategoryTag category={normalizeCategory(category) as any} />
          <span className="text-xs text-muted-foreground">
            {format(new Date(created_at), "dd MMM yyyy", { locale: fr })}
          </span>
        </div>
        {expStatus && (
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Expire: {format(new Date(expiration_date!), "dd MMM yyyy", { locale: fr })}
            </span>
            <Badge variant="outline" className={expStatus.className}>
              {expStatus.label}
            </Badge>
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

