import { NextRequest, NextResponse } from "next/server";

const INSTALLER_DIRECT_CDN_URL =
  "https://github.com/digvija4508-jpg/sage-vault/releases/download/v1.0/Overwork.Setup.exe";

export async function GET(request: NextRequest) {
  // Direct redirect to high-speed CDN release installer
  return NextResponse.redirect(INSTALLER_DIRECT_CDN_URL, {
    status: 302,
    headers: {
      "Content-Disposition": 'attachment; filename="Overwork Setup.exe"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
