
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CategoryInfo } from "@/types";
import { getCategoryInfo } from "@/utils/categories";

interface CategoryFilterProps {
  categories: Array<CategoryInfo | { id: "all"; label: string; icon: string }>;
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex space-x-2">
        {categories.map((cat) => {
          const isAll = cat.id === "all";
          const isSelected = selectedCategory === cat.id;
          
          // For non-"all" categories, get the appropriate icon component
          let IconComponent = null;
          if (!isAll) {
            const categoryInfo = getCategoryInfo(cat.id as any);
            IconComponent = categoryInfo.icon;
          }

          return (
            <Button
              key={cat.id}
              variant={isSelected ? "default" : "outline"}
              onClick={() => onSelectCategory(cat.id)}
              className="px-3 py-1 h-9"
            >
              {!isAll && IconComponent && (
                <IconComponent className="mr-2 h-4 w-4" />
              )}
              {cat.label}
            </Button>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" className="invisible" />
    </ScrollArea>
  );
}
