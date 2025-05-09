// Import BottomNav correctly
import { DocumentForm } from "@/components/documents/DocumentForm";
import { DocumentScanner } from "@/components/documents/DocumentScanner";
import BottomNav from "@/components/layout/BottomNav";

export default function AddDocument() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4">Ajouter un document</h1>
        <DocumentForm />
        <DocumentScanner />
      </div>
      <BottomNav />
    </div>
  );
}
