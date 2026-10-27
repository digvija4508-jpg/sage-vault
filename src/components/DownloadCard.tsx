"use client";

import { useState } from "react";
import { PublicDownloadItem } from "@/types/download";
import {
  Lock,
  Unlock,
  FileText,
  FileArchive,
  FileCode,
  FileBox,
  Share2,
  Check,
  Calendar,
  HardDrive,
  Sparkles,
} from "lucide-react";

interface DownloadCardProps {
  item: PublicDownloadItem;
  onUnlockClick: (item: PublicDownloadItem) => void;
}

export default function DownloadCard({ item, onUnlockClick }: DownloadCardProps) {
  const [copied, setCopied] = useState(false);

  const getFileIcon = (type: string) => {
    switch (type) {
      case "zip":
      case "archive":
        return <FileArchive className="w-5 h-5 text-amber-400" />;
      case "code":
        return <FileCode className="w-5 h-5 text-cyan-400" />;
      case "installer":
        return <FileBox className="w-5 h-5 text-indigo-400" />;
      case "pdf":
      case "docx":
      default:
        return <FileText className="w-5 h-5 text-emerald-400" />;
    }
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/d/${item.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={() => !item.isExpired && onUnlockClick(item)}
      className={`group relative flex flex-col justify-between p-6 rounded-2xl bg-zinc-900/70 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-950/20 cursor-pointer overflow-hidden ${
        item.isExpired ? "opacity-60 cursor-not-allowed hover:border-zinc-800" : ""
      }`}
    >
      {/* Top ambient highlight on hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/0 group-hover:via-emerald-500/50 to-transparent transition-all duration-500" />

      <div>
        {/* Top meta row */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-zinc-800/80 border border-zinc-700/50 text-[11px] font-semibold text-zinc-300">
              {item.category}
            </span>
            {item.isFeatured && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-[10px] font-semibold text-amber-300">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Featured
              </span>
            )}
          </div>

          {/* Share Direct Link Button */}
          <button
            type="button"
            onClick={handleCopyLink}
            title="Copy direct share link"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Title & Description */}
        <h3 className="text-base font-semibold text-white group-hover:text-emerald-300 transition-colors mb-2 line-clamp-1">
          {item.title}
        </h3>
        <p className="text-xs text-zinc-400 leading-relaxed mb-5 line-clamp-2">
          {item.description}
        </p>

        {/* File Details Box */}
        <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-between text-xs mb-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 shrink-0">
              {getFileIcon(item.fileType)}
            </div>
            <div className="min-w-0">
              <p className="text-zinc-300 font-medium truncate text-xs">{item.fileName}</p>
              <div className="flex items-center gap-3 text-[11px] text-zinc-500 mt-0.5">
                <span className="flex items-center gap-1">
                  <HardDrive className="w-3 h-3" />
                  {item.fileSize}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {item.createdAt}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA Button */}
      <div className="pt-2">
        {item.isExpired ? (
          <div className="w-full py-2.5 px-4 rounded-xl bg-zinc-800/50 border border-zinc-800 text-center text-xs font-medium text-zinc-500">
            Link Expired
          </div>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onUnlockClick(item);
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-800 group-hover:bg-emerald-600 text-zinc-200 group-hover:text-white text-xs font-semibold border border-zinc-700/80 group-hover:border-emerald-500 transition-all duration-200 shadow-sm"
          >
            <Lock className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors" />
            <span>Unlock with Pass</span>
          </button>
        )}
      </div>
    </div>
  );
}
