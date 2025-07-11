import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  createdTime: string;
  webViewLink: string;
}

interface GoogleDriveState {
  isConnected: boolean;
  isLoading: boolean;
  files: DriveFile[];
  error: string | null;
}

export function useGoogleDrive() {
  const [state, setState] = useState<GoogleDriveState>({
    isConnected: false,
    isLoading: false,
    files: [],
    error: null
  });
  
  const { toast } = useToast();

  const checkConnection = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('user_google_tokens')
        .select('expires_at')
        .eq('user_id', session.user.id)
        .single();

      if (!error && data) {
        const expiresAt = new Date(data.expires_at);
        setState(prev => ({ ...prev, isConnected: expiresAt > new Date() }));
      }
    } catch (error) {
      console.error('Error checking Google Drive connection:', error);
    }
  }, []);

  const connectGoogleDrive = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const redirectUri = `${window.location.origin}/auth/google/callback`;
      
      const response = await fetch('/functions/v1/google-oauth', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'get_auth_url',
          redirectUri
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      // Open popup for OAuth
      const popup = window.open(
        data.authUrl,
        'google-oauth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      // Listen for popup message
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'GOOGLE_OAUTH_SUCCESS') {
          popup?.close();
          setState(prev => ({ ...prev, isConnected: true, isLoading: false }));
          toast({
            title: "Connexion réussie",
            description: "Votre compte Google Drive a été connecté avec succès."
          });
          window.removeEventListener('message', handleMessage);
        } else if (event.data.type === 'GOOGLE_OAUTH_ERROR') {
          popup?.close();
          setState(prev => ({ ...prev, error: event.data.error, isLoading: false }));
          toast({
            title: "Erreur de connexion",
            description: event.data.error,
            variant: "destructive"
          });
          window.removeEventListener('message', handleMessage);
        }
      };

      window.addEventListener('message', handleMessage);

      // Check if popup was closed manually
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          setState(prev => ({ ...prev, isLoading: false }));
          window.removeEventListener('message', handleMessage);
        }
      }, 1000);

    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Une erreur est survenue',
        isLoading: false 
      }));
      toast({
        title: "Erreur",
        description: "Impossible de se connecter à Google Drive",
        variant: "destructive"
      });
    }
  }, [toast]);

  const listFiles = useCallback(async (folderId?: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await fetch('/functions/v1/google-drive-import', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'list',
          folderId
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setState(prev => ({ 
        ...prev, 
        files: data.files || [],
        isLoading: false 
      }));

    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Une erreur est survenue',
        isLoading: false 
      }));
    }
  }, []);

  const downloadFile = useCallback(async (fileId: string, fileName: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await fetch('/functions/v1/google-drive-import', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'download',
          fileId,
          fileName
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      return {
        filePath: data.filePath,
        publicUrl: data.publicUrl,
        mimeType: data.mimeType,
        fileName: data.fileName
      };

    } catch (error) {
      toast({
        title: "Erreur de téléchargement",
        description: error instanceof Error ? error.message : 'Une erreur est survenue',
        variant: "destructive"
      });
      throw error;
    }
  }, [toast]);

  const disconnectGoogleDrive = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      await fetch('/functions/v1/google-oauth', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'revoke_access'
        })
      });

      setState(prev => ({ 
        ...prev, 
        isConnected: false,
        files: []
      }));

      toast({
        title: "Déconnexion réussie",
        description: "Votre compte Google Drive a été déconnecté."
      });

    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de se déconnecter de Google Drive",
        variant: "destructive"
      });
    }
  }, [toast]);

  return {
    ...state,
    checkConnection,
    connectGoogleDrive,
    disconnectGoogleDrive,
    listFiles,
    downloadFile
  };
}