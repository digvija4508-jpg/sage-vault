"use client";

import Link from "next/link";
import { ShieldCheck, Lock, ExternalLink, Settings } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 p-[1px] shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all">
            <div className="w-full h-full bg-zinc-950 rounded-[11px] flex items-center justify-center">
              <Lock className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                Sage Vault
              </span>
              <span className="px-2 py-0.5 text-[10px] uppercase font-semibold tracking-wider rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Protected
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">
              Passcode-Guarded Distribution Portal
            </p>
          </div>
        </Link>

        {/* Right side navigation */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Time-Signed SHA-256 Tokens</span>
          </div>

          <Link
            href="/admin"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs font-medium text-zinc-200 transition-all"
          >
            <Settings className="w-3.5 h-3.5 text-zinc-400" />
            <span>Admin Vault</span>
          </Link>

          <a
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow-md shadow-emerald-600/20 transition-all"
          >
            <span>Deploy on Vercel</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
}
