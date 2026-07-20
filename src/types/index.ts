export type UserType = {
  id: string;
  email: string;
  createdAt: Date;
};

// 10 canonical categories + legacy aliases (vehicle, contract) kept for backward compat
export type DocumentCategory =
  | "identity"
  | "health"
  | "finance"
  | "realestate"
  | "work"
  | "education"
  | "insurance"
  | "transport"
  | "utilities"
  | "other"
  // legacy
  | "vehicle"
  | "contract";

export type DocumentType = {
  id: string;
  user_id: string;
  name: string;
  category: string;
  file_path: string | null;
  expiration_date: string | null;
  created_at: string;
  updated_at: string;
  description: string | null;
  thumbnail_path: string | null;
};

export type NotificationType = {
  id: string;
  documentId: string;
  scheduledDate: Date;
  status: "pending" | "sent";
};

export interface CategoryInfo {
  id: DocumentCategory | "all";
  label: string;
  icon: React.ComponentType<any> | string;
  color: string;
}
