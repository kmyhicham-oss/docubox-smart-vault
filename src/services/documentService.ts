
import { supabase } from "@/integrations/supabase/client";
import { DocumentCategory, DocumentType } from "@/types";
import { v4 as uuidv4 } from 'uuid';

export async function getDocuments() {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Erreur lors de la récupération des documents:", error);
    return [];
  }

  // Conversion des données retournées par Supabase au format DocumentType
  return data.map(doc => ({
    id: doc.id,
    userId: doc.user_id,
    name: doc.name,
    category: doc.category as DocumentCategory,
    filePath: doc.file_path,
    thumbnailPath: doc.thumbnail_path,
    expirationDate: doc.expiration_date ? new Date(doc.expiration_date) : undefined,
    createdAt: new Date(doc.created_at),
    description: doc.description,
  })) as DocumentType[];
}

export async function getDocumentsByCategory(category: DocumentCategory | 'all') {
  if (category === 'all') {
    return getDocuments();
  }

  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Erreur lors de la récupération des documents de catégorie ${category}:`, error);
    return [];
  }

  // Conversion des données retournées par Supabase au format DocumentType
  return data.map(doc => ({
    id: doc.id,
    userId: doc.user_id,
    name: doc.name,
    category: doc.category as DocumentCategory,
    filePath: doc.file_path,
    thumbnailPath: doc.thumbnail_path,
    expirationDate: doc.expiration_date ? new Date(doc.expiration_date) : undefined,
    createdAt: new Date(doc.created_at),
    description: doc.description,
  })) as DocumentType[];
}

export async function getDocumentById(id: string) {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Erreur lors de la récupération du document ${id}:`, error);
    return null;
  }

  // Conversion des données retournées par Supabase au format DocumentType
  return {
    id: data.id,
    userId: data.user_id,
    name: data.name,
    category: data.category as DocumentCategory,
    filePath: data.file_path,
    thumbnailPath: data.thumbnail_path,
    expirationDate: data.expiration_date ? new Date(data.expiration_date) : undefined,
    createdAt: new Date(data.created_at),
    description: data.description,
  } as DocumentType;
}

export async function searchDocuments(query: string) {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Erreur lors de la recherche de documents:", error);
    return [];
  }

  // Conversion des données retournées par Supabase au format DocumentType
  return data.map(doc => ({
    id: doc.id,
    userId: doc.user_id,
    name: doc.name,
    category: doc.category as DocumentCategory,
    filePath: doc.file_path,
    thumbnailPath: doc.thumbnail_path,
    expirationDate: doc.expiration_date ? new Date(doc.expiration_date) : undefined,
    createdAt: new Date(doc.created_at),
    description: doc.description,
  })) as DocumentType[];
}

export async function getExpiringDocuments() {
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .lt('expiration_date', thirtyDaysFromNow.toISOString())
    .gt('expiration_date', new Date().toISOString())
    .order('expiration_date', { ascending: true });

  if (error) {
    console.error("Erreur lors de la récupération des documents expirant bientôt:", error);
    return [];
  }

  // Conversion des données retournées par Supabase au format DocumentType
  return data.map(doc => ({
    id: doc.id,
    userId: doc.user_id,
    name: doc.name,
    category: doc.category as DocumentCategory,
    filePath: doc.file_path,
    thumbnailPath: doc.thumbnail_path,
    expirationDate: doc.expiration_date ? new Date(doc.expiration_date) : undefined,
    createdAt: new Date(doc.created_at),
    description: doc.description,
  })) as DocumentType[];
}

export async function addDocument({ name, category, expirationDate, description, file }: {
  name: string;
  category: DocumentCategory;
  expirationDate?: Date;
  description?: string;
  file: File;
}) {
  try {
    // 1. On récupère l'utilisateur connecté
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Utilisateur non connecté");
    }

    // 2. On génère un identifiant unique pour le document
    const documentId = uuidv4();
    
    // 3. On définit le chemin de stockage du fichier (userId/documentId.extension)
    const fileExtension = file.name.split('.').pop();
    const filePath = `${user.id}/${documentId}.${fileExtension}`;
    
    // 4. On upload le fichier dans le bucket "documents"
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);
    
    if (uploadError) {
      throw uploadError;
    }

    // 5. On génère un thumbnail pour les fichiers image
    let thumbnailPath = null;
    if (file.type.startsWith('image/')) {
      thumbnailPath = filePath; // Pour simplifier, on utilise le même chemin
    }
    
    // 6. On crée l'entrée dans la base de données
    const { error: insertError } = await supabase
      .from('documents')
      .insert({
        id: documentId,
        user_id: user.id,
        name,
        category,
        description,
        expiration_date: expirationDate,
        file_path: filePath,
        thumbnail_path: thumbnailPath
      });
    
    if (insertError) {
      throw insertError;
    }
    
    return { success: true, documentId };
  } catch (error) {
    console.error("Erreur lors de l'ajout du document:", error);
    return { success: false, error };
  }
}

export async function updateDocument(id: string, updates: Partial<DocumentType>) {
  const { error } = await supabase
    .from('documents')
    .update(updates)
    .eq('id', id);
    
  if (error) {
    console.error(`Erreur lors de la mise à jour du document ${id}:`, error);
    return { success: false, error };
  }
  
  return { success: true };
}

export async function deleteDocument(id: string) {
  // On récupère d'abord le document pour avoir le chemin du fichier
  const { data: document } = await supabase
    .from('documents')
    .select('file_path')
    .eq('id', id)
    .single();
    
  if (document && document.file_path) {
    // On supprime le fichier du stockage
    const { error: storageError } = await supabase.storage
      .from('documents')
      .remove([document.file_path]);
      
    if (storageError) {
      console.error(`Erreur lors de la suppression du fichier ${document.file_path}:`, storageError);
    }
  }
  
  // On supprime l'entrée de la base de données
  const { error: dbError } = await supabase
    .from('documents')
    .delete()
    .eq('id', id);
    
  if (dbError) {
    console.error(`Erreur lors de la suppression du document ${id}:`, dbError);
    return { success: false, error: dbError };
  }
  
  return { success: true };
}

// Fonction pour télécharger un document
export async function downloadDocument(documentId: string, fileName: string) {
  try {
    // On récupère le chemin du fichier
    const { data: document, error: fetchError } = await supabase
      .from('documents')
      .select('file_path')
      .eq('id', documentId)
      .single();
    
    if (fetchError || !document) {
      throw fetchError || new Error("Document introuvable");
    }
    
    // On télécharge le fichier
    const { data, error: downloadError } = await supabase.storage
      .from('documents')
      .download(document.file_path);
      
    if (downloadError) {
      throw downloadError;
    }
    
    // On crée un lien de téléchargement
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // On met à jour la liste des documents téléchargés
    const downloadedFiles = JSON.parse(localStorage.getItem('downloadedDocuments') || '[]');
    if (!downloadedFiles.includes(documentId)) {
      downloadedFiles.push(documentId);
      localStorage.setItem('downloadedDocuments', JSON.stringify(downloadedFiles));
    }
    
    return { success: true };
  } catch (error) {
    console.error("Erreur lors du téléchargement du document:", error);
    return { success: false, error };
  }
}
