🍁 Canada Immigration Advisor
A free, multilingual tool that helps people evaluate their candidacy to immigrate to Canada — without paying a consultant.
Languages: Español · English · Français
Features:
CRS score calculator (official canada.ca tables, updated for 2025)
Express Entry eligibility check (FSWP, CEC, FSTP)
Provincial Nominee Program (PNP) matching by province
Atlantic Immigration Program (AIP) guidance
Quebec Skilled Worker Program (QSWP)
Study → PGWP → PR pathway
AI chat assistant powered by Claude (answers in the user's language)
---
Quick Start (local development)
```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/canada-immigration-advisor.git
cd canada-immigration-advisor

# 2. Install dependencies
npm install

# 3. (Optional) Set your Anthropic API key so users skip the key screen
cp .env.example .env
# Edit .env and add your key: VITE_ANTHROPIC_API_KEY=sk-ant-...

# 4. Run dev server
npm run dev
```
Open http://localhost:5173/canada-immigration-advisor/
---
Deploy to GitHub Pages (automatic)
Push this repo to GitHub.
Go to Settings → Pages → Source: GitHub Actions.
Push any commit to `main` — the workflow deploys automatically.
Your app will be live at: `https://YOUR_USERNAME.github.io/canada-immigration-advisor/`
Optional: pre-load the API key (recommended for your own deployment)
Instead of asking users for a key, you can embed yours at build time:
Go to Settings → Secrets and variables → Actions.
Add a new secret: `VITE_ANTHROPIC_API_KEY` = your key.
Re-run the workflow.
> ⚠️ The key will be embedded in the JavaScript bundle (visible to anyone who opens DevTools). Fine for a prototype or internal tool — for public production use, add a backend proxy.
---
Project structure
```
canada-immigration-advisor/
├── src/
│   ├── main.jsx          # React entry point
│   └── App.jsx           # Full application (all components + logic)
├── index.html
├── vite.config.js        # Update base: '/your-repo-name/'
├── package.json
├── .env.example
└── .github/
    └── workflows/
        └── deploy.yml    # Auto-deploy to GitHub Pages
```
---
Updating the repo name
If your GitHub repo is named something other than `canada-immigration-advisor`, update `vite.config.js`:
```js
base: '/your-repo-name/',
```
---
Tech stack
React 18
Vite 5
Claude API (claude-sonnet-4)
Pure CSS (no UI library)
---
Disclaimer
This tool uses official Canadian government data (canada.ca) for CRS calculations. It is informational only and does not constitute legal or immigration advice. Always verify information at canada.ca and consult a Regulated Canadian Immigration Consultant (RCIC) for complex cases.
