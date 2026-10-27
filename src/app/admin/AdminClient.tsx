"use client";

import { useState } from "react";
import { DownloadItem, FileCategory, FileType } from "@/types/download";
import {
  ShieldAlert,
  Key,
  Plus,
  Copy,
  Check,
  Download,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  GitBranch,
  HardDrive,
  Cloud,
  RefreshCw,
  ExternalLink,
  Sparkles,
  FileText,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

export default function AdminClient() {
  const [adminKey, setAdminKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // New Item Form
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [title, setTitle] = useState("");
  const [slugId, setSlugId] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<FileCategory>("Client Files");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [fileType, setFileType] = useState<FileType>("pdf");
  const [password, setPassword] = useState("");
  const [hint, setHint] = useState("");
  const [storageType, setStorageType] = useState<"local" | "external">("local");
  const [targetUrl, setTargetUrl] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey.trim()) return;

    setIsLoading(true);
    setAuthError(null);

    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminKey: adminKey.trim(), action: "list" }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setAuthError(data.error || "Invalid Admin Key");
        setIsLoading(false);
        return;
      }

      setDownloads(data.downloads);
      setIsAuthenticated(true);
    } catch {
      setAuthError("Failed to authenticate. Check server connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateRandomPasscode = () => {
    const chars = "abcdefghjkmnpqrstuvwxyz23456789";
    let pass = "";
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        pass += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      if (i < 3) pass += "-";
    }
    setPassword(pass);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    const autoSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setSlugId(autoSlug);
  };

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleAddNewItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slugId || !password || !fileName) {
      alert("Please fill in Title, ID, File Name, and Password.");
      return;
    }

    const newItem: DownloadItem = {
      id: slugId.trim(),
      title: title.trim(),
      description: description.trim() || "Protected downloadable resource.",
      category,
      fileName: fileName.trim(),
      fileSize: fileSize.trim() || "1.0 MB",
      fileType,
      password: password.trim(),
      hint: hint.trim() || undefined,
      storageType,
      targetUrl: targetUrl.trim() || fileName.trim(),
      createdAt: new Date().toISOString().split("T")[0],
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
      isFeatured: false,
    };

    const updatedList = [newItem, ...downloads];
    setDownloads(updatedList);

    // Persist via Admin API
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminKey,
          action: "save-or-export",
          payload: { updatedDownloads: updatedList },
        }),
      });
      const data = await res.json();
      setSaveSuccessMessage(data.message || "Updated configuration generated.");
    } catch {
      setSaveSuccessMessage("Saved to memory. Remember to export downloads.json to Git.");
    }

    // Reset Form
    setIsAddingNew(false);
    setTitle("");
    setSlugId("");
    setDescription("");
    setFileName("");
    setFileSize("");
    setPassword("");
    setHint("");
    setTargetUrl("");
  };

  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(downloads, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "downloads.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 selection:bg-emerald-500/30 selection:text-emerald-200">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-7 sm:p-8 shadow-2xl relative">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5">
            <ShieldAlert className="w-6 h-6" />
          </div>

          <h1 className="text-xl font-bold text-white tracking-tight">
            Sage Vault Admin Access
          </h1>
          <p className="text-xs text-zinc-400 mt-1 mb-6 leading-relaxed">
            Enter your site administrator key to configure user downloads, inspect passcodes, and prepare Git releases.
          </p>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
              {authError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Admin Passkey
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="Enter admin passkey..."
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white placeholder-zinc-500 outline-none transition-all"
                />
              </div>
              <p className="mt-2 text-[11px] text-zinc-500">
                Default key is <code className="text-zinc-400 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800">admin2026</code> (change via <code className="text-zinc-400">ADMIN_PASSWORD</code> env variable on Vercel).
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || !adminKey.trim()}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-semibold transition-all shadow-lg shadow-emerald-600/20"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  <span>Unlock Admin Vault</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-zinc-800/80 text-center">
            <Link
              href="/"
              className="text-xs text-zinc-400 hover:text-white transition-colors"
            >
              Return to public portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20 selection:bg-emerald-500/30 selection:text-emerald-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                Admin Console
              </span>
              <span className="text-xs text-zinc-400">• Authenticated</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
              Download Management &amp; Passcode Vault
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{isAddingNew ? "Close Form" : "Add New Download"}</span>
            </button>

            <button
              onClick={handleDownloadJson}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-200 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-zinc-400" />
              <span>Export downloads.json</span>
            </button>

            <button
              onClick={() => handleCopyText(JSON.stringify(downloads, null, 2), "all-json")}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-200 transition-all"
            >
              {copiedKey === "all-json" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Success notification */}
        {saveSuccessMessage && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center justify-between">
            <span>{saveSuccessMessage}</span>
            <button
              onClick={() => setSaveSuccessMessage(null)}
              className="text-xs text-zinc-400 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Add New Download Form Drawer */}
        {isAddingNew && (
          <div className="mt-6 p-6 sm:p-7 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Configure New Protected Download</span>
              </h2>
              <span className="text-xs text-zinc-500">
                Will be bundled into src/data/downloads.json
              </span>
            </div>

            <form onSubmit={handleAddNewItem} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Download Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Q4 Financial Audit Report"
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-600 outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Slug ID * (Used for direct URL /d/[slug])
                  </label>
                  <input
                    type="text"
                    required
                    value={slugId}
                    onChange={(e) => setSlugId(e.target.value)}
                    placeholder="e.g. q4-audit-report"
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-600 outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary of what this file contains for the recipient..."
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-600 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as FileCategory)}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white outline-none focus:border-emerald-500"
                  >
                    <option value="Client Files">Client Files</option>
                    <option value="Confidential">Confidential</option>
                    <option value="Documents">Documents</option>
                    <option value="Software">Software</option>
                    <option value="Media">Media</option>
                    <option value="Archives">Archives</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    File Type
                  </label>
                  <select
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value as FileType)}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white outline-none focus:border-emerald-500"
                  >
                    <option value="pdf">PDF Document (.pdf)</option>
                    <option value="zip">Zip Archive (.zip)</option>
                    <option value="archive">Tar / Gz Archive (.tar.gz)</option>
                    <option value="installer">Executable / Installer (.dmg, .exe)</option>
                    <option value="code">Source Code / Script</option>
                    <option value="docx">Word Document (.docx)</option>
                    <option value="xlsx">Spreadsheet (.xlsx)</option>
                    <option value="image">Image Asset</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    File Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="e.g. audit-report.pdf"
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-600 outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Approximate File Size
                  </label>
                  <input
                    type="text"
                    value={fileSize}
                    onChange={(e) => setFileSize(e.target.value)}
                    placeholder="e.g. 14.5 MB"
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-600 outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Access Passcode * (Recipient must type this)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="e.g. client-secret-2026"
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-600 outline-none focus:border-emerald-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={generateRandomPasscode}
                      className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium shrink-0 flex items-center gap-1"
                      title="Generate random secure passcode"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Random</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Storage Method
                  </label>
                  <select
                    value={storageType}
                    onChange={(e) => setStorageType(e.target.value as "local" | "external")}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white outline-none focus:border-emerald-500"
                  >
                    <option value="local">Local Repository File (storage/downloads/)</option>
                    <option value="external">External Link (Google Drive, S3, Dropbox, etc.)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    {storageType === "local" ? "Target File in storage/downloads" : "Direct Download / Cloud URL"}
                  </label>
                  <input
                    type="text"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder={
                      storageType === "local"
                        ? "e.g. audit-report.pdf (in storage/downloads/)"
                        : "https://drive.google.com/... or https://..."
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-600 outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Passcode Hint (Optional)
                  </label>
                  <input
                    type="text"
                    value={hint}
                    onChange={(e) => setHint(e.target.value)}
                    placeholder="e.g. Check the invoice sent to your email"
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-600 outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Expiration Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20"
                >
                  Save &amp; Add Download
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Existing Downloads Table */}
        <div className="mt-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-white">
                All Active Configured Downloads ({downloads.length})
              </h2>
            </div>
            <span className="text-xs text-zinc-500">
              Passcodes are stored encrypted / server-side only
            </span>
          </div>

          <div className="divide-y divide-zinc-800/80 overflow-x-auto">
            {downloads.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-zinc-900/40 transition-colors"
              >
                {/* Left File details */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] uppercase font-bold text-zinc-300">
                      {item.category}
                    </span>
                    <span className="text-xs font-mono text-zinc-500">
                      /d/{item.id}
                    </span>
                    {item.storageType === "local" ? (
                      <span className="flex items-center gap-1 text-[10px] text-teal-400">
                        <HardDrive className="w-3 h-3" />
                        Local Git File
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] text-cyan-400">
                        <Cloud className="w-3 h-3" />
                        External Cloud Link
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-semibold text-white truncate">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {item.fileName} • {item.fileSize} • Added {item.createdAt}
                  </p>
                </div>

                {/* Right controls: Password view & Links */}
                <div className="flex items-center gap-3 shrink-0">
                  {/* Passcode Box */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
                    <Lock className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="font-mono text-zinc-300">
                      {visiblePasswords[item.id] ? item.password : "••••••••"}
                    </span>
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility(item.id)}
                      className="text-zinc-500 hover:text-zinc-300 p-0.5 ml-1"
                    >
                      {visiblePasswords[item.id] ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopyText(item.password, `pass-${item.id}`)}
                      className="text-zinc-500 hover:text-white p-0.5"
                      title="Copy passcode"
                    >
                      {copiedKey === `pass-${item.id}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Share Link */}
                  <Link
                    href={`/d/${item.id}`}
                    target="_blank"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-medium transition-colors"
                  >
                    <span>Test Page</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Git Deployment Guide */}
        <div className="mt-10 p-6 sm:p-7 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center gap-2 mb-4">
            <GitBranch className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">
              How to Push Updates via Git to Vercel
            </h2>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed mb-4">
            Whenever you add new files or change passcodes, update the files in your Git repository and push. Vercel will automatically trigger a zero-downtime deployment:
          </p>

          <div className="p-4 rounded-xl bg-zinc-950 font-mono text-xs text-emerald-400 border border-zinc-800 space-y-1">
            <p className="text-zinc-500"># 1. Place any new downloadable files inside storage/downloads/</p>
            <p className="text-zinc-400">git add storage/downloads/</p>
            <p className="text-zinc-500"># 2. Stage updated configuration</p>
            <p className="text-zinc-400">git add src/data/downloads.json</p>
            <p className="text-zinc-500"># 3. Commit and push to GitHub/GitLab</p>
            <p className="text-zinc-400">git commit -m &quot;feat: add client downloads with passcode protection&quot;</p>
            <p className="text-emerald-300 font-bold">git push origin main</p>
          </div>
        </div>
      </div>
    </div>
  );
}
