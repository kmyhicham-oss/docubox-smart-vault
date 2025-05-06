
import { DocumentCategory, DocumentType, UserType } from "@/types";
import { addDays } from "date-fns";

const currentUser: UserType = {
  id: "user-1",
  email: "user@example.com",
  createdAt: new Date("2024-01-01")
};

// Fonction pour récupérer les documents depuis localStorage ou utiliser des données par défaut
const getStoredDocuments = (): DocumentType[] => {
  const storedDocs = localStorage.getItem('docuboxDocuments');
  if (storedDocs) {
    try {
      // Parse stored docs and convert date strings back to Date objects
      const parsedDocs = JSON.parse(storedDocs);
      return parsedDocs.map((doc: any) => ({
        ...doc,
        createdAt: new Date(doc.createdAt),
        expirationDate: doc.expirationDate ? new Date(doc.expirationDate) : undefined
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des documents:", error);
      return getDefaultDocuments();
    }
  }
  return getDefaultDocuments();
};

// Données par défaut si localStorage est vide
const getDefaultDocuments = (): DocumentType[] => [
  {
    id: "doc-1",
    userId: currentUser.id,
    name: "Carte d'identité nationale",
    category: "identity",
    filePath: "/documents/card.pdf",
    thumbnailPath: "/images/id-preview.png",
    expirationDate: addDays(new Date(), 45),
    createdAt: new Date("2024-01-15"),
    description: "Carte d'identité renouvelée en janvier 2024"
  },
  {
    id: "doc-2",
    userId: currentUser.id,
    name: "Passeport",
    category: "identity",
    filePath: "/documents/passport.pdf",
    thumbnailPath: "/images/passport-preview.png",
    expirationDate: addDays(new Date(), 730),
    createdAt: new Date("2023-11-20"),
    description: "Passeport valide pour 10 ans"
  },
  {
    id: "doc-3",
    userId: currentUser.id,
    name: "Carte vitale",
    category: "health",
    filePath: "/documents/health-card.pdf",
    thumbnailPath: "/images/health-preview.png",
    createdAt: new Date("2023-12-05")
  },
  {
    id: "doc-4",
    userId: currentUser.id,
    name: "Ordonnance médicale",
    category: "health",
    filePath: "/documents/prescription.pdf",
    thumbnailPath: "/images/prescription-preview.png",
    expirationDate: addDays(new Date(), 5),
    createdAt: new Date("2024-04-25"),
    description: "Ordonnance pour traitement chronique"
  },
  {
    id: "doc-5",
    userId: currentUser.id,
    name: "Carte grise",
    category: "vehicle",
    filePath: "/documents/vehicle-registration.pdf",
    thumbnailPath: "/images/vehicle-preview.png",
    createdAt: new Date("2023-08-12")
  },
  {
    id: "doc-6",
    userId: currentUser.id,
    name: "Assurance auto",
    category: "vehicle",
    filePath: "/documents/car-insurance.pdf",
    thumbnailPath: "/images/insurance-preview.png",
    expirationDate: addDays(new Date(), 15),
    createdAt: new Date("2023-10-30"),
    description: "Police d'assurance tous risques"
  },
  {
    id: "doc-7",
    userId: currentUser.id,
    name: "Bail d'appartement",
    category: "contract",
    filePath: "/documents/lease.pdf",
    thumbnailPath: "/images/lease-preview.png",
    expirationDate: addDays(new Date(), 180),
    createdAt: new Date("2023-07-01"),
    description: "Contrat de location pour 3 ans"
  },
  {
    id: "doc-8",
    userId: currentUser.id,
    name: "Facture internet",
    category: "contract",
    filePath: "/documents/internet-bill.pdf",
    thumbnailPath: "/images/bill-preview.png",
    createdAt: new Date("2024-03-15")
  },
  {
    id: "doc-9",
    userId: currentUser.id,
    name: "Diplôme universitaire",
    category: "other",
    filePath: "/documents/diploma.pdf",
    thumbnailPath: "/images/diploma-preview.png",
    createdAt: new Date("2023-09-10"),
    description: "Master en informatique"
  },
  {
    id: "doc-10",
    userId: currentUser.id,
    name: "Certificat de naissance",
    category: "identity",
    filePath: "/documents/birth-certificate.pdf",
    thumbnailPath: "/images/birth-preview.png",
    createdAt: new Date("2023-06-18")
  },
];

// Initialiser les documents avec localStorage ou valeurs par défaut
let mockDocuments: DocumentType[] = getStoredDocuments();

// Fonction pour sauvegarder les documents dans localStorage
const saveDocumentsToStorage = () => {
  localStorage.setItem('docuboxDocuments', JSON.stringify(mockDocuments));
};

export const mockUser = currentUser;
export { mockDocuments };

export const getExpiringDocuments = () => {
  const now = new Date();
  const thirtyDaysFromNow = addDays(now, 30);
  
  return mockDocuments.filter(doc => 
    doc.expirationDate && 
    doc.expirationDate > now && 
    doc.expirationDate <= thirtyDaysFromNow
  );
};

export const getDocumentsByCategory = (category: DocumentCategory | 'all') => {
  if (category === 'all') {
    return mockDocuments;
  }
  return mockDocuments.filter(doc => doc.category === category);
};

export const searchDocuments = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  
  return mockDocuments.filter(doc => 
    doc.name.toLowerCase().includes(lowercaseQuery) || 
    (doc.description && doc.description.toLowerCase().includes(lowercaseQuery))
  );
};

// Function to add a new document to the mock data
interface NewDocumentData {
  name: string;
  category: DocumentCategory;
  description?: string;
  expirationDate?: Date;
  file: File;
}

export const addDocument = (documentData: NewDocumentData) => {
  // Générer un identifiant unique avec timestamp
  const newId = `doc-${mockDocuments.length + 1}-${Date.now()}`;
  
  // Définir le chemin de la miniature en fonction de la catégorie
  const categoryThumbnails = {
    "identity": "/images/id-preview.png",
    "health": "/images/health-preview.png",
    "vehicle": "/images/vehicle-preview.png",
    "contract": "/images/lease-preview.png",
    "other": "/images/diploma-preview.png"
  };
  
  const newDocument: DocumentType = {
    id: newId,
    userId: currentUser.id,
    name: documentData.name,
    category: documentData.category,
    filePath: `/documents/${documentData.file.name}`,
    thumbnailPath: categoryThumbnails[documentData.category] || "/placeholder.svg",
    expirationDate: documentData.expirationDate,
    description: documentData.description,
    createdAt: new Date()
  };
  
  // Add the new document to the beginning of the array to show it first
  mockDocuments = [newDocument, ...mockDocuments];
  
  // Sauvegarder les documents dans localStorage
  saveDocumentsToStorage();
  
  return newDocument;
};
