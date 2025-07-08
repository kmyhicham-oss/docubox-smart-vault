
import { DocumentCategory } from "@/types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { addDocument } from "@/services/documentService";

const formSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  category: z.enum(["identity", "health", "vehicle", "contract", "other"] as const),
  expirationDate: z.date().optional(),
  description: z.string().optional(),
  file: z.any().optional(),
});

export type DocumentFormValues = z.infer<typeof formSchema>;

export function useDocumentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "identity",
      description: "",
    },
  });

  const handleSubmit = async (values: DocumentFormValues, file: File | null) => {
    if (!file) {
      toast({
        title: "Fichier requis",
        description: "Veuillez sélectionner un fichier",
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
        file_path: '',
        thumbnail_path: '',
        updated_at: new Date().toISOString()
      });

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
  };
}
