
import { Download } from "lucide-react";
import { useState, useEffect } from "react";

interface DocumentImageProps {
  imageUrlFn: () => Promise<string>;
  isDownloaded: boolean;
}

export function DocumentImage({ imageUrlFn, isDownloaded }: DocumentImageProps) {
  const [imageUrl, setImageUrl] = useState<string>("/placeholder.svg");
  
  useEffect(() => {
    const loadImage = async () => {
      const url = await imageUrlFn();
      setImageUrl(url);
    };
    
    loadImage();
  }, [imageUrlFn]);
  
  return (
    <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden relative">
      <img 
        src={imageUrl} 
        alt="Document preview" 
        className="w-full h-full object-cover" 
        onError={(e) => {
          console.log("Image failed to load:", imageUrl);
          // If image fails to load, replace with default placeholder
          (e.target as HTMLImageElement).src = "/placeholder.svg";
        }}
      />
      
      {/* Downloaded indicator badge */}
      {isDownloaded && (
        <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-medium shadow">
          <Download className="inline-block mr-1" size={12} />
          Téléchargé
        </div>
      )}
    </div>
  );
}
