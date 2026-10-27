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
  Archive,
  CheckCircle2,
} from "lucide-react";

export default function InstallerPage() {
  const [copiedExe, setCopiedExe] = useState(false);
  const [copiedZip, setCopiedZip] = useState(false);

  const directExeUrl = typeof window !== "undefined"
    ? `${window.location.origin}/api/installer`
    : "/api/installer";

  const directZipUrl = typeof window !== "undefined"
    ? `${window.location.origin}/api/installer?type=portable`
    : "/api/installer?type=portable";

  const handleCopy = (text: string, isZip = false) => {
    navigator.clipboard.writeText(text);
    if (isZip) {
      setCopiedZip(true);
      setTimeout(() => setCopiedZip(false), 2000);
    } else {
      setCopiedExe(true);
      setTimeout(() => setCopiedExe(false), 2000);
    }
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
          {/* Top rainbow border */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500" />

          <div className="max-w-3xl">
            {/* Version badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Release • Version 0.2.0 • Fixed Standalone</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Overwork Multi-Agent Workbench
            </h1>

            <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed">
              Standalone desktop application with full multi-agent orchestration, integrated ConPTY terminal, and Obsidian-Indigo glassmorphic UI. Packaged with a VS Code-style guided Windows Setup Wizard that runs cleanly on any laptop.
            </p>

            {/* Big Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {/* Option 1: Standalone Windows Setup Wizard */}
              <a
                href="/api/installer"
                download="Overwork-Setup-0.2.0.exe"
                className="flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Download className="w-5 h-5" />
                <span>Download Setup Wizard (.exe - 118 MB)</span>
              </a>

              {/* Option 2: Portable Standalone Zip */}
              <a
                href="/api/installer?type=portable"
                download="Overwork-Portable-v0.2.0.zip"
                className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs sm:text-sm font-semibold text-zinc-100 hover:text-white transition-all hover:scale-[1.02]"
              >
                <Archive className="w-4 h-4 text-cyan-400" />
                <span>Download Portable (.zip - 167 MB)</span>
              </a>
            </div>

            {/* Direct Links Pill Grid */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/90 flex items-center justify-between gap-2">
                <span className="text-zinc-500 font-medium shrink-0">Installer Link:</span>
                <code className="text-emerald-400 font-mono text-[11px] truncate">{directExeUrl}</code>
                <button
                  onClick={() => handleCopy(directExeUrl, false)}
                  className="p-1 text-zinc-400 hover:text-white shrink-0"
                  title="Copy link"
                >
                  {copiedExe ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/90 flex items-center justify-between gap-2">
                <span className="text-zinc-500 font-medium shrink-0">Portable Link:</span>
                <code className="text-cyan-400 font-mono text-[11px] truncate">{directZipUrl}</code>
                <button
                  onClick={() => handleCopy(directZipUrl, true)}
                  className="p-1 text-zinc-400 hover:text-white shrink-0"
                  title="Copy link"
                >
                  {copiedZip ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Specifications Grid */}
          <div className="mt-12 pt-8 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/60">
              <span className="text-zinc-500 flex items-center gap-1.5 mb-1">
                <HardDrive className="w-3.5 h-3.5 text-zinc-400" />
                Installer Size
              </span>
              <span className="text-white font-semibold text-sm">118.5 MB</span>
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
                Integrity
              </span>
              <span className="text-white font-semibold text-sm">Inno Setup Wizard</span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/60">
              <span className="text-zinc-500 flex items-center gap-1.5 mb-1">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                Distribution
              </span>
              <span className="text-white font-semibold text-sm">Global GitHub CDN</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-zinc-950/40 border border-zinc-800/60">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4" />
                Option A: Standalone Setup (.exe)
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Click <strong className="text-white">Download Installer</strong>. Run the downloaded <code className="text-emerald-400">Overwork-Setup-0.2.0.exe</code>. It self-extracts all assets and creates a shortcut on your desktop.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-950/40 border border-zinc-800/60">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2 mb-2">
                <Archive className="w-4 h-4" />
                Option B: Portable Standalone (.zip)
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Click <strong className="text-white">Download Portable</strong>. Unzip <code className="text-cyan-400">Overwork-Portable-v0.2.0.zip</code> anywhere, then double-click <code className="text-white">Overwork.exe</code> to run immediately without installation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
