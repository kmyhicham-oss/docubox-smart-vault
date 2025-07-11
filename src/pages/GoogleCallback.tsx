import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

export default function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');

      if (error) {
        // Send error message to parent window
        window.opener?.postMessage({
          type: 'GOOGLE_OAUTH_ERROR',
          error: `Erreur d'autorisation: ${error}`
        }, window.location.origin);
        window.close();
        return;
      }

      if (code) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) {
            throw new Error('Session non trouvée');
          }

          const redirectUri = `${window.location.origin}/auth/google/callback`;
          
          const response = await fetch('/functions/v1/google-oauth', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              action: 'exchange_code',
              code,
              redirectUri
            })
          });

          const data = await response.json();

          if (data.error) {
            throw new Error(data.error);
          }

          // Send success message to parent window
          window.opener?.postMessage({
            type: 'GOOGLE_OAUTH_SUCCESS'
          }, window.location.origin);
          
          window.close();

        } catch (error) {
          console.error('OAuth callback error:', error);
          
          // Send error message to parent window
          window.opener?.postMessage({
            type: 'GOOGLE_OAUTH_ERROR',
            error: error instanceof Error ? error.message : 'Une erreur est survenue'
          }, window.location.origin);
          
          window.close();
        }
      } else {
        // No code parameter, redirect to main app
        navigate('/');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>Traitement de l'autorisation Google Drive...</p>
      </div>
    </div>
  );
}