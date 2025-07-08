
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockDocuments } from "@/utils/mock-data";
import { Button } from "@/components/ui/button";
import { Clock, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CategoryTag } from "../documents/CategoryTag";

export function RecentDocuments() {
  // Get 5 most recent documents
  const recentDocuments = [...mockDocuments]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents récents</CardTitle>
        <CardDescription>
          Vos derniers documents ajoutés
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentDocuments.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 rounded-md hover:bg-muted/60 transition-colors"
            >
              <div>
                <div className="font-medium">{doc.name}</div>
                <div className="flex items-center space-x-2 mt-1">
                  <CategoryTag category={doc.category as any} withIcon={false} className="text-xs" />
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock size={12} className="mr-1" />
                    {format(new Date(doc.created_at), "dd MMM yyyy", { locale: fr })}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to={`/documents/${doc.id}`}>
                  <Eye size={16} />
                  <span className="sr-only">Voir</span>
                </Link>
              </Button>
            </div>
          ))}

          <Button variant="outline" asChild className="w-full mt-2">
            <Link to="/documents">Voir tous les documents</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
