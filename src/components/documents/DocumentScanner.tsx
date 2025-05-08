
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Camera, Upload, X } from "lucide-react";
import { addDocument } from "@/services/documentService";
import { useNavigate } from "react-router-dom";

export function DocumentScanner() {
  const [scanMode, setScanMode] = useState<"camera" | "upload">("upload");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setCapturedFile(file);
    
    const reader = new FileReader();
    reader.onload = () => {
      setCapturedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleCameraCapture = () => {
    // In a real app, this would use the device camera
    // For now, we'll simulate with a file upload
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleProcessDocument = async () => {
    if (!capturedImage || !capturedFile) return;
    
    setIsProcessing(true);
    
    try {
      // Ajouter le document à Supabase
      const result = await addDocument({
        name: `Document scanné le ${new Date().toLocaleDateString()}`,
        category: "other",
        file: capturedFile
      });
      
      if (result.success) {
        toast({
          title: "Document numérisé avec succès",
          description: "Le document a été correctement numérisé et est prêt pour l'enregistrement.",
        });
        
        // Rediriger vers le document nouvellement créé
        navigate(`/documents/${result.documentId}`);
      } else {
        throw result.error;
      }
    } catch (error) {
      console.error("Erreur lors du traitement du document:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du traitement du document",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleReset = () => {
    setCapturedImage(null);
    setCapturedFile(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <h3 className="text-lg font-medium">Scanner un document</h3>
        <p className="text-sm text-muted-foreground">
          Numérisez vos documents rapidement à l'aide de votre appareil photo ou en téléchargeant un fichier
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upload" onValueChange={(value) => setScanMode(value as "camera" | "upload")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Télécharger</TabsTrigger>
            <TabsTrigger value="camera">Appareil photo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="mt-4">
            {!capturedImage ? (
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Cliquez pour télécharger ou glissez-déposez
                </p>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button 
                  variant="secondary" 
                  className="mt-4"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Sélectionner un fichier
                </Button>
              </div>
            ) : (
              <div className="relative">
                <img 
                  src={capturedImage} 
                  alt="Document scanné" 
                  className="w-full h-auto rounded-md"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={handleReset}
                >
                  <X size={16} />
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="camera" className="mt-4">
            {!capturedImage ? (
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                <Camera className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Utilisez votre appareil photo pour numériser
                </p>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button 
                  variant="secondary" 
                  className="mt-4"
                  onClick={handleCameraCapture}
                >
                  Activer l'appareil photo
                </Button>
              </div>
            ) : (
              <div className="relative">
                <img 
                  src={capturedImage} 
                  alt="Document scanné" 
                  className="w-full h-auto rounded-md"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={handleReset}
                >
                  <X size={16} />
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {capturedImage && (
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleProcessDocument}
            disabled={isProcessing}
          >
            {isProcessing ? "Traitement en cours..." : "Traiter le document"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
