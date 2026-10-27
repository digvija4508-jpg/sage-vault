import { NextRequest, NextResponse } from "next/server";
import { getAllDownloadsInternal } from "@/lib/downloads";
import { generateDownloadToken, verifyPasscode } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { passcode } = body;

    if (!passcode || typeof passcode !== "string" || passcode.trim().length === 0) {
      return NextResponse.json({ success: false, error: "Please enter a passcode" }, { status: 400 });
    }

    const items = getAllDownloadsInternal();
    const now = new Date();

    // Look for matching active item
    for (const item of items) {
      if (item.expiresAt && new Date(item.expiresAt) < now) {
        continue;
      }

      if (verifyPasscode(passcode, item.password)) {
        const token = generateDownloadToken(item.id, 15);
        const downloadUrl = `/api/download/${encodeURIComponent(item.id)}?token=${encodeURIComponent(token)}`;

        return NextResponse.json({
          success: true,
          item: {
            id: item.id,
            title: item.title,
            description: item.description,
            fileName: item.fileName,
            fileSize: item.fileSize,
            fileType: item.fileType,
            category: item.category,
          },
          downloadUrl,
          token,
          expiresInMinutes: 15,
        });
      }
    }

    return NextResponse.json(
      { success: false, error: "No files found matching that passcode." },
      { status: 404 }
    );
  } catch (error) {
    console.error("Quick unlock error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
