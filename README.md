# NovaPulse — Autonomous AI Platform & Design Suite

> A modern, zero-dependency, responsive web platform featuring dynamic theme switching, an interactive ROI & latency calculator, modular UI components, live search, and accessible forms.

---

## 🌟 Key Features

1. **Light & Dark Theme Engine**: Instant switching with system preference detection and `localStorage` persistence.
2. **Interactive ROI & Latency Calculator**: Real-time sliders calculating annual cloud cost savings, speedup factor, and developer hours saved with one-click clipboard report export.
3. **Dynamic Feature Catalog**: Filterable by categories (*AI Agents*, *Edge Engineering*, *Telemetry*, *Security*) with deep-dive modal inspection.
4. **Interactive Pricing Switcher**: Seamless toggle between Monthly and Annual billing (with automatic 20% discount calculation) and pre-filled checkout triggers.
5. **Accessible FAQ Accordion**: Expand/collapse with exclusive mode and real-time live search keyword filtering.
6. **Multi-Input Contact & Demo Booking Form**: Client-side regex validation, live character counters, loading states, `localStorage` inquiry storage, and toast notifications.
7. **Global Quick Search (`Ctrl + K` / `Cmd + K`)**: Modal search indexing sections, features, and FAQs with instantaneous navigation.
8. **Toast Notification System**: Dynamic, stacking non-blocking alerts (`success`, `error`, `info`, `warning`) with auto-dismiss.
9. **Fully Responsive & Accessible**: WCAG 2.1 AA compliant, skip-to-content link, semantic HTML5, keyboard navigation (`Tab`, `Enter`, `Escape`), tested across Mobile, Tablet, and Desktop.

---

## 📂 Project Directory Structure

```
modern-web-platform/
├── index.html                     # Semantic HTML5 single-page application
├── serve.ps1                      # Native Windows PowerShell local static HTTP server
├── README.md                      # Complete local setup and deployment documentation
├── assets/
│   ├── css/
│   │   ├── variables.css          # Design tokens (colors, typography, spacing, shadows)
│   │   ├── reset.css              # Modern CSS reset and accessibility focus states
│   │   ├── components.css         # Reusable buttons, cards, badges, modals, toasts
│   │   ├── layout.css             # Navigation, hero, grids, calculator, footer, media queries
│   │   └── animations.css         # Keyframe reveals, micro-interactions, reduced motion
│   └── js/
│       ├── app.js                 # Main application bootstrap & event listeners
│       ├── components/
│       │   ├── theme.js           # Dark/Light mode manager & persistence
│       │   ├── toast.js           # Toast alert stacking system
│       │   ├── modal.js           # Universal accessible modal controller
│       │   ├── navigation.js      # Sticky navbar, mobile drawer, scrollspy
│       │   ├── pricing.js         # Billing cycle toggle & plan selection
│       │   ├── accordion.js       # FAQ expand/collapse & live filter
│       │   ├── filter.js          # Feature tab filtering & detail modal
│       │   ├── interactiveDemo.js # Live ROI & latency calculator
│       │   └── forms.js           # Form validation, search index, local storage
│       └── data/
│           ├── featuresData.js    # Architectural features dataset
│           └── faqsData.js        # Frequently asked questions dataset
└── tests/
    └── verify-all.ps1             # 97-point automated verification & test suite
```

---

## 🚀 How to Run Locally

Because NovaPulse is built with pure, modern web standards (ES6 Modules, CSS3 custom properties, Semantic HTML5), there are **no build steps or npm installations required**.

### Option 1: Native Windows PowerShell Server (Included)
From the project folder, simply execute:
```powershell
powershell -ExecutionPolicy Bypass -File .\serve.ps1
```
Open your browser to:
```
http://localhost:8080/
```

### Option 2: Python HTTP Server (If Python is installed)
```bash
python -m http.server 8080
```

### Option 3: VS Code Live Server
1. Open the folder in VS Code: `code .`
2. Right-click `index.html` and click **"Open with Live Server"**.

---

## 🧪 Running Automated Tests

To run the automated test suite verifying DOM structure, accessibility labels, modal bindings, and JavaScript syntax:
```powershell
powershell -ExecutionPolicy Bypass -File .\tests\verify-all.ps1
```
Expected output: **97 Passed, 0 Failed**.

---

## 🌐 How to Publish Online for Free

### 1. Deploy via GitHub Pages
1. Initialize a git repository in the project folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of NovaPulse platform"
   ```
2. Create a new repository on [GitHub](https://github.com/new).
3. Push your code to GitHub:
   ```bash
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git branch -M main
   git push -u origin main
   ```
4. On GitHub, navigate to **Settings > Pages**.
5. Under **Build and deployment > Source**, select **Deploy from a branch**.
6. Set branch to `main` and folder to `/ (root)`, then click **Save**.
7. Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

### 2. Deploy via Vercel (Instant)
1. Install Vercel CLI (`npm i -g vercel`) or sign in to [vercel.com](https://vercel.com).
2. Click **Add New... > Project** and import your GitHub repository (or run `vercel` in the terminal).
3. Leave build settings as default (static site requires no build command).
4. Click **Deploy**. Your site will be live on a `*.vercel.app` domain with free SSL.

### 3. Deploy via Netlify
1. Log in to [netlify.com](https://www.netlify.com).
2. Drag and drop the `modern-web-platform` folder into the Netlify Drop box, or import via Git.
3. Publish directory: `.` (root).
4. Click **Deploy Site**.

### 4. Deploy via Cloudflare Pages
1. Go to the [Cloudflare Dashboard](https://dash.cloudflare.com) > **Workers & Pages**.
2. Click **Create Application > Pages > Connect to Git**.
3. Select your repository. Framework preset: **None**. Output directory: `/`.
4. Click **Save and Deploy**.
