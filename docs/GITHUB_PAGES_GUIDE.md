# 🚀 1-Click GitHub Pages Go-Live Deployment Guide

Jyoti AI is built as a **100% static, client-side, zero-infrastructure application**. It requires **$0 server hosting** and deploys automatically via GitHub Actions.

---

## ⚡ Step 1: Create a New GitHub Repository

1. Go to [GitHub New Repository](https://github.com/new).
2. Name your repository (e.g., `jyoti-ai` or `reva-zero`).
3. Set the repository to **Public** (required for free GitHub Pages).
4. Do **not** initialize with README or license (we already have a complete Git repository initialized locally).
5. Click **Create repository**.

---

## ⚡ Step 2: Push Your Local Repository to GitHub

Open terminal / PowerShell in `C:\Users\om\.gemini\antigravity\scratch\reva-zero` and run:

```bash
# Add your GitHub remote
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>.git

# Push the main branch
git branch -M main
git push -u origin main
```

---

## ⚡ Step 3: Enable GitHub Pages in 2 Clicks

1. In your GitHub repository, click on **Settings** (top right gear icon).
2. In the left sidebar, click on **Pages** (under "Code and automation").
3. Under **Build and deployment** &rarr; **Source**:
   - Change from *"Deploy from a branch"* to **"GitHub Actions"**.
4. That's it! The automated workflow in `.github/workflows/deploy.yml` will automatically build and publish your app within ~60 seconds.

Your live app will be accessible at:
```
https://<YOUR_GITHUB_USERNAME>.github.io/<YOUR_REPO_NAME>/
```

---

## 📱 Mobile App (PWA) Capabilities on GitHub Pages

- **Add to Home Screen**:
  - **Android / Chrome**: Shows an automatic 1-tap "Install App" banner. Once installed, it launches without the browser URL bar, with its own app icon and splash screen.
  - **iOS / Safari**: Tap the Share button (⎋) &rarr; "Add to Home Screen" (➕).
- **100% Offline Resilience**: Powered by `sw.js` and Service Worker caching. Works even in airplane mode.
- **Zero Ongoing Costs**: $0 compute, $0 database, $0 API bill.
