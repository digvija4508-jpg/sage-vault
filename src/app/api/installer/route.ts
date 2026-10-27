import { NextRequest, NextResponse } from "next/server";

const INSTALLER_URL =
  "https://github.com/digvija4508-jpg/sage-vault/releases/download/v1.1/Overwork.Setup.0.2.0.exe";
const PORTABLE_URL =
  "https://github.com/digvija4508-jpg/sage-vault/releases/download/v1.1/Overwork-Portable-v0.2.0.zip";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  const targetUrl = type === "portable" ? PORTABLE_URL : INSTALLER_URL;
  const fileName = type === "portable" ? "Overwork-Portable-v0.2.0.zip" : "Overwork-Setup-0.2.0.exe";

  return NextResponse.redirect(targetUrl, {
    status: 302,
    headers: {
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
