
export type UserType = {
  id: string;
  email: string;
  createdAt: Date;
};

export type DocumentCategory = 'identity' | 'health' | 'vehicle' | 'contract' | 'other';

export type DocumentType = {
  id: string;
  userId: string;
  name: string;
  category: DocumentCategory;
  filePath: string;
  expirationDate?: Date;
  createdAt: Date;
  description?: string;
  thumbnailPath?: string;
};

export type NotificationType = {
  id: string;
  documentId: string;
  scheduledDate: Date;
  status: 'pending' | 'sent';
};

export interface CategoryInfo {
  id: DocumentCategory | 'all';
  label: string;
  icon: React.ComponentType<any> | string;
  color: string;
}
