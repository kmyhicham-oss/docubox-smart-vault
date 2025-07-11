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
      const { action, fileId, fileName, folderId } = await req.json();

      // Get user's Google tokens
      const { data: tokenData, error: tokenError } = await supabase
        .from('user_google_tokens')
        .select('access_token, refresh_token, expires_at')
        .eq('user_id', user.id)
        .single();

      if (tokenError || !tokenData) {
        throw new Error('No Google Drive access token found');
      }

      // Check if token is expired and refresh if needed
      let accessToken = tokenData.access_token;
      const expiresAt = new Date(tokenData.expires_at);
      
      if (expiresAt <= new Date()) {
        // Token expired, refresh it
        const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: Deno.env.get('GOOGLE_CLIENT_ID')!,
            client_secret: Deno.env.get('GOOGLE_CLIENT_SECRET')!,
            refresh_token: tokenData.refresh_token!,
            grant_type: 'refresh_token'
          })
        });

        const refreshData = await refreshResponse.json();
        accessToken = refreshData.access_token;

        // Update token in database
        await supabase
          .from('user_google_tokens')
          .update({
            access_token: accessToken,
            expires_at: new Date(Date.now() + refreshData.expires_in * 1000).toISOString()
          })
          .eq('user_id', user.id);
      }

      switch (action) {
        case 'list':
          return await listDriveFiles(accessToken, folderId);
        
        case 'download':
          return await downloadFile(accessToken, fileId, fileName, user.id, supabase);
        
        default:
          throw new Error('Invalid action');
      }
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in google-drive-import function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function listDriveFiles(accessToken: string, folderId?: string) {
  const query = folderId 
    ? `'${folderId}' in parents and trashed=false`
    : `'root' in parents and trashed=false`;
  
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,mimeType,size,createdTime,webViewLink)&pageSize=100`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );

  const data = await response.json();
  
  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function downloadFile(accessToken: string, fileId: string, fileName: string, userId: string, supabase: any) {
  // Get file metadata
  const metadataResponse = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?fields=mimeType,size`,
    {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    }
  );
  
  const metadata = await metadataResponse.json();
  
  // Download file content
  const downloadResponse = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    }
  );

  if (!downloadResponse.ok) {
    throw new Error('Failed to download file from Google Drive');
  }

  const fileBuffer = await downloadResponse.arrayBuffer();
  const fileBase64 = btoa(String.fromCharCode(...new Uint8Array(fileBuffer)));
  
  // Upload to Supabase storage
  const timestamp = Date.now();
  const storagePath = `${userId}/${timestamp}-${fileName}`;
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('documents')
    .upload(storagePath, fileBuffer, {
      contentType: metadata.mimeType,
      upsert: false
    });

  if (uploadError) {
    throw new Error(`Failed to upload to storage: ${uploadError.message}`);
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('documents')
    .getPublicUrl(storagePath);

  return new Response(JSON.stringify({
    success: true,
    filePath: storagePath,
    publicUrl,
    mimeType: metadata.mimeType,
    size: metadata.size,
    fileName
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}