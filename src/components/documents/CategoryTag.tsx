
import { DocumentCategory } from "@/types";
import { getCategoryInfo } from "@/utils/categories";
import { Badge } from "../ui/badge";

interface CategoryTagProps {
  category: DocumentCategory;
  withIcon?: boolean;
  className?: string;
}

export function CategoryTag({ category, withIcon = true, className = "" }: CategoryTagProps) {
  const categoryInfo = getCategoryInfo(category);
  const Icon = categoryInfo.icon;

  return (
    <Badge
      variant="outline"
      className={`${categoryInfo.color} flex items-center gap-1.5 font-normal ${className}`}
    >
      {withIcon && <Icon size={14} />}
      {categoryInfo.label}
    </Badge>
  );
}
