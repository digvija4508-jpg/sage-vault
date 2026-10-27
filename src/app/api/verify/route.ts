import { NextRequest, NextResponse } from "next/server";
import { getDownloadById } from "@/lib/downloads";
import { generateDownloadToken, verifyPasscode } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, password } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ success: false, error: "Missing file ID" }, { status: 400 });
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json({ success: false, error: "Please enter the access passcode" }, { status: 400 });
    }

    const item = getDownloadById(id);

    if (!item) {
      return NextResponse.json({ success: false, error: "Download item not found" }, { status: 404 });
    }

    // Check expiry
    if (item.expiresAt && new Date(item.expiresAt) < new Date()) {
      return NextResponse.json(
        { success: false, error: "This download link has expired and is no longer available" },
        { status: 410 }
      );
    }

    // Validate passcode
    const isMatch = verifyPasscode(password, item.password);

    if (!isMatch) {
      return NextResponse.json(
        {
          success: false,
          error: "Incorrect passcode. Please check and try again.",
          hint: item.hint || undefined,
        },
        { status: 401 }
      );
    }

    // Passcode verified! Generate signed token (15 mins)
    const token = generateDownloadToken(item.id, 15);
    const downloadUrl = `/api/download/${encodeURIComponent(item.id)}?token=${encodeURIComponent(token)}`;

    return NextResponse.json({
      success: true,
      token,
      downloadUrl,
      fileName: item.fileName,
      fileSize: item.fileSize,
      fileType: item.fileType,
      expiresInMinutes: 15,
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
