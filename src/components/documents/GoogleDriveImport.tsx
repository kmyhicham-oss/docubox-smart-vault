import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, FolderOpen, FileText, Image, Download, Link2, Shield } from 'lucide-react';
import { useGoogleDrive } from '@/hooks/useGoogleDrive';
import { useDocumentAnalysis } from '@/hooks/useDocumentAnalysis';
import { useToast } from '@/hooks/use-toast';
import { DocumentCategory } from '@/types';

interface GoogleDriveImportProps {
  onFileImported: (fileData: {
    filePath: string;
    name: string;
    category: DocumentCategory;
    extractedText?: string;
  }) => void;
}

export function GoogleDriveImport({ onFileImported }: GoogleDriveImportProps) {
  const { 
    isConnected, 
    isLoading, 
    files, 
    error,
    checkConnection,
    connectGoogleDrive,
    disconnectGoogleDrive,
    listFiles,
    downloadFile
  } = useGoogleDrive();

  const { analyzeDocument } = useDocumentAnalysis();
  const { toast } = useToast();
  const [importingFileId, setImportingFileId] = useState<string | null>(null);

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  useEffect(() => {
    if (isConnected) {
      listFiles();
    }
  }, [isConnected, listFiles]);

  const handleImportFile = async (fileId: string, fileName: string, mimeType: string) => {
    if (importingFileId) return;

    try {
      setImportingFileId(fileId);

      // Download file from Google Drive
      const downloadedFile = await downloadFile(fileId, fileName);

      // Determine category based on file type and content
      let category: DocumentCategory = 'other';
      let extractedText = '';

      // If it's an image, perform OCR analysis
      if (mimeType.startsWith('image/')) {
        try {
          // Create a File object for OCR analysis
          const response = await fetch(downloadedFile.publicUrl);
          const blob = await response.blob();
          const file = new File([blob], fileName, { type: mimeType });

          const analysis = await analyzeDocument(file);
          category = analysis.suggestedCategory;
          extractedText = analysis.text;
        } catch (ocrError) {
          console.warn('OCR analysis failed:', ocrError);
          // Continue without OCR if it fails
        }
      }

      // Call the callback with the imported file data
      onFileImported({
        filePath: downloadedFile.filePath,
        name: fileName,
        category,
        extractedText
      });

      toast({
        title: "Fichier importé",
        description: `${fileName} a été importé avec succès depuis Google Drive.`
      });

    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Erreur d'importation",
        description: "Impossible d'importer le fichier depuis Google Drive.",
        variant: "destructive"
      });
    } finally {
      setImportingFileId(null);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (mimeType.includes('pdf') || mimeType.includes('document')) return <FileText className="h-4 w-4" />;
    if (mimeType.includes('folder')) return <FolderOpen className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const formatFileSize = (size?: string) => {
    if (!size) return 'Taille inconnue';
    const bytes = parseInt(size);
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (!isConnected) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Connexion Google Drive
          </CardTitle>
          <CardDescription>
            Connectez votre compte Google Drive pour importer vos documents directement.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Accès sécurisé avec scopes limités (lecture seule)</span>
          </div>
          
          <div className="space-y-2 text-sm">
            <p><strong>Scopes demandés :</strong></p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>drive.readonly - Lecture des fichiers de votre Drive</li>
              <li>drive.file - Accès aux fichiers que vous choisissez d'importer</li>
            </ul>
          </div>

          <Button 
            onClick={connectGoogleDrive} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connexion...
              </>
            ) : (
              <>
                <Link2 className="mr-2 h-4 w-4" />
                Se connecter à Google Drive
              </>
            )}
          </Button>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Google Drive
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={disconnectGoogleDrive}
          >
            Déconnecter
          </Button>
        </CardTitle>
        <CardDescription>
          Sélectionnez un fichier à importer depuis votre Google Drive.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Chargement des fichiers...</span>
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {files.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucun fichier trouvé dans votre Drive
              </div>
            ) : (
              files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {getFileIcon(file.mimeType)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{formatFileSize(file.size)}</span>
                        <Badge variant="outline" className="text-xs">
                          {file.mimeType.split('/')[1]?.toUpperCase() || 'FICHIER'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    onClick={() => handleImportFile(file.id, file.name, file.mimeType)}
                    disabled={importingFileId === file.id || file.mimeType.includes('folder')}
                  >
                    {importingFileId === file.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Import...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Importer
                      </>
                    )}
                  </Button>
                </div>
              ))
            )}
          </div>
        )}

        {error && (
          <div className="mt-4 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}