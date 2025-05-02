
import { DocumentCategory, DocumentType, UserType } from "@/types";
import { addDays } from "date-fns";

const currentUser: UserType = {
  id: "user-1",
  email: "user@example.com",
  createdAt: new Date("2024-01-01")
};

const generateMockDocuments = (): DocumentType[] => {
  return [
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
};

export const mockUser = currentUser;
export const mockDocuments = generateMockDocuments();

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
