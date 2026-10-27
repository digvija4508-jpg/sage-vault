import fs from "fs";
import path from "path";
import { DownloadItem, PublicDownloadItem } from "@/types/download";
import downloadsData from "@/data/downloads.json";

const DATA_FILE_PATH = path.join(process.cwd(), "src", "data", "downloads.json");

/**
 * Retrieves all downloads (internal server-only, contains passwords & sensitive URLs).
 */
export function getAllDownloadsInternal(): DownloadItem[] {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const fileContent = fs.readFileSync(DATA_FILE_PATH, "utf8");
      return JSON.parse(fileContent) as DownloadItem[];
    }
  } catch (error) {
    console.error("Error reading downloads.json:", error);
  }
  return downloadsData as DownloadItem[];
}

/**
 * Retrieves downloads sanitized for public display (no passwords or internal URLs).
 */
export function getPublicDownloads(): PublicDownloadItem[] {
  const items = getAllDownloadsInternal();
  const now = new Date();

  return items.map((item) => {
    const isExpired = item.expiresAt ? new Date(item.expiresAt) < now : false;
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      fileName: item.fileName,
      fileSize: item.fileSize,
      fileType: item.fileType,
      hint: item.hint,
      createdAt: item.createdAt,
      expiresAt: item.expiresAt,
      isExpired,
      isFeatured: item.isFeatured,
    };
  });
}

/**
 * Finds a specific download by ID.
 */
export function getDownloadById(id: string): DownloadItem | undefined {
  const items = getAllDownloadsInternal();
  return items.find((item) => item.id.toLowerCase() === id.toLowerCase());
}

/**
 * Finds a public download by ID.
 */
export function getPublicDownloadById(id: string): PublicDownloadItem | undefined {
  const items = getPublicDownloads();
  return items.find((item) => item.id.toLowerCase() === id.toLowerCase());
}
