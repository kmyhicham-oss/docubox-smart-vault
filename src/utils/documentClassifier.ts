import { DocumentCategory } from "@/types";

// Mots-clés pour chaque catégorie
const CATEGORY_KEYWORDS = {
  identity: [
    'carte identité', 'identité', 'passeport', 'permis conduire', 
    'carte vitale', 'cni', 'préfecture', 'nationalité', 'né', 'née',
    'carte nationale', 'république française', 'id card', 'driving license'
  ],
  health: [
    'santé', 'médical', 'ordonnance', 'médecin', 'hôpital', 'clinique',
    'assurance maladie', 'sécurité sociale', 'mutuelle', 'prescription',
    'analyses', 'radio', 'scanner', 'irm', 'vaccination', 'vaccin',
    'carte vitale', 'cpam', 'ameli'
  ],
  vehicle: [
    'véhicule', 'voiture', 'auto', 'moto', 'assurance auto', 'carte grise',
    'permis conduire', 'contrôle technique', 'garage', 'réparation',
    'immatriculation', 'certificat', 'automobile', 'transport'
  ],
  contract: [
    'contrat', 'bail', 'location', 'assurance', 'banque', 'crédit',
    'prêt', 'hypothèque', 'signature', 'accord', 'convention',
    'police assurance', 'garantie', 'souscription', 'avenant'
  ],
  other: []
} as const;

export interface ClassificationResult {
  category: DocumentCategory;
  confidence: number;
  matchedKeywords: string[];
  suggestedName?: string;
}

export function classifyDocument(text: string): ClassificationResult {
  const lowerText = text.toLowerCase();
  const results: Array<{
    category: DocumentCategory;
    score: number;
    matchedKeywords: string[];
  }> = [];

  // Analyser chaque catégorie
  (Object.entries(CATEGORY_KEYWORDS) as Array<[DocumentCategory, readonly string[]]>).forEach(([category, keywords]) => {
    if (category === 'other') return;
    
    const matchedKeywords: string[] = [];
    let score = 0;

    keywords.forEach((keyword: string) => {
      if (lowerText.includes(keyword.toLowerCase())) {
        matchedKeywords.push(keyword);
        // Score plus élevé pour les mots-clés plus spécifiques
        score += keyword.length > 5 ? 2 : 1;
      }
    });

    if (matchedKeywords.length > 0) {
      results.push({
        category: category as DocumentCategory,
        score,
        matchedKeywords
      });
    }
  });

  // Trier par score et retourner le meilleur résultat
  results.sort((a, b) => b.score - a.score);

  if (results.length === 0) {
    return {
      category: 'other',
      confidence: 0,
      matchedKeywords: []
    };
  }

  const best = results[0];
  const confidence = Math.min((best.score / Math.max(best.matchedKeywords.length, 1)) * 20, 100);

  // Suggérer un nom basé sur les mots-clés trouvés
  const suggestedName = generateDocumentName(best.category, best.matchedKeywords, text);

  return {
    category: best.category,
    confidence,
    matchedKeywords: best.matchedKeywords,
    suggestedName
  };
}

function generateDocumentName(category: DocumentCategory, keywords: string[], text: string): string {
  const date = new Date().toLocaleDateString('fr-FR');
  
  switch (category) {
    case 'identity':
      if (keywords.some(k => k.includes('passeport'))) return `Passeport - ${date}`;
      if (keywords.some(k => k.includes('permis'))) return `Permis de conduire - ${date}`;
      if (keywords.some(k => k.includes('carte'))) return `Carte d'identité - ${date}`;
      return `Document d'identité - ${date}`;
      
    case 'health':
      if (keywords.some(k => k.includes('ordonnance'))) return `Ordonnance - ${date}`;
      if (keywords.some(k => k.includes('vaccination'))) return `Certificat de vaccination - ${date}`;
      if (keywords.some(k => k.includes('analyses'))) return `Analyses médicales - ${date}`;
      return `Document médical - ${date}`;
      
    case 'vehicle':
      if (keywords.some(k => k.includes('carte grise'))) return `Carte grise - ${date}`;
      if (keywords.some(k => k.includes('assurance'))) return `Assurance automobile - ${date}`;
      if (keywords.some(k => k.includes('contrôle'))) return `Contrôle technique - ${date}`;
      return `Document véhicule - ${date}`;
      
    case 'contract':
      if (keywords.some(k => k.includes('bail'))) return `Bail de location - ${date}`;
      if (keywords.some(k => k.includes('assurance'))) return `Contrat d'assurance - ${date}`;
      if (keywords.some(k => k.includes('crédit'))) return `Contrat de crédit - ${date}`;
      return `Contrat - ${date}`;
      
    default:
      return `Document - ${date}`;
  }
}