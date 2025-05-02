
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { DocumentCategory } from "@/types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FileUploader } from "./FileUploader";
import { CategorySelector } from "./CategorySelector";
import { ExpirationDatePicker } from "./ExpirationDatePicker";
import { DocumentFormValues, useDocumentForm } from "./useDocumentForm";

export function DocumentForm() {
  const [file, setFile] = useState<File | null>(null);
  const { form, isSubmitting, handleSubmit } = useDocumentForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(values => handleSubmit(values, file))} className="space-y-6">
        <FileUploader 
          file={file} 
          onFileChange={setFile}
        />

        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom du document</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Carte d'identité nationale" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <CategorySelector 
                value={field.value} 
                onChange={field.onChange} 
              />
            )}
          />

          <FormField
            control={form.control}
            name="expirationDate"
            render={({ field }) => (
              <ExpirationDatePicker
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (facultative)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Informations supplémentaires concernant ce document..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Traitement en cours..." : "Ajouter le document"}
        </Button>
      </form>
    </Form>
  );
}
