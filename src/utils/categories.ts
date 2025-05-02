
import { DocumentCategory } from "@/types";
import { 
  IdCard, 
  Heart, 
  Car, 
  FileText, 
  Folder,
  type LucideIcon
} from "lucide-react";

export const CATEGORIES = {
  identity: {
    id: 'identity',
    label: 'Identité',
    icon: IdCard,
    color: 'category-identity'
  },
  health: {
    id: 'health',
    label: 'Santé',
    icon: Heart,
    color: 'category-health'
  },
  vehicle: {
    id: 'vehicle',
    label: 'Véhicule',
    icon: Car,
    color: 'category-vehicle'
  },
  contract: {
    id: 'contract',
    label: 'Contrats',
    icon: FileText,
    color: 'category-contract'
  },
  other: {
    id: 'other',
    label: 'Autres',
    icon: Folder,
    color: 'category-other'
  }
} as const;

export type CategoryKey = keyof typeof CATEGORIES;

export const getCategoryInfo = (category: DocumentCategory) => {
  return CATEGORIES[category as CategoryKey];
};

export const getAllCategories = () => {
  return Object.values(CATEGORIES);
};
