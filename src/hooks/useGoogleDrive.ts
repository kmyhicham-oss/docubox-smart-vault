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

async function invokeFn<T = any>(name: string, body: any): Promise<T> {
  const { data, error } = await supabase.functions.invoke(name, { body });
  if (error) {
    // Try to read the real provider error body
    let details = error.message;
    try {
      // @ts-ignore
      if (error.context?.text) details = await error.context.text();
    } catch {}
    throw new Error(details || 'Edge function error');
  }
  if (data?.error) throw new Error(data.error);
  return data as T;
}

export function useGoogleDrive() {
  const [state, setState] = useState<GoogleDriveState>({
    isConnected: false,
    isLoading: false,
    files: [],
    error: null,
  });

  const { toast } = useToast();

  const checkConnection = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from('user_google_tokens')
        .select('expires_at')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (data) {
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

      const redirectUri = `${window.location.origin}/auth/google/callback`;

      const data = await invokeFn<{ authUrl: string }>('google-oauth', {
        action: 'get_auth_url',
        redirectUri,
      });

      const popup = window.open(
        data.authUrl,
        'google-oauth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        if (event.data.type === 'GOOGLE_OAUTH_SUCCESS') {
          popup?.close();
          setState(prev => ({ ...prev, isConnected: true, isLoading: false }));
          toast({ title: 'Connexion réussie', description: 'Compte Google Drive connecté.' });
          window.removeEventListener('message', handleMessage);
        } else if (event.data.type === 'GOOGLE_OAUTH_ERROR') {
          popup?.close();
          setState(prev => ({ ...prev, error: event.data.error, isLoading: false }));
          toast({ title: 'Erreur', description: event.data.error, variant: 'destructive' });
          window.removeEventListener('message', handleMessage);
        }
      };
      window.addEventListener('message', handleMessage);

      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          setState(prev => ({ ...prev, isLoading: false }));
          window.removeEventListener('message', handleMessage);
        }
      }, 1000);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Une erreur est survenue';
      setState(prev => ({ ...prev, error: msg, isLoading: false }));
      toast({ title: 'Erreur', description: msg, variant: 'destructive' });
    }
  }, [toast]);

  const listFiles = useCallback(async (folderId?: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const data = await invokeFn<{ files: DriveFile[] }>('google-drive-import', {
        action: 'list',
        folderId,
      });
      setState(prev => ({ ...prev, files: data.files || [], isLoading: false }));
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Une erreur est survenue';
      setState(prev => ({ ...prev, error: msg, isLoading: false }));
    }
  }, []);

  const downloadFile = useCallback(async (fileId: string, fileName: string) => {
    try {
      const data = await invokeFn<any>('google-drive-import', {
        action: 'download',
        fileId,
        fileName,
      });
      return {
        filePath: data.filePath,
        publicUrl: data.publicUrl,
        mimeType: data.mimeType,
        fileName: data.fileName,
      };
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Une erreur est survenue';
      toast({ title: 'Erreur de téléchargement', description: msg, variant: 'destructive' });
      throw error;
    }
  }, [toast]);

  const disconnectGoogleDrive = useCallback(async () => {
    try {
      await invokeFn('google-oauth', { action: 'revoke_access' });
      setState(prev => ({ ...prev, isConnected: false, files: [] }));
      toast({ title: 'Déconnexion réussie', description: 'Compte Google Drive déconnecté.' });
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Une erreur est survenue';
      toast({ title: 'Erreur', description: msg, variant: 'destructive' });
    }
  }, [toast]);

  return {
    ...state,
    checkConnection,
    connectGoogleDrive,
    disconnectGoogleDrive,
    listFiles,
    downloadFile,
  };
}
