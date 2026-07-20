import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentType } from "@/types";
import { CATEGORIES, normalizeCategory } from "@/utils/categories";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface CategoryChartProps {
  documents: DocumentType[];
}

export function CategoryChart({ documents }: CategoryChartProps) {
  const counts: Record<string, number> = {};
  documents.forEach((d) => {
    const k = normalizeCategory(d.category);
    counts[k] = (counts[k] || 0) + 1;
  });

  const data = Object.entries(counts)
    .map(([k, v]) => ({ name: CATEGORIES[k].label, value: v, color: CATEGORIES[k].hex }))
    .filter((d) => d.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Répartition par catégorie</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-sm text-muted-foreground py-8 text-center">Aucun document</div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
