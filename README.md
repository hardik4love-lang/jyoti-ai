# 🌟 Jyoti AI — Next-Gen 100% Free & Zero-Cost AI Vedic Astrologer

> An open-source, private, and mathematically precise alternative to commercial apps like Reva AI Astrologer. Built with zero subscriptions, zero autopay traps, and true client-side ephemeris calculations.

---

## ⚡ Why Build an Alternative to Reva?

Commercial apps like **Reva** (`com.mohallatech.reva` by Mohalla Tech / ShareChat) charge users up to **₹699/month** through recurring UPI Autopay mandates that trigger after ₹1 introductory promotional trials. Furthermore, they process private birth charts and intimate life queries on centralized servers.

**Jyoti AI proves that a 10x better Vedic Astrologer can be built and run at $0 cost forever:**

| Feature | Reva AI Astrologer | Jyoti AI (This App) |
| :--- | :--- | :--- |
| **Price** | ₹1 trial $\rightarrow$ **₹699/month** recurring mandate | **100% Free Forever ($0 Cost)** |
| **Autopay / Mandates** | Yes (PhonePe, GPay, Paytm) | **Zero (No cards, no UPI, no bank accounts)** |
| **Vedic Math Engine** | Proprietary backend server | **Deterministic Client-Side Ephemeris (WASM / JS)** |
| **Privacy & Storage** | Cloud database with tracking | **100% Local (Stored on your device via IndexedDB)** |
| **Offline Support** | Requires continuous internet | **Works fully offline as a PWA** |
| **AI Intelligence** | Paid Cloud LLM | **Dual: Local Jyotish Engine + Free Gemini/Groq** |
| **Chart Styles** | Single North Indian view | **Dual: Classical North Indian + South Indian SVG** |
| **Audio Ambience** | Heavy streaming assets | **Synthesized 432Hz Web Audio (0 MB download)** |

---

## 🛠️ System Architecture

```
+-----------------------------------------------------------------------------------------+
|                                  JYOTI AI ARCHITECTURE                                  |
|                                                                                         |
|  [User Birth Form]            [Deterministic Client-Side Engine]                        |
|  • Date, Time, City   ----->  • Julian Day & Lahiri Ayanamsha                           |
|  • Instant Offline             • 9 Planetary Longitudes (Sun..Ketu)                      |
|    Autocomplete (120+ cities) • 12 Bhavas, 27 Nakshatras & 4 Padas                     |
|                               • Vimshottari Mahadasha / Antardasha                      |
|                               • Manglik & Sade Sati Status                              |
|                                                |                                        |
|                       +------------------------+-----------------------+                |
|                       |                                                |                |
|                       v                                                v                |
|           [SVG Chart Visualizer]                          [AI Intelligence Engine]      |
|           • North Indian Diamond                          • Mode 1: Local Jyotish Expert|
|           • South Indian Square                             (Zero API Key, Offline)     |
|           • Interactive Metrics                           • Mode 2: Free Gemini / Groq  |
|                                                             (1,500 req/day free tier)   |
+-----------------------------------------------------------------------------------------+
```

---

## 🚀 Instant Local Run

You can run Jyoti AI locally in 5 seconds with any static server:

```bash
# Navigate to the project directory
cd C:\Users\om\.gemini\antigravity\scratch\reva-zero

# Test the core calculation engine
npm test

# Launch the app locally
npx serve .
# Or open index.html directly in any modern browser!
```

---

## 🌐 Deploy to Cloudflare Pages / Vercel ($0 Forever)

Because Jyoti AI has zero server-side code and executes entirely in the client's browser, you can host it for **unlimited users at $0 cost**:

### Deploy to Cloudflare Pages:
1. Push the `reva-zero` folder to a GitHub repository.
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) $\rightarrow$ **Workers & Pages** $\rightarrow$ **Create Application** $\rightarrow$ **Pages**.
3. Connect your repository. Leave the build command empty, set root directory to `/`, and click **Deploy**.
4. You get an instantaneous, free global SSL website (`your-app.pages.dev`).

### Deploy to Vercel / GitHub Pages:
* Run `npx vercel` in the project directory, or enable GitHub Pages under your repository settings pointing to `/root`.

---

## 📱 Install as a Native App on Phone (PWA)

* **Android (Chrome):** Open your deployed URL $\rightarrow$ Tap the three dots $\rightarrow$ Tap **"Install app"** or **"Add to Home screen"**.
* **iOS (Safari):** Open your deployed URL $\rightarrow$ Tap the Share button $\rightarrow$ Tap **"Add to Home Screen"**.

The app will launch in fullscreen with zero browser address bar, complete with an offline cache and splash screen.

---

## 🛡️ License
MIT Open Source — Free for personal and commercial distribution.
