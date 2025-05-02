
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { DocumentCategory } from "@/types";
import { CATEGORIES } from "@/utils/categories";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  category: z.enum(["identity", "health", "vehicle", "contract", "other"] as const),
  expirationDate: z.date().optional(),
  description: z.string().optional(),
  file: z.any().optional(),
});

export function DocumentForm() {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "identity",
      description: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!file) {
      toast({
        title: "Fichier requis",
        description: "Veuillez sélectionner un fichier",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Document ajouté",
        description: "Votre document a été ajouté avec succès",
      });
      navigate("/documents");
    }, 1500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              <FormItem>
                <FormLabel>Catégorie</FormLabel>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5"
                >
                  {Object.entries(CATEGORIES).map(([key, category]) => {
                    const Icon = category.icon;
                    return (
                      <FormItem key={key}>
                        <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                          <FormControl>
                            <input
                              type="radio"
                              value={key}
                              className="sr-only"
                              checked={field.value === key}
                            />
                          </FormControl>
                          <div className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:border-accent ${field.value === key ? 'border-primary' : ''}`}>
                            <Icon className={cn("mb-3 h-6 w-6", field.value === key ? "text-primary" : "text-muted-foreground")} />
                            <span className="text-xs font-medium leading-none">
                              {category.label}
                            </span>
                          </div>
                        </FormLabel>
                      </FormItem>
                    );
                  })}
                </RadioGroup>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expirationDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date d'expiration</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: fr })
                        ) : (
                          <span>Sélectionner une date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date() || date > new Date("2100-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Facultative - pour recevoir des notifications avant expiration
                </FormDescription>
                <FormMessage />
              </FormItem>
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
