import { DocumentCategory } from "@/types";
import {
  IdCard,
  Heart,
  Car,
  FileText,
  Folder,
  Wallet,
  Home,
  Briefcase,
  GraduationCap,
  Shield,
  Zap,
  type LucideIcon,
} from "lucide-react";

export interface CategoryDef {
  id: DocumentCategory;
  label: string;
  icon: LucideIcon;
  color: string; // utility class from index.css
  hex: string; // for charts
  subtypes: string[];
}

export const CATEGORIES: Record<string, CategoryDef> = {
  health: {
    id: "health",
    label: "Santé",
    icon: Heart,
    color: "category-health",
    hex: "#4CAF50",
    subtypes: [
      "Ordonnance",
      "Analyses",
      "Vaccination",
      "Bilan santé",
      "IRM / Scanner",
      "Carte vitale",
      "Mutuelle",
    ],
  },
  identity: {
    id: "identity",
    label: "Identité",
    icon: IdCard,
    color: "category-identity",
    hex: "#FF6B6B",
    subtypes: ["Passeport", "Carte d'identité", "Permis", "Visa", "Titre de séjour"],
  },
  finance: {
    id: "finance",
    label: "Finance",
    icon: Wallet,
    color: "category-finance",
    hex: "#F59E0B",
    subtypes: ["Facture", "Reçu", "Relevé bancaire", "Quittance de loyer"],
  },
  realestate: {
    id: "realestate",
    label: "Immobilier",
    icon: Home,
    color: "category-realestate",
    hex: "#0EA5E9",
    subtypes: ["Bail", "Titre de propriété", "Contrat d'achat", "Diagnostic"],
  },
  work: {
    id: "work",
    label: "Travail",
    icon: Briefcase,
    color: "category-work",
    hex: "#8B5CF6",
    subtypes: ["Contrat de travail", "Bulletin de salaire", "Lettre d'embauche"],
  },
  education: {
    id: "education",
    label: "Éducation",
    icon: GraduationCap,
    color: "category-education",
    hex: "#EC4899",
    subtypes: ["Diplôme", "Certificat de scolarité", "Relevé de notes"],
  },
  insurance: {
    id: "insurance",
    label: "Assurance",
    icon: Shield,
    color: "category-insurance",
    hex: "#7E57C2",
    subtypes: ["Contrat", "Attestation", "Police", "Avis d'échéance"],
  },
  transport: {
    id: "transport",
    label: "Transport",
    icon: Car,
    color: "category-transport",
    hex: "#FFA726",
    subtypes: ["Carte grise", "Assurance auto", "Contrôle technique"],
  },
  utilities: {
    id: "utilities",
    label: "Utilitaires",
    icon: Zap,
    color: "category-utilities",
    hex: "#06B6D4",
    subtypes: ["Facture EDF / eau", "Contrat téléphone / internet"],
  },
  other: {
    id: "other",
    label: "Autres",
    icon: Folder,
    color: "category-other",
    hex: "#607D8B",
    subtypes: [],
  },
};

// Legacy aliases so older stored data keeps working
const LEGACY_ALIASES: Record<string, keyof typeof CATEGORIES> = {
  vehicle: "transport",
  contract: "insurance",
};

export type CategoryKey = keyof typeof CATEGORIES;

export const normalizeCategory = (category: string): CategoryKey => {
  if (category in CATEGORIES) return category as CategoryKey;
  if (category in LEGACY_ALIASES) return LEGACY_ALIASES[category];
  return "other";
};

export const getCategoryInfo = (category: string): CategoryDef => {
  return CATEGORIES[normalizeCategory(category)];
};

export const getAllCategories = (): CategoryDef[] => Object.values(CATEGORIES);
