# Overwork download site

The public page for Overwork, the Windows app that runs coding agents on free Kilo and
OpenCode models. Live at https://sage-vault-five.vercel.app.

It is a static page (`index.html` + `assets/`), deployed on Vercel with no build step.

## Where the installer comes from

The installer is not stored in this repository. It is attached to a GitHub Release of this
repo, and every download button points at the latest release:

    https://github.com/digvija4508-jpg/sage-vault/releases/latest/download/Overwork-Setup-0.2.0.exe

`vercel.json` keeps the old links working: `/api/installer` redirects to that file, and
`/installer` goes to the install section.

## Shipping a new installer

1. Build it in the Overwork source tree: `node overwork/tools/build_installer.mjs`
   (writes `overwork/dist/Overwork-Setup-<version>.exe`).
2. Create a release here with the file attached:

       gh release create v1.9 "S:/Sage/overwork/dist/Overwork-Setup-0.2.0.exe" \
         --repo digvija4508-jpg/sage-vault --title "Overwork 0.2.0" --notes "..."

3. If the version (and so the file name) changed, update the file name in `index.html`
   and `vercel.json`, then redeploy.

## Deploy

    npx vercel deploy --prod

`.vercelignore` keeps the checker output (`.taste-skill/`, `shots/`) out of the upload.
