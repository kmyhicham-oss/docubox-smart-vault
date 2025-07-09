
import { useRef, useState } from "react";
import { Upload, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploaderProps {
  file: File | null;
  onFileChange: (file: File) => void;
  onAnalyze?: (file: File) => Promise<void>;
  isAnalyzing?: boolean;
}

export function FileUploader({ file, onFileChange, onAnalyze, isAnalyzing = false }: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileChange(selectedFile);
      
      // Analyser automatiquement si c'est une image
      if (selectedFile.type.startsWith('image/') && onAnalyze) {
        await onAnalyze(selectedFile);
      }
    }
  };

  const handleAnalyzeClick = async () => {
    if (file && onAnalyze) {
      await onAnalyze(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-10 text-center cursor-pointer relative">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center space-y-2"
        >
          <div className="bg-muted rounded-full p-3">
            <Upload size={32} className="text-muted-foreground" />
          </div>
          <div className="text-lg font-medium">
            {file ? file.name : "Téléverser un fichier"}
          </div>
          <p className="text-sm text-muted-foreground">
            {file 
              ? `${(file.size / 1024 / 1024).toFixed(2)} MB` 
              : "PNG, JPG ou PDF (max. 10MB)"}
          </p>
        </div>
      </div>
      
      {file && file.type.startsWith('image/') && onAnalyze && (
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={handleAnalyzeClick}
            disabled={isAnalyzing}
            className="flex items-center gap-2"
          >
            <Brain size={16} />
            {isAnalyzing ? "Analyse en cours..." : "Analyser et classer automatiquement"}
          </Button>
        </div>
      )}
    </div>
  );
}
