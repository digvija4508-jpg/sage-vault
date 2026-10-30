import { NextRequest, NextResponse } from "next/server";

const INSTALLER_URL =
  "https://github.com/digvija4508-jpg/sage-vault/releases/download/v1.7/Overwork-Setup-0.2.0.exe";

export async function GET(_request: NextRequest) {
  const fileName = "Overwork-Setup-0.2.0.exe";

  return NextResponse.redirect(INSTALLER_URL, {
    status: 302,
    headers: {
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
