
import { Input } from "@/components/ui/input";
import { getAllCategories } from "@/utils/categories";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { CategoryFilter } from "./CategoryFilter";

interface DocumentsFilterProps {
  onCategoryChange: (category: string) => void;
  onSearchChange: (query: string) => void;
}

export function DocumentsFilter({
  onCategoryChange,
  onSearchChange,
}: DocumentsFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const categories = getAllCategories();

  useEffect(() => {
    const debounceSearch = setTimeout(() => {
      onSearchChange(searchQuery);
    }, 300);

    return () => clearTimeout(debounceSearch);
  }, [searchQuery, onSearchChange]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    onCategoryChange(category);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Rechercher des documents..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <CategoryFilter
        categories={[
          { id: "all", label: "Tous", icon: "" },
          ...categories
        ]}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategoryChange}
      />
    </div>
  );
}
