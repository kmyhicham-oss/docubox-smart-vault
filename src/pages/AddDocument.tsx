
import { DocumentForm } from "@/components/documents/DocumentForm";
import { DocumentScanner } from "@/components/documents/DocumentScanner";
import { BottomNav } from "@/components/layout/BottomNav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/shared/Logo";

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
        <Tabs defaultValue="form" className="mb-6">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="form">Formulaire</TabsTrigger>
            <TabsTrigger value="scan">Scanner</TabsTrigger>
          </TabsList>
          
          <TabsContent value="form">
            <DocumentForm />
          </TabsContent>
          
          <TabsContent value="scan">
            <DocumentScanner />
          </TabsContent>
        </Tabs>
        
        <div className="text-center mt-8">
          <Logo />
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
