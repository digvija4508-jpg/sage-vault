"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Download,
  Copy,
  Check,
  ShieldCheck,
  Terminal,
  HardDrive,
  Cpu,
  Layers,
  ArrowLeft,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export default function InstallerPage() {
  const [copied, setCopied] = useState(false);

  const directApiUrl = typeof window !== "undefined"
    ? `${window.location.origin}/api/installer`
    : "/api/installer";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(directApiUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#080b14] text-zinc-100 flex flex-col justify-between selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-gradient-to-b from-indigo-500/15 via-emerald-500/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 w-full">
        {/* Navigation */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Sage Vault Hub</span>
          </Link>
        </div>

        {/* Main Installer Spotlight Card */}
        <div className="relative rounded-3xl bg-zinc-900/60 border border-zinc-800/80 p-8 sm:p-12 shadow-2xl backdrop-blur-xl overflow-hidden">
          {/* Subtle top rainbow border */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500" />

          <div className="max-w-3xl">
            {/* Version badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Release • Version 1.0</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Overwork Setup Installer
            </h1>

            <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed">
              A bespoke setup wizard designed with the Obsidian-Indigo glassmorphic design system. Features live environment diagnostics, automated workspace provisioning, and integrated live terminal logs.
            </p>

            {/* Big Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href="/api/installer"
                download="Overwork Setup.exe"
                className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Download className="w-5 h-5" />
                <span>Direct Download Installer (.exe)</span>
              </a>

              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700 text-xs sm:text-sm font-semibold text-zinc-200 hover:text-white transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Direct Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-zinc-400" />
                    <span>Copy Direct Download Link</span>
                  </>
                )}
              </button>
            </div>

            {/* Direct URL display pill */}
            <div className="mt-5 p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/90 flex items-center justify-between gap-3 text-xs">
              <span className="text-zinc-500 shrink-0 font-medium">Direct Link:</span>
              <code className="text-emerald-400 font-mono text-[11px] truncate select-all">
                {directApiUrl}
              </code>
              <button
                onClick={handleCopyLink}
                className="p-1 text-zinc-400 hover:text-white shrink-0"
                title="Copy link"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Specifications Grid */}
          <div className="mt-12 pt-8 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/60">
              <span className="text-zinc-500 flex items-center gap-1.5 mb-1">
                <HardDrive className="w-3.5 h-3.5 text-zinc-400" />
                File Size
              </span>
              <span className="text-white font-semibold text-sm">234.9 MB</span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/60">
              <span className="text-zinc-500 flex items-center gap-1.5 mb-1">
                <Cpu className="w-3.5 h-3.5 text-zinc-400" />
                Target OS
              </span>
              <span className="text-white font-semibold text-sm">Windows 10 / 11 (x64)</span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/60">
              <span className="text-zinc-500 flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                SHA-256
              </span>
              <span className="text-white font-semibold text-sm">Verified Release</span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/60">
              <span className="text-zinc-500 flex items-center gap-1.5 mb-1">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                Distribution
              </span>
              <span className="text-white font-semibold text-sm">Global CDN</span>
            </div>
          </div>

          {/* Installation Instructions */}
          <div className="mt-8 p-5 rounded-2xl bg-zinc-950/40 border border-zinc-800/60">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2 mb-3">
              <Terminal className="w-4 h-4 text-emerald-400" />
              Quick Setup Instructions
            </h3>
            <ol className="text-xs text-zinc-400 space-y-2 list-decimal list-inside leading-relaxed">
              <li>Click the green <strong className="text-white">Direct Download Installer</strong> button above.</li>
              <li>Once downloaded, locate <code className="text-emerald-400 bg-zinc-900 px-1 py-0.5 rounded">Overwork Setup.exe</code> in your Downloads folder.</li>
              <li>Double-click the installer to start the Obsidian-Indigo setup wizard.</li>
              <li>Follow the on-screen steps to provision your workbench environment automatically.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
