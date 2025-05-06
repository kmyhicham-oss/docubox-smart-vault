
import { DocumentGrid } from "@/components/documents/DocumentGrid";
import { DocumentsFilter } from "@/components/documents/DocumentsFilter";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { getDocumentsByCategory, searchDocuments } from "@/utils/mock-data";
import { PlusIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Documents() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  
  // This effect will run when navigating back to this page from AddDocument
  useEffect(() => {
    const handleFocus = () => {
      setRefreshKey(prev => prev + 1);
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);
  
  const filteredDocuments = searchQuery 
    ? searchDocuments(searchQuery) 
    : getDocumentsByCategory(selectedCategory as any);

  return (
    <div className="pb-20">
      <header className="bg-background border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">Mes documents</h1>
          <Button asChild size="sm">
            <Link to="/add-document">
              <PlusIcon className="mr-2 h-4 w-4" />
              Ajouter
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto p-4 max-w-5xl">
        <DocumentsFilter 
          onCategoryChange={setSelectedCategory} 
          onSearchChange={setSearchQuery} 
        />
        
        <div className="mt-6">
          <DocumentGrid 
            documents={filteredDocuments} 
            emptyMessage={
              searchQuery 
                ? "Aucun document ne correspond à votre recherche" 
                : "Aucun document dans cette catégorie"
            } 
            key={refreshKey} /* Force refresh when key changes */
          />
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
