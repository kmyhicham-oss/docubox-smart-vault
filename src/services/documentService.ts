
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

export async function getDocumentsByCategory(category: string) {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching documents by category:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Unexpected error fetching documents by category:", error);
    throw error;
  }
}

export async function searchDocuments(query: string) {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .ilike('name', `%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error searching documents:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Unexpected error searching documents:", error);
    throw error;
  }
}

export async function addDocument(document: Omit<DocumentType, 'id' | 'created_at'>, file?: File | null) {
  try {
    let filePath = document.file_path || '';
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Upload file to Supabase storage if provided
    if (file) {
      const timestamp = Date.now();
      const storagePath = `${user.id}/${timestamp}-${file.name}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(storagePath, file);

      if (uploadError) {
        throw new Error(`Failed to upload file: ${uploadError.message}`);
      }

      filePath = storagePath;
    }

    const dbDocument = {
      name: document.name,
      description: document.description || '',
      category: document.category,
      expiration_date: document.expiration_date || null,
      file_path: filePath,
      thumbnail_path: document.thumbnail_path || '',
      user_id: document.user_id || user.id,
    };

    const { data, error } = await supabase
      .from('documents')
      .insert([dbDocument])
      .select();

    if (error) {
      console.error("Error adding document:", error);
      return { success: false, error };
    }

    // Map back to DocumentType
    const newDoc = data ? mapToDocumentType(data[0]) : null;
    return { success: true, document: newDoc };
  } catch (error) {
    console.error("Unexpected error adding document:", error);
    return { success: false, error };
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

    return mapToDocumentType(data);
  } catch (error) {
    console.error("Unexpected error fetching document by ID:", error);
    throw error;
  }
}

export async function updateDocument(id: string, updates: Partial<DocumentType>) {
  try {
    // Convert to database format expected by Supabase
    const dbUpdates: any = {};
    
    if (updates.name) dbUpdates.name = updates.name;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.category) dbUpdates.category = updates.category;
    if (updates.expiration_date !== undefined) dbUpdates.expiration_date = updates.expiration_date;
    if (updates.file_path !== undefined) dbUpdates.file_path = updates.file_path;
    if (updates.thumbnail_path !== undefined) dbUpdates.thumbnail_path = updates.thumbnail_path;

    const { data, error } = await supabase
      .from('documents')
      .update(dbUpdates)
      .eq('id', id)
      .select();

    if (error) {
      console.error("Error updating document:", error);
      return { success: false, error };
    }

    const updatedDoc = data ? mapToDocumentType(data[0]) : null;
    return { success: true, document: updatedDoc };
  } catch (error) {
    console.error("Unexpected error updating document:", error);
    return { success: false, error };
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
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error deleting document:", error);
    return { success: false, error };
  }
}

export async function generatePDF(document: DocumentType) {
  try {
    const response = {
      file_path: `generated_pdfs/${document.id}.pdf`,
      url: URL.createObjectURL(new Blob([`PDF Content for ${document.name}`], { type: 'application/pdf' }))
    };
    
    return response;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

export async function downloadDocument(documentId: string, documentName: string) {
  try {
    // In a real app, this would fetch the actual file from storage
    const response = await fetch(`/api/documents/${documentId}/download`);
    const blob = await response.blob();
    
    // Create a download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = documentName + '.pdf';
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    // In a real app, save downloaded status to user profile in backend
    const savedFiles = localStorage.getItem('downloadedDocuments') || '[]';
    const downloadedFiles = JSON.parse(savedFiles);
    if (!downloadedFiles.includes(documentId)) {
      downloadedFiles.push(documentId);
      localStorage.setItem('downloadedDocuments', JSON.stringify(downloadedFiles));
    }
    
    return true;
  } catch (error) {
    console.error('Error downloading document:', error);
    throw error;
  }
}

// Helper function to map database format to DocumentType
function mapToDocumentType(data: any): DocumentType {
  return {
    id: data.id,
    name: data.name,
    description: data.description || '',
    category: data.category,
    expiration_date: data.expiration_date || null,
    file_path: data.file_path || '',
    thumbnail_path: data.thumbnail_path || '',
    user_id: data.user_id || '',
    created_at: data.created_at,
    updated_at: data.updated_at
  };
}
