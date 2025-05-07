
import { DocumentForm } from "@/components/documents/DocumentForm";
import { DocumentScanner } from "@/components/documents/DocumentScanner";
import { BottomNav } from "@/components/layout/BottomNav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Camera, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/shared/Logo";
import { useEffect } from "react";

export default function AddDocument() {
  // Check for URL parameters that might indicate we should open scanner tab
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const openScanner = urlParams.get('scanner');
    
    // If the scanner parameter is present, we can programmatically select the scanner tab
    if (openScanner === 'true') {
      const scannerTab = document.querySelector('[data-value="scan"]') as HTMLButtonElement;
      if (scannerTab) {
        scannerTab.click();
      }
    }
  }, []);

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
            <TabsTrigger value="form" data-value="form" className="flex items-center justify-center">
              <FileText size={16} className="mr-2" />
              Formulaire
            </TabsTrigger>
            <TabsTrigger value="scan" data-value="scan" className="flex items-center justify-center">
              <Camera size={16} className="mr-2" />
              Scanner
            </TabsTrigger>
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
