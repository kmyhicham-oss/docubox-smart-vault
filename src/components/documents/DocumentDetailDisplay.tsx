
import { Logo } from "@/components/shared/Logo";
import { DocumentType } from "@/types";
import { DocumentImage } from "./DocumentImage";
import { DocumentInfo } from "./DocumentInfo";
import { DocumentActions } from "./DocumentActions";

interface DocumentDetailDisplayProps {
  document: DocumentType;
  isDownloaded: boolean;
  isDownloading: boolean;
  downloadProgress: number;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  getImageUrl: () => Promise<string>;
  handleDownload: () => void;
  handleDelete: () => void;
  handleEdit: () => void;
  handleShare: () => void;
}

export function DocumentDetailDisplay({
  document,
  isDownloaded,
  isDownloading,
  downloadProgress,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  getImageUrl,
  handleDownload,
  handleDelete,
  handleEdit,
  handleShare
}: DocumentDetailDisplayProps) {
  return (
    <main className="container mx-auto p-4 max-w-lg space-y-6">
      <DocumentImage 
        imageUrlFn={getImageUrl} 
        isDownloaded={isDownloaded} 
      />

      <DocumentInfo document={document} />
      
      <DocumentActions 
        isDownloaded={isDownloaded}
        isDownloading={isDownloading}
        downloadProgress={downloadProgress}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        onDownload={handleDownload}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onShare={handleShare}
      />

      <div className="text-center pt-6 border-t border-gray-100">
        <Logo />
      </div>
    </main>
  );
}
