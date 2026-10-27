import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Lock, ShieldCheck } from "lucide-react";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sage Vault - Passcode-Guarded Distribution Portal",
  description:
    "Secure passcode-protected file download distribution portal deployable to Vercel via Git.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        <Navbar />
        <main className="flex-1">{children}</main>

        <footer className="border-t border-zinc-900 bg-zinc-950 py-8 px-4 sm:px-6 lg:px-8 text-xs text-zinc-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sage Vault • Confidential Distribution System</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Zero Unauthenticated Public Exposure</span>
              </span>
              <Link
                href="/admin"
                className="hover:text-zinc-300 transition-colors"
              >
                Admin Portal
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
