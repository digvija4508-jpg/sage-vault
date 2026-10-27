import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getDownloadById } from "@/lib/downloads";
import { verifyDownloadToken } from "@/lib/auth";

function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case ".pdf":
      return "application/pdf";
    case ".zip":
      return "application/zip";
    case ".tar":
    case ".gz":
    case ".tgz":
      return "application/gzip";
    case ".txt":
    case ".md":
      return "text/plain; charset=utf-8";
    case ".json":
      return "application/json";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".svg":
      return "image/svg+xml";
    case ".mp4":
      return "video/mp4";
    case ".mp3":
      return "audio/mpeg";
    case ".dmg":
      return "application/x-apple-diskimage";
    case ".exe":
      return "application/x-msdownload";
    default:
      return "application/octet-stream";
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return new NextResponse(
        "Unauthorized: Access token missing. Please unlock the file with your passcode.",
        { status: 401 }
      );
    }

    // Verify token
    const verification = verifyDownloadToken(token);
    if (!verification.valid || !verification.itemId) {
      return new NextResponse(
        `Access Denied: ${verification.error || "Invalid or expired token"}`,
        { status: 403 }
      );
    }

    if (verification.itemId.toLowerCase() !== id.toLowerCase()) {
      return new NextResponse("Forbidden: Token mismatch for this resource.", { status: 403 });
    }

    const item = getDownloadById(id);
    if (!item) {
      return new NextResponse("Item not found.", { status: 404 });
    }

    // Expiry check
    if (item.expiresAt && new Date(item.expiresAt) < new Date()) {
      return new NextResponse("This download link has expired.", { status: 410 });
    }

    // 1. External Cloud Storage (e.g. Google Drive, S3, Dropbox, GitHub releases)
    if (item.storageType === "external") {
      return NextResponse.redirect(item.targetUrl, {
        status: 302,
        headers: {
          "Cache-Control": "private, no-cache, no-store, must-revalidate",
        },
      });
    }

    // 2. Local Repository Storage (e.g. storage/downloads/...)
    // Sanitize targetUrl to prevent path traversal
    const safeTarget = path.normalize(item.targetUrl).replace(/^(\.\.[\/\\])+/, "");
    const filePath = path.join(process.cwd(), "storage", "downloads", safeTarget);

    if (!fs.existsSync(filePath)) {
      console.error(`Storage file missing at: ${filePath}`);
      return new NextResponse("Requested file is not available on this server.", { status: 404 });
    }

    const stats = fs.statSync(filePath);
    const nodeStream = fs.createReadStream(filePath);

    const readable = new ReadableStream({
      start(controller) {
        nodeStream.on("data", (chunk) => controller.enqueue(chunk));
        nodeStream.on("end", () => controller.close());
        nodeStream.on("error", (err) => controller.error(err));
      },
      cancel() {
        nodeStream.destroy();
      },
    });

    return new NextResponse(readable, {
      headers: {
        "Content-Disposition": `attachment; filename="${encodeURIComponent(item.fileName)}"`,
        "Content-Type": getMimeType(item.fileName),
        "Content-Length": stats.size.toString(),
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Download route error:", error);
    return new NextResponse("Internal server error during download.", { status: 500 });
  }
}
