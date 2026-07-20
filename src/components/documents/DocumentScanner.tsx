import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Camera, Upload, X, Brain, ScanLine, Calendar } from "lucide-react";
import { addDocument } from "@/services/documentService";
import { useNavigate } from "react-router-dom";
import { useDocumentAnalysis } from "@/hooks/useDocumentAnalysis";
import { CameraScanner } from "./CameraScanner";
import { getCategoryInfo } from "@/utils/categories";

interface Analysis {
  name: string;
  category: string;
  description: string;
  expirationDate?: string;
}

async function dataUrlToFile(dataUrl: string, filename: string): Promise<File> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type });
}

export function DocumentScanner() {
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [capturedFiles, setCapturedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { analyzeDocument } = useDocumentAnalysis();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const runAnalysis = async (file: File) => {
    try {
      toast({ title: "Analyse en cours...", description: "OCR + classification automatique" });
      const result = await analyzeDocument(file);
      setAnalysis({
        name: result.suggestedName,
        category: result.suggestedCategory,
        description:
          result.text.length > 20
            ? `Texte extrait: ${result.text.substring(0, 200)}${result.text.length > 200 ? "..." : ""}`
            : "",
        expirationDate: result.extractedDate,
      });
      toast({
        title: "Analyse terminée",
        description: `Catégorie: ${getCategoryInfo(result.suggestedCategory).label} · ${Math.round(result.confidence)}% confiance${result.extractedDate ? " · date détectée" : ""}`,
      });
    } catch (e) {
      console.error(e);
      toast({ title: "Erreur d'analyse", description: "Analyse impossible", variant: "destructive" });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCapturedFiles([file]);
    const reader = new FileReader();
    reader.onload = () => setCapturedImages([reader.result as string]);
    reader.readAsDataURL(file);
    if (file.type.startsWith("image/")) await runAnalysis(file);
  };

  const handleCameraPages = async (pages: string[]) => {
    setShowCamera(false);
    setCapturedImages(pages);
    const files = await Promise.all(
      pages.map((d, i) => dataUrlToFile(d, `scan-${Date.now()}-${i + 1}.jpg`))
    );
    setCapturedFiles(files);
    if (files[0]) await runAnalysis(files[0]);
  };

  const handleProcess = async () => {
    if (!capturedFiles.length) return;
    setIsProcessing(true);
    try {
      const primary = capturedFiles[0];
      const name =
        analysis?.name || `Document scanné ${new Date().toLocaleDateString("fr-FR")}`;
      const category = analysis?.category || "other";
      const description =
        (analysis?.description || "") +
        (capturedFiles.length > 1 ? `\n\n${capturedFiles.length} pages numérisées.` : "");

      const result = await addDocument(
        {
          name,
          category,
          description: description || null,
          user_id: "",
          file_path: "",
          thumbnail_path: "",
          expiration_date: analysis?.expirationDate ?? null,
          updated_at: new Date().toISOString(),
        },
        primary
      );

      if (result.success && result.document) {
        toast({ title: "Document enregistré", description: "Redirection…" });
        navigate(`/documents/${result.document.id}`);
      } else {
        throw result.error;
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le document",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setCapturedImages([]);
    setCapturedFiles([]);
    setAnalysis(null);
  };

  if (showCamera) {
    return <CameraScanner onPagesCaptured={handleCameraPages} onClose={() => setShowCamera(false)} />;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <h3 className="text-lg font-medium flex items-center gap-2">
          <ScanLine size={20} /> Scanner un document
        </h3>
        <p className="text-sm text-muted-foreground">
          Utilisez la caméra (détection automatique des contours) ou téléchargez un fichier.
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="camera">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="camera">
              <Camera size={16} className="mr-1" /> Caméra
            </TabsTrigger>
            <TabsTrigger value="upload">
              <Upload size={16} className="mr-1" /> Fichier
            </TabsTrigger>
          </TabsList>

          <TabsContent value="camera" className="mt-4">
            {capturedImages.length === 0 ? (
              <div className="border-2 border-dashed rounded-md p-6 text-center">
                <Camera className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Détection des contours en temps réel · multi-pages · correction de perspective
                </p>
                <Button className="mt-4" onClick={() => setShowCamera(true)}>
                  <ScanLine className="mr-1" size={16} /> Ouvrir le scanner
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  {capturedImages.map((img, i) => (
                    <div key={i} className="relative">
                      <img src={img} alt={`Page ${i + 1}`} className="w-full h-32 object-cover rounded" />
                      <span className="absolute bottom-1 right-1 text-[10px] bg-black/70 text-white rounded px-1">
                        {i + 1}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={reset}>
                    <X size={14} className="mr-1" /> Reprendre
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowCamera(true)}>
                    <Camera size={14} className="mr-1" /> Ajouter des pages
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="upload" className="mt-4">
            {capturedImages.length === 0 ? (
              <div className="border-2 border-dashed rounded-md p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Cliquez pour télécharger un fichier
                </p>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button variant="secondary" className="mt-4" onClick={() => fileInputRef.current?.click()}>
                  Sélectionner un fichier
                </Button>
              </div>
            ) : (
              <div className="relative">
                <img src={capturedImages[0]} alt="Document" className="w-full h-auto rounded-md" />
                <Button variant="destructive" size="icon" className="absolute top-2 right-2" onClick={reset}>
                  <X size={16} />
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      {capturedImages.length > 0 && (
        <CardFooter className="flex flex-col space-y-3">
          {analysis && (
            <div className="w-full p-3 bg-primary/5 border border-primary/20 rounded-md text-sm space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <Brain size={16} className="text-primary" />
                <span className="font-medium">Analyse automatique</span>
              </div>
              <div><strong>Titre :</strong> {analysis.name}</div>
              <div><strong>Catégorie :</strong> {getCategoryInfo(analysis.category).label}</div>
              {analysis.expirationDate && (
                <div className="flex items-center gap-1">
                  <Calendar size={14} /> <strong>Expire le :</strong>{" "}
                  {new Date(analysis.expirationDate).toLocaleDateString("fr-FR")}
                </div>
              )}
            </div>
          )}
          <Button className="w-full" onClick={handleProcess} disabled={isProcessing}>
            {isProcessing ? "Enregistrement..." : "Enregistrer le document"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
