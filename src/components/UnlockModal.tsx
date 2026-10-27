"use client";

import { useState, useEffect, useRef } from "react";
import { PublicDownloadItem } from "@/types/download";
import {
  Lock,
  Unlock,
  Download,
  AlertCircle,
  Eye,
  EyeOff,
  X,
  FileCheck,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface UnlockModalProps {
  item: PublicDownloadItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function UnlockModal({ item, isOpen, onClose }: UnlockModalProps) {
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

  useEffect(() => {
    if (isOpen) {
      setPassword("");
      setError(null);
      setHint(null);
      setUnlockedData(null);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

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

      // Success
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-7 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {!unlockedData ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                  Protected Resource
                </span>
                <h3 className="text-lg font-bold text-white tracking-tight line-clamp-1">
                  {item.title}
                </h3>
              </div>
            </div>

            <p className="text-sm text-zinc-400 mb-5 leading-relaxed">
              Enter the authorized access passcode to unlock and download this file package.
            </p>

            {/* File info pill */}
            <div className="p-3 mb-5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-zinc-300">
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px] uppercase font-bold">
                  {item.fileType}
                </span>
                <span className="truncate max-w-[200px]">{item.fileName}</span>
              </div>
              <span className="text-zinc-500 font-medium">{item.fileSize}</span>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5 text-rose-300 text-xs">
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

            {/* Form */}
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Access Passcode
                </label>
                <div className="relative">
                  <input
                    ref={inputRef}
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter passcode..."
                    className="w-full px-4 py-2.5 pr-11 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white placeholder-zinc-500 outline-none transition-all"
                    disabled={isLoading}
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {item.hint && !hint && (
                  <p className="mt-1.5 text-[11px] text-zinc-500 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Hint: {item.hint}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !password.trim()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold shadow-lg shadow-emerald-600/20 transition-all"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Unlock</span>
                      <Unlock className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Unlocked State */
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-4 animate-bounce">
              <FileCheck className="w-8 h-8" />
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Access Granted
            </span>

            <h3 className="text-xl font-bold text-white mt-3 mb-1">
              File Unlocked!
            </h3>
            <p className="text-sm text-zinc-400 max-w-xs mx-auto mb-6">
              Your download has initiated. If it didn&apos;t start automatically, click the button below.
            </p>

            <a
              href={unlockedData.downloadUrl}
              download={unlockedData.fileName}
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-xl shadow-emerald-600/30 transition-all hover:scale-[1.02]"
            >
              <Download className="w-4 h-4" />
              <span>Download {unlockedData.fileName}</span>
            </a>

            <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-zinc-500">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>Signed session active for {unlockedData.expiresInMinutes} minutes</span>
            </div>

            <button
              onClick={onClose}
              className="mt-6 text-xs text-zinc-400 hover:text-white underline underline-offset-4 transition-colors"
            >
              Close this window
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
