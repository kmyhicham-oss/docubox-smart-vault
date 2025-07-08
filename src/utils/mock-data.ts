
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
        created_at: doc.created_at || new Date(doc.createdAt).toISOString(),
        expiration_date: doc.expiration_date || (doc.expirationDate ? new Date(doc.expirationDate).toISOString() : null)
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
    user_id: currentUser.id,
    name: "Carte d'identité nationale",
    category: "identity",
    file_path: "/documents/card.pdf",
    thumbnail_path: "/images/id-preview.png",
    expiration_date: addDays(new Date(), 45).toISOString(),
    created_at: new Date("2024-01-15").toISOString(),
    updated_at: new Date("2024-01-15").toISOString(),
    description: "Carte d'identité renouvelée en janvier 2024"
  },
  {
    id: "doc-2",
    user_id: currentUser.id,
    name: "Passeport",
    category: "identity",
    file_path: "/documents/passport.pdf",
    thumbnail_path: "/images/passport-preview.png",
    expiration_date: addDays(new Date(), 730).toISOString(),
    created_at: new Date("2023-11-20").toISOString(),
    updated_at: new Date("2023-11-20").toISOString(),
    description: "Passeport valide pour 10 ans"
  },
  {
    id: "doc-3",
    user_id: currentUser.id,
    name: "Carte vitale",
    category: "health",
    file_path: "/documents/health-card.pdf",
    thumbnail_path: "/images/health-preview.png",
    expiration_date: null,
    created_at: new Date("2023-12-05").toISOString(),
    updated_at: new Date("2023-12-05").toISOString(),
    description: null
  },
  {
    id: "doc-4",
    user_id: currentUser.id,
    name: "Ordonnance médicale",
    category: "health",
    file_path: "/documents/prescription.pdf",
    thumbnail_path: "/images/prescription-preview.png",
    expiration_date: addDays(new Date(), 5).toISOString(),
    created_at: new Date("2024-04-25").toISOString(),
    updated_at: new Date("2024-04-25").toISOString(),
    description: "Ordonnance pour traitement chronique"
  },
  {
    id: "doc-5",
    user_id: currentUser.id,
    name: "Carte grise",
    category: "vehicle",
    file_path: "/documents/vehicle-registration.pdf",
    thumbnail_path: "/images/vehicle-preview.png",
    expiration_date: null,
    created_at: new Date("2023-08-12").toISOString(),
    updated_at: new Date("2023-08-12").toISOString(),
    description: null
  },
  {
    id: "doc-6",
    user_id: currentUser.id,
    name: "Assurance auto",
    category: "vehicle",
    file_path: "/documents/car-insurance.pdf",
    thumbnail_path: "/images/insurance-preview.png",
    expiration_date: addDays(new Date(), 15).toISOString(),
    created_at: new Date("2023-10-30").toISOString(),
    updated_at: new Date("2023-10-30").toISOString(),
    description: "Police d'assurance tous risques"
  },
  {
    id: "doc-7",
    user_id: currentUser.id,
    name: "Bail d'appartement",
    category: "contract",
    file_path: "/documents/lease.pdf",
    thumbnail_path: "/images/lease-preview.png",
    expiration_date: addDays(new Date(), 180).toISOString(),
    created_at: new Date("2023-07-01").toISOString(),
    updated_at: new Date("2023-07-01").toISOString(),
    description: "Contrat de location pour 3 ans"
  },
  {
    id: "doc-8",
    user_id: currentUser.id,
    name: "Facture internet",
    category: "contract",
    file_path: "/documents/internet-bill.pdf",
    thumbnail_path: "/images/bill-preview.png",
    expiration_date: null,
    created_at: new Date("2024-03-15").toISOString(),
    updated_at: new Date("2024-03-15").toISOString(),
    description: null
  },
  {
    id: "doc-9",
    user_id: currentUser.id,
    name: "Diplôme universitaire",
    category: "other",
    file_path: "/documents/diploma.pdf",
    thumbnail_path: "/images/diploma-preview.png",
    expiration_date: null,
    created_at: new Date("2023-09-10").toISOString(),
    updated_at: new Date("2023-09-10").toISOString(),
    description: "Master en informatique"
  },
  {
    id: "doc-10",
    user_id: currentUser.id,
    name: "Certificat de naissance",
    category: "identity",
    file_path: "/documents/birth-certificate.pdf",
    thumbnail_path: "/images/birth-preview.png",
    expiration_date: null,
    created_at: new Date("2023-06-18").toISOString(),
    updated_at: new Date("2023-06-18").toISOString(),
    description: null
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
    doc.expiration_date && 
    new Date(doc.expiration_date) > now && 
    new Date(doc.expiration_date) <= thirtyDaysFromNow
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
    user_id: currentUser.id,
    name: documentData.name,
    category: documentData.category,
    file_path: `/documents/${documentData.file.name}`,
    thumbnail_path: categoryThumbnails[documentData.category] || "/placeholder.svg",
    expiration_date: documentData.expirationDate ? documentData.expirationDate.toISOString() : null,
    description: documentData.description || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  // Add the new document to the beginning of the array to show it first
  mockDocuments = [newDocument, ...mockDocuments];
  
  // Sauvegarder les documents dans localStorage
  saveDocumentsToStorage();
  
  return newDocument;
};
