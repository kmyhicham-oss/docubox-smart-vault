
import { DocumentForm } from "@/components/documents/DocumentForm";
import { BottomNav } from "@/components/layout/BottomNav";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function AddDocument() {
  return (
    <div className="pb-20">
      <header className="bg-background border-b px-4 py-4">
        <div className="flex items-center">
          <Link to="/documents" className="mr-3">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-bold tracking-tight">Ajouter un document</h1>
        </div>
      </header>

      <main className="container mx-auto p-4 max-w-lg">
        <DocumentForm />
      </main>

      <BottomNav />
    </div>
  );
}
