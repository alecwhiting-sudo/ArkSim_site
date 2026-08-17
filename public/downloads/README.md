# Installer downloads

Drop the ArkSim desktop installers in **this folder** and the Download buttons
on the site will serve them. The filenames must match the paths in
[`src/lib/site.ts`](../../src/lib/site.ts) (`downloads.mac.href` /
`downloads.windows.href`). With the current defaults:

```
public/downloads/ArkSim-0.1.0-universal.dmg      ← macOS (universal .dmg)
public/downloads/ArkSim-Setup-0.1.0.exe          ← Windows (64-bit .exe)
```

When you cut a new version, bump `version` and the filenames in `site.ts` to
match, and add the new files here.

## ⚠️ File-size limit

GitHub **rejects any file larger than 100 MB** on a normal `git push`. Electron
installers often exceed that. If yours do, don't commit them here — instead:

1. Create a **GitHub Release** and upload the installers as release assets.
2. Paste the release-asset URLs (full `https://…` links) into
   `downloads.mac.href` / `downloads.windows.href` in `site.ts`.

The Download component uses a full `https://` URL as-is, and treats a
leading-slash path (like the defaults above) as a file in this folder — so you
can switch between the two approaches just by changing the `href`.
