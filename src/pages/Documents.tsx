
import { DocumentGrid } from "@/components/documents/DocumentGrid";
import { DocumentsFilter } from "@/components/documents/DocumentsFilter";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { getDocumentsByCategory, searchDocuments } from "@/services/documentService";
import { PlusIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DocumentType } from "@/types";

export default function Documents() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  
  // Effet pour charger les documents en fonction de la catégorie et de la recherche
  useEffect(() => {
    const loadDocuments = async () => {
      setIsLoading(true);
      try {
        let docs;
        if (searchQuery) {
          docs = await searchDocuments(searchQuery);
        } else {
          docs = await getDocumentsByCategory(selectedCategory as any);
        }
        setDocuments(docs);
      } catch (error) {
        console.error("Erreur lors du chargement des documents:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDocuments();
  }, [selectedCategory, searchQuery, refreshKey]);
  
  // Cet effet s'exécutera lors de la navigation de retour vers cette page depuis AddDocument
  useEffect(() => {
    const handleFocus = () => {
      setRefreshKey(prev => prev + 1);
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

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
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <DocumentGrid 
              documents={documents} 
              emptyMessage={
                searchQuery 
                  ? "Aucun document ne correspond à votre recherche" 
                  : "Aucun document dans cette catégorie"
              } 
            />
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
