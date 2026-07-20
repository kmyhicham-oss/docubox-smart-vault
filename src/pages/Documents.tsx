import { useState } from "react";
import { DocumentGrid } from "@/components/documents/DocumentGrid";
import { DocumentsFilter } from "@/components/documents/DocumentsFilter";
import { DocumentLimitWarning } from "@/components/payment/DocumentLimitWarning";
import BottomNav from "@/components/layout/BottomNav";
import { useLanguage } from "@/contexts/LanguageContext";
import { getDocuments } from "@/services/documentService";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ScanLine } from "lucide-react";

export default function Documents() {
  const { t } = useLanguage();
  const [category, setCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dateRange, setDateRange] = useState<{ from?: string; to?: string }>({});

  const { data: documents, isLoading, isError } = useQuery({
    queryKey: ["documents"],
    queryFn: () => getDocuments(),
  });

  const filteredDocuments = (documents ?? []).filter((doc) => {
    if (category && doc.category !== category) return false;
    if (searchQuery && !doc.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (dateRange.from && new Date(doc.created_at) < new Date(dateRange.from)) return false;
    if (dateRange.to && new Date(doc.created_at) > new Date(dateRange.to + "T23:59:59")) return false;
    return true;
  });

  if (isLoading) return <div className="p-8">{t("loading")}...</div>;
  if (isError) return <div className="p-8">{t("errorFetchingDocuments")}</div>;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container py-8">
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">{t("documents")}</h1>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/add-document">{t("addDocument")}</Link>
            </Button>
            <Button asChild>
              <Link to="/add-document?tab=scan"><ScanLine className="mr-1" size={16} /> Scanner</Link>
            </Button>
          </div>
        </div>

        <DocumentLimitWarning documentCount={documents?.length || 0} />

        <div className="mt-6 space-y-4">
          <DocumentsFilter
            onCategoryChange={setCategory}
            onSearchChange={setSearchQuery}
            onDateFilterChange={setDateRange}
          />
          <div className="text-sm text-muted-foreground">
            {filteredDocuments.length} document(s) trouvé(s)
          </div>
          <DocumentGrid documents={filteredDocuments} />
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
