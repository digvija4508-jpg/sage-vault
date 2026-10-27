export type FileCategory =
  | "All"
  | "Documents"
  | "Software"
  | "Client Files"
  | "Confidential"
  | "Media"
  | "Archives";

export type FileType =
  | "pdf"
  | "zip"
  | "docx"
  | "xlsx"
  | "image"
  | "video"
  | "audio"
  | "code"
  | "archive"
  | "installer"
  | "other";

export interface DownloadItem {
  id: string; // unique slug e.g. "client-audit-q3"
  title: string;
  description: string;
  category: FileCategory;
  fileName: string;
  fileSize: string;
  fileType: FileType;
  password: string; // passcode to unlock (e.g. "client2026")
  hint?: string; // helpful hint for the authorized recipient
  storageType: "local" | "external"; // "local" -> served from /storage/downloads, "external" -> direct protected redirect
  targetUrl: string; // filename in /storage/downloads or external URL (Drive, S3, Dropbox, etc.)
  createdAt: string;
  expiresAt?: string | null; // ISO date string or null
  maxDownloads?: number;
  downloadCount?: number;
  isFeatured?: boolean;
}

// Client-safe version without passwords or raw target URLs
export interface PublicDownloadItem {
  id: string;
  title: string;
  description: string;
  category: FileCategory;
  fileName: string;
  fileSize: string;
  fileType: FileType;
  hint?: string;
  createdAt: string;
  expiresAt?: string | null;
  isExpired: boolean;
  isFeatured?: boolean;
}
