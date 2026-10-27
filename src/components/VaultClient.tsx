"use client";

import { useState, useMemo } from "react";
import { PublicDownloadItem, FileCategory } from "@/types/download";
import DownloadCard from "./DownloadCard";
import UnlockModal from "./UnlockModal";
import {
  KeyRound,
  Search,
  Shield,
  FileDown,
  Sparkles,
  GitBranch,
  ArrowRight,
  Lock,
  Layers,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

interface VaultClientProps {
  initialItems: PublicDownloadItem[];
}

const CATEGORIES: FileCategory[] = [
  "All",
  "Confidential",
  "Client Files",
  "Documents",
  "Software",
];

export default function VaultClient({ initialItems }: VaultClientProps) {
  const [items] = useState<PublicDownloadItem[]>(initialItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<FileCategory>("All");
  const [activeItem, setActiveItem] = useState<PublicDownloadItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Quick Passcode State
  const [quickPass, setQuickPass] = useState("");
  const [quickLoading, setQuickLoading] = useState(false);
  const [quickError, setQuickError] = useState<string | null>(null);

  // Filter items based on search and category
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.fileName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, selectedCategory]);

  const handleOpenUnlock = (item: PublicDownloadItem) => {
    setActiveItem(item);
    setIsModalOpen(true);
  };

  const handleQuickUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPass.trim()) return;

    setQuickLoading(true);
    setQuickError(null);

    try {
      const res = await fetch("/api/quick-unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: quickPass.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setQuickError(data.error || "No matching file found with this pass.");
        setQuickLoading(false);
        return;
      }

      // Found matching item! Trigger download directly
      window.location.href = data.downloadUrl;
      setQuickPass("");
      setQuickError(null);
    } catch {
      setQuickError("Network error. Please try again.");
    } finally {
      setQuickLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-600/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="pt-12 sm:pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6">
          <Shield className="w-3.5 h-3.5" />
          <span>Vercel + Git Ready Secure File Hub</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-tight">
          Protected Downloads.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            Guarded by Passcode.
          </span>
        </h1>

        <p className="mt-4 sm:mt-6 text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Configure protected files via Git commits or the Admin Vault. Recipients unlock confidential documents, client deliverables, and software packages using their unique pass.
        </p>

        {/* Quick Passcode Box */}
        <div className="mt-8 sm:mt-10 max-w-xl mx-auto">
          <form
            onSubmit={handleQuickUnlock}
            className="p-2 sm:p-2.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-2xl backdrop-blur-md flex flex-col sm:flex-row gap-2"
          >
            <div className="relative flex-1">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={quickPass}
                onChange={(e) => {
                  setQuickPass(e.target.value);
                  setQuickError(null);
                }}
                placeholder="Have a pass? Enter here for instant unlock..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-950/80 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white placeholder-zinc-500 outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={quickLoading || !quickPass.trim()}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold shadow-lg shadow-emerald-600/20 transition-all shrink-0"
            >
              {quickLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Quick Unlock</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {quickError && (
            <p className="mt-2.5 text-xs text-rose-400 font-medium">
              {quickError}
            </p>
          )}

          <p className="mt-2 text-[11px] text-zinc-500">
            Try demo pass: <code className="text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">audit-pass-2026</code> or <code className="text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">alpha-vault-99</code>
          </p>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-sm">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 font-semibold"
                    : "bg-zinc-800/60 hover:bg-zinc-800 text-zinc-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files or formats..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs text-white placeholder-zinc-500 outline-none transition-all"
            />
          </div>
        </div>
      </section>

      {/* Download Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
            <Lock className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-zinc-300">No matching files found</h3>
            <p className="text-xs text-zinc-500 mt-1">
              Try adjusting your search query or switching categories.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map((item) => (
              <DownloadCard
                key={item.id}
                item={item}
                onUnlockClick={handleOpenUnlock}
              />
            ))}
          </div>
        )}
      </section>

      {/* How it works for owner / deployment */}
      <section className="border-t border-zinc-800/80 bg-zinc-900/30 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Manage &amp; Deploy via Git
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2">
              Three clean steps to set new downloads and deploy directly to Vercel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold mb-4">
                1
              </div>
              <h3 className="text-sm font-semibold text-white mb-2">
                Configure in Git or Admin
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Add files to <code className="text-emerald-400 bg-zinc-950 px-1 py-0.5 rounded">src/data/downloads.json</code> or use the Admin panel to configure your files, passcodes, and expiration dates.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 relative">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 font-bold mb-4">
                2
              </div>
              <h3 className="text-sm font-semibold text-white mb-2">
                Store Local or Cloud Files
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Place files inside <code className="text-teal-400 bg-zinc-950 px-1 py-0.5 rounded">storage/downloads/</code> for Git-bundled serving, or link external files (Google Drive, AWS S3, Dropbox, Mega).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 relative">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold mb-4">
                3
              </div>
              <h3 className="text-sm font-semibold text-white mb-2">
                Automatic Vercel CI/CD
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Every <code className="text-cyan-400 bg-zinc-950 px-1 py-0.5 rounded">git push</code> instantly triggers a live deployment on Vercel with zero server maintenance.
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/admin"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold border border-zinc-700 transition-all"
            >
              <GitBranch className="w-4 h-4 text-emerald-400" />
              <span>Open Admin Configurator</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Unlock Dialog */}
      <UnlockModal
        item={activeItem}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setActiveItem(null);
        }}
      />
    </div>
  );
}
