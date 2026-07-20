import { Input } from "@/components/ui/input";
import { getAllCategories } from "@/utils/categories";
import { Search, Calendar as CalendarIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { CategoryFilter } from "./CategoryFilter";
import { Button } from "@/components/ui/button";

interface DocumentsFilterProps {
  onCategoryChange: (category: string) => void;
  onSearchChange: (query: string) => void;
  onDateFilterChange?: (range: { from?: string; to?: string }) => void;
}

export function DocumentsFilter({
  onCategoryChange,
  onSearchChange,
  onDateFilterChange,
}: DocumentsFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showDates, setShowDates] = useState(false);
  const categories = getAllCategories();

  useEffect(() => {
    const t = setTimeout(() => onSearchChange(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery, onSearchChange]);

  useEffect(() => {
    onDateFilterChange?.({ from: dateFrom || undefined, to: dateTo || undefined });
  }, [dateFrom, dateTo, onDateFilterChange]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    onCategoryChange(category === "all" ? "" : category);
  };

  const clearDates = () => {
    setDateFrom("");
    setDateTo("");
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher par nom..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          variant={showDates ? "default" : "outline"}
          size="icon"
          onClick={() => setShowDates((s) => !s)}
          aria-label="Filtrer par date"
        >
          <CalendarIcon size={16} />
        </Button>
      </div>

      {showDates && (
        <div className="flex flex-wrap items-center gap-2 p-3 bg-muted/40 rounded-md">
          <label className="text-xs text-muted-foreground">Du</label>
          <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-auto" />
          <label className="text-xs text-muted-foreground">Au</label>
          <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-auto" />
          {(dateFrom || dateTo) && (
            <Button variant="ghost" size="sm" onClick={clearDates}>
              <X size={14} className="mr-1" /> Effacer
            </Button>
          )}
        </div>
      )}

      <CategoryFilter
        categories={[{ id: "all", label: "Tous", icon: "" }, ...categories]}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategoryChange}
      />
    </div>
  );
}
