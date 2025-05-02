
import { useRef, useState } from "react";
import { Upload } from "lucide-react";

interface FileUploaderProps {
  file: File | null;
  onFileChange: (file: File) => void;
}

export function FileUploader({ file, onFileChange }: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileChange(selectedFile);
    }
  };

  return (
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
  );
}
