
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockDocuments } from "@/utils/mock-data";
import { CATEGORIES, CategoryKey } from "@/utils/categories";

export function StatsByCategory() {
  const stats = Object.keys(CATEGORIES).reduce(
    (acc, category) => {
      acc[category as CategoryKey] = 0;
      return acc;
    },
    {} as Record<CategoryKey, number>
  );

  mockDocuments.forEach((doc) => {
    const category = doc.category as CategoryKey;
    stats[category] += 1;
  });

  const totalDocuments = mockDocuments.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents par catégorie</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {Object.entries(CATEGORIES).map(([key, category]) => {
            const count = stats[key as CategoryKey];
            const percentage = totalDocuments > 0 
              ? Math.round((count / totalDocuments) * 100) 
              : 0;
              
            const Icon = category.icon;

            return (
              <div key={key} className="flex items-center">
                <div 
                  className={`p-2 rounded-md mr-3 ${category.color}`}
                >
                  <Icon size={16} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">
                      {category.label}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${category.color.replace('text-', 'bg-').replace('/10', '')}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
