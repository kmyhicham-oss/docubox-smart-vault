import { supabase } from "@/integrations/supabase/client";
import { DocumentType } from "@/types";

export async function getDocuments() {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching documents:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Unexpected error fetching documents:", error);
    throw error;
  }
}

export async function addDocument(document: Omit<DocumentType, 'id' | 'created_at'>) {
  try {
    const { data, error } = await supabase
      .from('documents')
      .insert([document])
      .select();

    if (error) {
      console.error("Error adding document:", error);
      throw error;
    }

    return data ? data[0] as DocumentType : null;
  } catch (error) {
    console.error("Unexpected error adding document:", error);
    throw error;
  }
}

export async function getDocumentById(id: string) {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error fetching document by ID:", error);
      throw error;
    }

    return data as DocumentType;
  } catch (error) {
    console.error("Unexpected error fetching document by ID:", error);
    throw error;
  }
}

export async function updateDocument(id: string, updates: Partial<DocumentType>) {
  try {
    const { data, error } = await supabase
      .from('documents')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) {
      console.error("Error updating document:", error);
      throw error;
    }

    return data ? data[0] as DocumentType : null;
  } catch (error) {
    console.error("Unexpected error updating document:", error);
    throw error;
  }
}

export async function deleteDocument(id: string) {
  try {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting document:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Unexpected error deleting document:", error);
    throw error;
  }
}

export async function generatePDF(document: DocumentType) {
  try {
    const response = {
      file_path: `generated_pdfs/${document.id}.pdf`,
      url: URL.createObjectURL(new Blob([`PDF Content for ${document.title}`], { type: 'application/pdf' }))
    };
    
    return response;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}
