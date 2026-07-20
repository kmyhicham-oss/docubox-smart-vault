
import { DocumentCategory } from "@/types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { addDocument } from "@/services/documentService";
import { useDocumentAnalysis } from "@/hooks/useDocumentAnalysis";

const formSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  category: z.string().min(1, "Catégorie requise"),
  expirationDate: z.date().optional(),
  description: z.string().optional(),
  file: z.any().optional(),
  file_path: z.string().optional(),
});

export type DocumentFormValues = z.infer<typeof formSchema>;

export function useDocumentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { analyzeDocument } = useDocumentAnalysis();
  
  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "identity",
      description: "",
    },
  });

  const analyzeAndSuggest = async (file: File) => {
    try {
      toast({
        title: "Analyse en cours...",
        description: "Extraction du texte et classification automatique",
      });

      const analysis = await analyzeDocument(file);
      
      // Mettre à jour le formulaire avec les suggestions
      form.setValue("name", analysis.suggestedName);
      form.setValue("category", analysis.suggestedCategory);
      
      // Ajouter le texte extrait comme description si disponible
      if (analysis.text && analysis.text.length > 20) {
        const extractedPreview = analysis.text.substring(0, 200) + (analysis.text.length > 200 ? "..." : "");
        form.setValue("description", `Texte extrait: ${extractedPreview}`);
      }

      toast({
        title: "Analyse terminée",
        description: `Document classé comme "${analysis.suggestedCategory}" avec ${Math.round(analysis.confidence)}% de confiance`,
      });

      return analysis;
    } catch (error) {
      console.error("Erreur lors de l'analyse:", error);
      toast({
        title: "Erreur d'analyse",
        description: "Impossible d'analyser le document. Veuillez remplir manuellement.",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleSubmit = async (values: DocumentFormValues, file: File | null) => {
    if (!file && !values.file_path) {
      toast({
        title: "Fichier requis",
        description: "Veuillez sélectionner un fichier ou importer depuis Google Drive",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Ajout du document via Supabase
      const result = await addDocument({
        name: values.name,
        category: values.category,
        expiration_date: values.expirationDate ? values.expirationDate.toISOString() : null,
        description: values.description,
        user_id: '', // This should be set by the addDocument function
        file_path: values.file_path || '',
        thumbnail_path: '',
        updated_at: new Date().toISOString()
      }, file);

      if (result.success) {
        toast({
          title: "Document ajouté",
          description: "Votre document a été ajouté avec succès",
        });
        navigate("/documents");
      } else {
        throw result.error;
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du document:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du document.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    handleSubmit,
    analyzeAndSuggest,
  };
}
