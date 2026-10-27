import { NextRequest, NextResponse } from "next/server";
import { getAllDownloadsInternal } from "@/lib/downloads";
import fs from "fs";
import path from "path";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin2026";
const DATA_FILE_PATH = path.join(process.cwd(), "src", "data", "downloads.json");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminKey, action, payload } = body;

    // Admin authentication
    if (!adminKey || adminKey !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: "Invalid Admin Passkey" },
        { status: 401 }
      );
    }

    if (action === "list") {
      const items = getAllDownloadsInternal();
      return NextResponse.json({
        success: true,
        downloads: items,
      });
    }

    if (action === "save-or-export") {
      const { updatedDownloads } = payload;
      if (!Array.isArray(updatedDownloads)) {
        return NextResponse.json(
          { success: false, error: "Invalid payload format: array expected" },
          { status: 400 }
        );
      }

      // Try saving to local disk if running locally/node server
      let savedToDisk = false;
      try {
        fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(updatedDownloads, null, 2), "utf8");
        savedToDisk = true;
      } catch (err) {
        console.warn("Could not write directly to disk (expected on read-only serverless):", err);
      }

      return NextResponse.json({
        success: true,
        savedToDisk,
        jsonConfig: JSON.stringify(updatedDownloads, null, 2),
        message: savedToDisk
          ? "Successfully saved to src/data/downloads.json! Commit your changes to Git to push to Vercel."
          : "Generated configuration JSON. Copy and commit this to src/data/downloads.json in your Git repo.",
      });
    }

    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("Admin API error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
