
import { DocumentType } from "@/types";
import { DocumentCard } from "./DocumentCard";
import { EmptyState } from "../ui/empty-state";
import { SearchX } from "lucide-react";

interface DocumentGridProps {
  documents: DocumentType[];
  emptyMessage?: string;
}

export function DocumentGrid({ documents, emptyMessage = "Aucun document trouvé" }: DocumentGridProps) {
  if (documents.length === 0) {
    return (
      <EmptyState
        icon={<SearchX size={50} className="text-muted-foreground" />}
        title="Aucun document trouvé"
        description={emptyMessage}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {documents.map((document) => (
        <DocumentCard key={document.id} document={document} />
      ))}
    </div>
  );
}
