
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup } from "@/components/ui/radio-group";
import { DocumentCategory } from "@/types";
import { CATEGORIES } from "@/utils/categories";
import { cn } from "@/lib/utils";

interface CategorySelectorProps {
  value: DocumentCategory;
  onChange: (value: DocumentCategory) => void;
}

export function CategorySelector({ value, onChange }: CategorySelectorProps) {
  return (
    <FormItem>
      <FormLabel>Catégorie</FormLabel>
      <RadioGroup
        onValueChange={onChange}
        defaultValue={value}
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5"
      >
        {Object.entries(CATEGORIES).map(([key, category]) => {
          const Icon = category.icon;
          return (
            <FormItem key={key}>
              <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                <FormControl>
                  <input
                    type="radio"
                    value={key}
                    className="sr-only"
                    checked={value === key}
                  />
                </FormControl>
                <div className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:border-accent ${value === key ? 'border-primary' : ''}`}>
                  <Icon className={cn("mb-3 h-6 w-6", value === key ? "text-primary" : "text-muted-foreground")} />
                  <span className="text-xs font-medium leading-none">
                    {category.label}
                  </span>
                </div>
              </FormLabel>
            </FormItem>
          );
        })}
      </RadioGroup>
      <FormMessage />
    </FormItem>
  );
}
