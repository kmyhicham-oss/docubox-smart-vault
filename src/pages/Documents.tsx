import { useState } from "react";
import { DocumentGrid } from "@/components/documents/DocumentGrid";
import { DocumentsFilter } from "@/components/documents/DocumentsFilter";
import BottomNav from "@/components/layout/BottomNav";
import { useLanguage } from "@/contexts/LanguageContext";
import { getDocuments } from "@/services/documentService";
import { useQuery } from "@tanstack/react-query";
import { DocumentType } from "@/types";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Documents() {
  const { t } = useLanguage();
  const [category, setCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: documents, isLoading, isError } = useQuery(
    ["documents"],
    () => getDocuments()
  );

  const filteredDocuments = documents
    ? documents.filter((doc) => {
        const categoryMatch = category ? doc.category === category : true;
        const searchMatch = searchQuery
          ? doc.name.toLowerCase().includes(searchQuery.toLowerCase())
          : true;
        return categoryMatch && searchMatch;
      })
    : [];

  if (isLoading) {
    return <div>{t("loading")}...</div>;
  }

  if (isError) {
    return <div>{t("errorFetchingDocuments")}</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">{t("documents")}</h1>
          <Button asChild>
            <Link to="/add-document">{t("addDocument")}</Link>
          </Button>
        </div>
        <DocumentsFilter
          category={category}
          setCategory={setCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <DocumentGrid documents={filteredDocuments} />
      </div>
      <BottomNav />
    </div>
  );
}
