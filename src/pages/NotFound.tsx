
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-center">
      <div className="mb-6 text-blue-500">
        <FileQuestion size={100} />
      </div>
      <h1 className="text-4xl font-bold mb-2">Page introuvable</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Button asChild>
        <Link to="/">Retour à l'accueil</Link>
      </Button>
    </div>
  );
}
