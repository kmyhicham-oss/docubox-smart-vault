import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Get user from Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid token');
    }

    if (req.method === 'POST') {
      const { action, code, redirectUri } = await req.json();

      switch (action) {
        case 'get_auth_url':
          return getAuthUrl(redirectUri);
        
        case 'exchange_code':
          return await exchangeCode(code, redirectUri, user.id, supabase);
        
        case 'revoke_access':
          return await revokeAccess(user.id, supabase);
        
        default:
          throw new Error('Invalid action');
      }
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in google-oauth function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

function getAuthUrl(redirectUri: string) {
  const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
  if (!clientId) {
    throw new Error('Google Client ID not configured');
  }

  const scopes = [
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/drive.file'
  ].join(' ');

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', scopes);
  authUrl.searchParams.set('access_type', 'offline');
  authUrl.searchParams.set('prompt', 'consent');

  return new Response(JSON.stringify({ authUrl: authUrl.toString() }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function exchangeCode(code: string, redirectUri: string, userId: string, supabase: any) {
  const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
  const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');

  if (!clientId || !clientSecret) {
    throw new Error('Google OAuth credentials not configured');
  }

  // Exchange authorization code for tokens
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri
    })
  });

  const tokenData = await tokenResponse.json();

  if (tokenData.error) {
    throw new Error(`OAuth error: ${tokenData.error_description || tokenData.error}`);
  }

  // Calculate expiration time
  const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);

  // Store tokens in database
  const { error: upsertError } = await supabase
    .from('user_google_tokens')
    .upsert({
      user_id: userId,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: expiresAt.toISOString(),
      scope: tokenData.scope
    });

  if (upsertError) {
    throw new Error(`Failed to store tokens: ${upsertError.message}`);
  }

  return new Response(JSON.stringify({ 
    success: true,
    expiresAt: expiresAt.toISOString(),
    scope: tokenData.scope
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function revokeAccess(userId: string, supabase: any) {
  // Get user's tokens
  const { data: tokenData } = await supabase
    .from('user_google_tokens')
    .select('access_token')
    .eq('user_id', userId)
    .single();

  if (tokenData?.access_token) {
    // Revoke token with Google
    await fetch(`https://oauth2.googleapis.com/revoke?token=${tokenData.access_token}`, {
      method: 'POST'
    });
  }

  // Delete from database
  const { error: deleteError } = await supabase
    .from('user_google_tokens')
    .delete()
    .eq('user_id', userId);

  if (deleteError) {
    throw new Error(`Failed to delete tokens: ${deleteError.message}`);
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}