import { DocumentCategory } from "@/types";
import { extractExpirationDate } from "./dateExtractor";

// Keywords per category — order matters for tiebreaks (first hit wins on equal score)
const CATEGORY_KEYWORDS: Record<Exclude<DocumentCategory, "vehicle" | "contract" | "other">, string[]> = {
  health: [
    "ordonnance", "prescription", "posologie", "médicament", "medecin", "médecin",
    "hopital", "hôpital", "clinique", "cabinet médical", "analyses", "laboratoire",
    "biologie", "sanguin", "sérologie", "vaccin", "vaccination", "irm", "scanner",
    "radio", "radiographie", "bilan santé", "cpam", "ameli", "assurance maladie",
    "sécurité sociale", "carte vitale", "mutuelle", "tiers payant",
  ],
  identity: [
    "carte nationale", "carte d'identité", "carte identité", "cni",
    "passeport", "passport", "permis de conduire", "permis conduire",
    "république française", "visa", "titre de séjour", "nationalité",
    "préfecture", "date de naissance", "lieu de naissance",
  ],
  finance: [
    "facture", "invoice", "reçu", "recu", "quittance", "loyer",
    "relevé de compte", "releve bancaire", "relevé bancaire", "iban", "bic",
    "virement", "prélèvement", "solde", "montant ttc", "montant ht", "tva",
    "banque", "crédit agricole", "bnp", "société générale", "caisse d'épargne",
  ],
  realestate: [
    "bail", "location", "propriétaire", "locataire", "acte de propriété",
    "titre de propriété", "compromis de vente", "acte de vente", "notaire",
    "diagnostic", "dpe", "amiante", "plomb", "surface habitable",
    "carrez", "copropriété", "syndic",
  ],
  work: [
    "contrat de travail", "cdi", "cdd", "employeur", "salarié", "salarie",
    "bulletin de paie", "bulletin de salaire", "fiche de paie", "salaire brut",
    "salaire net", "convention collective", "lettre d'embauche", "période d'essai",
    "urssaf", "pôle emploi",
  ],
  education: [
    "diplôme", "diplome", "baccalauréat", "licence", "master", "doctorat",
    "relevé de notes", "bulletin scolaire", "certificat de scolarité",
    "université", "université", "école", "attestation de réussite",
    "brevet", "cap", "bep",
  ],
  insurance: [
    "police d'assurance", "police assurance", "contrat d'assurance",
    "attestation d'assurance", "avis d'échéance", "cotisation",
    "franchise", "garantie", "sinistre", "assureur", "maif", "matmut",
    "axa", "groupama", "allianz",
  ],
  transport: [
    "carte grise", "certificat d'immatriculation", "immatriculation",
    "assurance auto", "assurance véhicule", "contrôle technique",
    "vignette", "crit'air", "véhicule", "moto", "voiture",
  ],
  utilities: [
    "edf", "engie", "enedis", "veolia", "suez", "eau potable",
    "consommation kwh", "kwh", "abonnement électricité", "gaz",
    "orange", "sfr", "bouygues", "free", "abonnement internet",
    "abonnement mobile", "forfait mobile",
  ],
};

// Sub-type detection: keyword → suggested title
const SUBTYPE_RULES: Array<{ keywords: string[]; title: string; category: DocumentCategory }> = [
  { keywords: ["passeport", "passport"], title: "Passeport", category: "identity" },
  { keywords: ["permis"], title: "Permis de conduire", category: "identity" },
  { keywords: ["carte d'identité", "carte identité", "cni", "carte nationale"], title: "Carte d'identité", category: "identity" },
  { keywords: ["visa"], title: "Visa", category: "identity" },
  { keywords: ["titre de séjour"], title: "Titre de séjour", category: "identity" },
  { keywords: ["carte vitale"], title: "Carte vitale", category: "health" },
  { keywords: ["ordonnance", "prescription"], title: "Ordonnance", category: "health" },
  { keywords: ["vaccin"], title: "Certificat de vaccination", category: "health" },
  { keywords: ["analyses", "biologie", "sanguin"], title: "Analyses médicales", category: "health" },
  { keywords: ["irm"], title: "Résultat IRM", category: "health" },
  { keywords: ["scanner", "radio"], title: "Résultat imagerie", category: "health" },
  { keywords: ["mutuelle"], title: "Carte mutuelle", category: "health" },
  { keywords: ["carte grise", "immatriculation"], title: "Carte grise", category: "transport" },
  { keywords: ["contrôle technique"], title: "Contrôle technique", category: "transport" },
  { keywords: ["assurance auto"], title: "Assurance auto", category: "transport" },
  { keywords: ["bail", "location"], title: "Bail de location", category: "realestate" },
  { keywords: ["titre de propriété", "acte de propriété"], title: "Titre de propriété", category: "realestate" },
  { keywords: ["diagnostic", "dpe"], title: "Diagnostic immobilier", category: "realestate" },
  { keywords: ["bulletin de paie", "bulletin de salaire", "fiche de paie"], title: "Bulletin de salaire", category: "work" },
  { keywords: ["contrat de travail", "cdi", "cdd"], title: "Contrat de travail", category: "work" },
  { keywords: ["lettre d'embauche"], title: "Lettre d'embauche", category: "work" },
  { keywords: ["diplôme", "diplome"], title: "Diplôme", category: "education" },
  { keywords: ["certificat de scolarité"], title: "Certificat de scolarité", category: "education" },
  { keywords: ["relevé de notes", "bulletin scolaire"], title: "Relevé de notes", category: "education" },
  { keywords: ["quittance", "loyer"], title: "Quittance de loyer", category: "finance" },
  { keywords: ["relevé bancaire", "releve bancaire", "relevé de compte"], title: "Relevé bancaire", category: "finance" },
  { keywords: ["facture", "invoice"], title: "Facture", category: "finance" },
  { keywords: ["reçu", "recu"], title: "Reçu", category: "finance" },
  { keywords: ["edf", "engie", "enedis", "kwh", "électricité"], title: "Facture électricité", category: "utilities" },
  { keywords: ["eau", "veolia", "suez"], title: "Facture eau", category: "utilities" },
  { keywords: ["orange", "sfr", "bouygues", "free", "forfait", "abonnement mobile"], title: "Abonnement télécom", category: "utilities" },
  { keywords: ["police d'assurance", "police assurance", "avis d'échéance", "attestation d'assurance"], title: "Contrat d'assurance", category: "insurance" },
];

export interface ClassificationResult {
  category: DocumentCategory;
  confidence: number;
  matchedKeywords: string[];
  suggestedName: string;
  extractedDate?: string; // ISO
}

export function classifyDocument(text: string): ClassificationResult {
  const lower = text.toLowerCase();

  const scores: Array<{ category: DocumentCategory; score: number; matched: string[] }> = [];
  (Object.entries(CATEGORY_KEYWORDS) as [DocumentCategory, string[]][]).forEach(([cat, kws]) => {
    const matched: string[] = [];
    let score = 0;
    for (const kw of kws) {
      if (lower.includes(kw.toLowerCase())) {
        matched.push(kw);
        score += kw.length > 6 ? 3 : kw.length > 3 ? 2 : 1;
      }
    }
    if (matched.length) scores.push({ category: cat, score, matched });
  });

  scores.sort((a, b) => b.score - a.score);
  const best = scores[0];

  // Find sub-type for a better title, preferring rules that share category with best
  let title = "";
  let finalCategory: DocumentCategory = best?.category ?? "other";
  const candidateRule = SUBTYPE_RULES.find(
    (r) => r.category === finalCategory && r.keywords.some((k) => lower.includes(k))
  ) || SUBTYPE_RULES.find((r) => r.keywords.some((k) => lower.includes(k)));

  if (candidateRule) {
    title = candidateRule.title;
    if (!best) finalCategory = candidateRule.category;
  } else {
    title = `Document ${new Date().toLocaleDateString("fr-FR")}`;
  }

  const extractedDate = extractExpirationDate(text);
  const confidence = best ? Math.min(best.score * 12, 100) : 0;

  return {
    category: finalCategory,
    confidence,
    matchedKeywords: best?.matched ?? [],
    suggestedName: title,
    extractedDate,
  };
}
