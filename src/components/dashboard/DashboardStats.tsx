import { Card, CardContent } from "@/components/ui/card";
import { FileText, AlertTriangle, Clock, CheckCircle2 } from "lucide-react";
import { DocumentType } from "@/types";
import { differenceInDays } from "date-fns";

interface DashboardStatsProps {
  documents: DocumentType[];
}

export function DashboardStats({ documents }: DashboardStatsProps) {
  const now = new Date();
  let expired = 0;
  let soon = 0;
  let ok = 0;
  documents.forEach((d) => {
    if (!d.expiration_date) return;
    const diff = differenceInDays(new Date(d.expiration_date), now);
    if (diff < 0) expired++;
    else if (diff <= 30) soon++;
    else ok++;
  });

  const items = [
    { label: "Total", value: documents.length, icon: FileText, color: "text-primary bg-primary/10" },
    { label: "Expirés", value: expired, icon: AlertTriangle, color: "text-red-600 bg-red-100" },
    { label: "Bientôt (30j)", value: soon, icon: Clock, color: "text-orange-600 bg-orange-100" },
    { label: "À jour", value: ok, icon: CheckCircle2, color: "text-green-600 bg-green-100" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((it) => {
        const Icon = it.icon;
        return (
          <Card key={it.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-md ${it.color}`}>
                <Icon size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold leading-tight">{it.value}</div>
                <div className="text-xs text-muted-foreground">{it.label}</div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
