"use client";

import { useState, useRef } from "react";
import { PublicDownloadItem } from "@/types/download";
import {
  Lock,
  Unlock,
  Download,
  AlertCircle,
  Eye,
  EyeOff,
  FileCheck,
  Clock,
  Sparkles,
  HardDrive,
  Calendar,
  ArrowLeft,
  FileArchive,
  FileCode,
  FileBox,
  FileText,
} from "lucide-react";
import Link from "next/link";

interface DirectDownloadClientProps {
  item: PublicDownloadItem;
}

export default function DirectDownloadClient({ item }: DirectDownloadClientProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [unlockedData, setUnlockedData] = useState<{
    downloadUrl: string;
    fileName: string;
    expiresInMinutes: number;
  } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (type: string) => {
    switch (type) {
      case "zip":
      case "archive":
        return <FileArchive className="w-8 h-8 text-amber-400" />;
      case "code":
        return <FileCode className="w-8 h-8 text-cyan-400" />;
      case "installer":
        return <FileBox className="w-8 h-8 text-indigo-400" />;
      case "pdf":
      case "docx":
      default:
        return <FileText className="w-8 h-8 text-emerald-400" />;
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Please type your access passcode.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: item.id,
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Incorrect passcode. Please try again.");
        if (data.hint) {
          setHint(data.hint);
        }
        setIsLoading(false);
        return;
      }

      setUnlockedData({
        downloadUrl: data.downloadUrl,
        fileName: data.fileName,
        expiresInMinutes: data.expiresInMinutes || 15,
      });

      // Auto trigger download
      window.location.href = data.downloadUrl;
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 selection:bg-emerald-500/30 selection:text-emerald-200">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-gradient-to-b from-emerald-500/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Back button */}
      <div className="w-full max-w-lg mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Downloads</span>
        </Link>
      </div>

      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-7 sm:p-9 shadow-2xl relative overflow-hidden">
        {/* Top ambient highlight */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

        {!unlockedData ? (
          <div>
            {/* Header / File Icon */}
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 shrink-0">
                {getFileIcon(item.fileType)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 text-[10px] uppercase font-semibold text-zinc-300">
                    {item.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-zinc-500">
                    <Calendar className="w-3 h-3" />
                    {item.createdAt}
                  </span>
                </div>
                <h1 className="text-xl font-bold text-white tracking-tight leading-snug">
                  {item.title}
                </h1>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
              {item.description}
            </p>

            {/* File details container */}
            <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-between text-xs mb-6">
              <span className="font-mono text-zinc-300 truncate max-w-[240px]">
                {item.fileName}
              </span>
              <span className="text-zinc-500 font-medium shrink-0 flex items-center gap-1">
                <HardDrive className="w-3.5 h-3.5" />
                {item.fileSize}
              </span>
            </div>

            {/* Expired alert */}
            {item.isExpired ? (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                This download has expired and is no longer available. Please contact the file owner.
              </div>
            ) : (
              <div>
                {/* Error Banner */}
                {error && (
                  <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5 text-rose-300 text-xs">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-400" />
                    <div>
                      <p>{error}</p>
                      {hint && (
                        <p className="mt-1 text-zinc-400">
                          <strong className="text-zinc-300">Hint:</strong> {hint}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <form onSubmit={handleVerify} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Required Passcode
                    </label>
                    <div className="relative">
                      <input
                        ref={inputRef}
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter passcode..."
                        className="w-full px-4 py-3 pr-11 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white placeholder-zinc-500 outline-none transition-all"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {item.hint && !hint && (
                      <p className="mt-2 text-[11px] text-zinc-500 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Passcode Hint: {item.hint}</span>
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !password.trim()}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold shadow-xl shadow-emerald-600/25 transition-all"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Unlock className="w-4 h-4" />
                        <span>Unlock &amp; Download File</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        ) : (
          /* Unlocked Success */
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-4 animate-bounce">
              <FileCheck className="w-8 h-8" />
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Verified
            </span>

            <h2 className="text-2xl font-bold text-white mt-3 mb-1">
              File Unlocked!
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-sm mx-auto mb-6">
              Your file is ready. If downloading didn&apos;t start automatically, click below.
            </p>

            <a
              href={unlockedData.downloadUrl}
              download={unlockedData.fileName}
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-xl shadow-emerald-600/30 transition-all hover:scale-[1.02]"
            >
              <Download className="w-4 h-4" />
              <span>Download {unlockedData.fileName}</span>
            </a>

            <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-zinc-500">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>Secure download link active for {unlockedData.expiresInMinutes} minutes</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
