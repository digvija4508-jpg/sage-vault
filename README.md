# Sage Vault 🔐
### Passcode-Protected File Distribution Portal for Vercel & Git

A secure, modern web portal built with **Next.js (App Router)** and **Tailwind CSS** that lets you distribute private files, documents, and software releases to users guarded by passcodes.

---

## 🌟 Key Features

- **Passcode Protection**: Each file has its own individual passcode (or shared bundle pass).
- **Time-Signed Download Tokens**: Downloads are signed using HMAC-SHA256 with an expiration timer (default 15 minutes). Unauthenticated users cannot guess or scrape direct URLs.
- **Git-Based File Management**: Add new downloads or change passcodes simply by updating `src/data/downloads.json` and pushing to Git!
- **Flexible Storage Options**:
  - **Local Repository Files**: Place files directly inside `storage/downloads/` to bundle them in your repository.
  - **External Cloud Links**: For large files (>50MB, 1GB+, videos, software installers), link directly to Google Drive, AWS S3, Cloudflare R2, Dropbox, or GitHub Releases. Sage Vault authenticates the user before redirecting!
- **Quick Passcode Unlock**: Users with a passcode can paste it into the homepage search bar to instantly unlock and trigger their download.
- **Direct Share Links**: Share a dedicated link like `https://your-site.vercel.app/d/client-audit` where the client sees a focused passcode unlock screen.
- **Admin Vault (`/admin`)**: Visual web dashboard to inspect all active downloads, reveal passcodes, generate new download items, copy JSON, and download updated configuration.

---

## 🚀 How to Set Downloads via Git

### 1. The Configuration File: `src/data/downloads.json`
To add or update downloads, open `src/data/downloads.json` in your repository. Each download item looks like this:

```json
{
  "id": "q4-audit-report",
  "title": "Q4 Financial Audit & Compliance Report",
  "description": "Certified quarterly audit, tax compliance summary, and executive ledger.",
  "category": "Confidential",
  "fileName": "audit-report.pdf",
  "fileSize": "1.2 MB",
  "fileType": "pdf",
  "password": "audit-pass-2026",
  "hint": "Check the passcode in your onboarding email",
  "storageType": "local",
  "targetUrl": "audit-report.pdf",
  "createdAt": "2026-10-27",
  "expiresAt": null,
  "isFeatured": true
}
```

### 2. For Local Files (Bundled in Git)
1. Drop the file inside `storage/downloads/` (e.g. `storage/downloads/audit-report.pdf`).
2. In `downloads.json`, set `"storageType": "local"` and `"targetUrl": "audit-report.pdf"`.
3. Set your desired passcode in `"password": "your-secret-pass"`.

### 3. For External Cloud Files (Google Drive / S3 / Dropbox / WeTransfer)
1. Upload the file to your cloud storage and get a direct link.
2. In `downloads.json`, set:
   ```json
   "storageType": "external",
   "targetUrl": "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID"
   ```
3. Set your passcode. Users will only be redirected to the download after successfully entering the pass!

---

## ⚡ Step-by-Step Vercel Deployment via Git

### Step 1: Push your Code to GitHub
Run the following commands in this directory:

```bash
git add .
git commit -m "feat: initial sage vault download portal"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### Step 2: Import into Vercel
1. Go to [https://vercel.com/new](https://vercel.com/new).
2. Connect your GitHub account and select your repository (`YOUR_REPO_NAME`).
3. Vercel automatically detects Next.js.
4. Under **Environment Variables**, add:
   - `ADMIN_PASSWORD` (e.g. `your-custom-admin-password`)
   - `DOWNLOAD_SECRET` (e.g. `a-long-random-secret-string-here`)
5. Click **Deploy**.

Within 1-2 minutes, your website is live worldwide on a `.vercel.app` domain (or your custom domain)!

### Step 3: Updating Files in the Future
Whenever you want to add new downloads or change a passcode:
```bash
# 1. Update src/data/downloads.json (or drop a new file in storage/downloads/)
# 2. Commit and push:
git add .
git commit -m "Add new client package"
git push
```
Vercel will detect the push and automatically redeploy within seconds!

---

## 🛡️ Admin Vault

Visit `https://your-domain.vercel.app/admin`
- Default password: `admin2026` (change via `ADMIN_PASSWORD` environment variable).
- View all download entries, reveal/hide passwords, and generate new items using the interactive form.

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portal.
