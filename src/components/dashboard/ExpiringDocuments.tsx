
import { getExpiringDocuments } from "@/utils/mock-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CategoryTag } from "../documents/CategoryTag";

export function ExpiringDocuments() {
  const expiringDocs = getExpiringDocuments();

  if (expiringDocs.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="mr-2 text-docubox-identity" size={18} />
          Documents expirant bientôt
        </CardTitle>
        <CardDescription>
          Documents nécessitant votre attention prochainement
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {expiringDocs.map((doc) => {
            const daysUntilExpiry = doc.expiration_date 
              ? differenceInDays(new Date(doc.expiration_date), new Date())
              : null;
              
            let urgencyColor = "bg-green-100 text-green-800";
            if (daysUntilExpiry !== null) {
              if (daysUntilExpiry <= 7) {
                urgencyColor = "bg-red-100 text-red-800";
              } else if (daysUntilExpiry <= 14) {
                urgencyColor = "bg-amber-100 text-amber-800";
              }
            }
            
            return (
              <div 
                key={doc.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
              >
                <div>
                  <div className="font-medium">{doc.name}</div>
                  <div className="flex items-center space-x-2 mt-1">
                    <CategoryTag category={doc.category as any} withIcon={false} className="text-xs" />
                    {doc.expiration_date && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar size={12} className="mr-1" />
                        {format(new Date(doc.expiration_date), "dd MMM yyyy", { locale: fr })}
                      </div>
                    )}
                  </div>
                </div>
                {daysUntilExpiry !== null && (
                  <Badge variant="outline" className={`${urgencyColor} ml-2`}>
                    {daysUntilExpiry <= 0
                      ? "Expiré"
                      : daysUntilExpiry === 1
                      ? "Demain"
                      : `${daysUntilExpiry} jours`}
                  </Badge>
                )}
              </div>
            );
          })}
          
          <Button variant="outline" asChild className="w-full mt-2">
            <Link to="/documents">
              Voir tous les documents
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
