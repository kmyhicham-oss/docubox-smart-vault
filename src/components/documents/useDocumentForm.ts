
import { DocumentCategory, DocumentType } from "@/types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { addDocument } from "@/utils/mock-data";

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

  const handleSubmit = (values: DocumentFormValues, file: File | null) => {
    if (!file) {
      toast({
        title: "Fichier requis",
        description: "Veuillez sélectionner un fichier",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Add document to mock data
    addDocument({
      name: values.name,
      category: values.category,
      expirationDate: values.expirationDate,
      description: values.description,
      file
    });

    // Simulate form submission with delay
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Document ajouté",
        description: "Votre document a été ajouté avec succès",
      });
      navigate("/documents");
    }, 1500);
  };

  return {
    form,
    isSubmitting,
    handleSubmit,
  };
}
