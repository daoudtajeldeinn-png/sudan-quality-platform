# 🧠 AI CONTEXT FILE — Sudan Quality Platform
> Paste this entire file at the START of any new AI chat session.
> Last updated: June 2026 | Maintained by: Dr. Daoud (SCI, Sudan)

---

## 1. WHO I AM

- **Name**: Dr. Daoud — GMP/GLP/ISO/QC/QA specialist & solo developer
- **Organization**: Sudanese Chemical Industries (SCI), Khartoum, Sudan
- **GitHub**: `daoudtajeldeinn-png`
- **Working languages**: Arabic + English (bilingual UI required)
- **OS / Shell**: Windows 11, Git Bash (MINGW64), OneDrive-synced folders
- **Known issue**: OneDrive file locking during git operations → always type `n` to retry prompts

---

## 2. PROJECT IDENTITY

| Property | Value |
|---|---|
| **Project name** | Sudan Quality Platform (منصة السودان للجودة) |
| **Purpose** | Pharmaceutical quality training & gamification platform for Sudanese pharmacists/chemists |
| **GitHub repo** | `https://github.com/daoudtajeldeinn-png/sudan-quality-platform` |
| **Local path** | `C:\Users\daoud\OneDrive\Desktop\sudan-quality-platform` ← USE THIS |
| **Wrong path** | `C:\Users\daoud\OneDrive\Desktop\منصة السودان للجودة` ← IGNORE (old duplicate) |

---

## 3. ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND                                  │
│  React + Vite (JavaScript)                                   │
│  Hosted: Firebase Hosting                                    │
│  Project ID: decisive-octane-472816-d3                       │
│  Live URL: https://decisive-octane-472816-d3.web.app/        │
│  Old Vercel URL: sudan-quality-frontend-*.vercel.app (stale) │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST API calls
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND                                   │
│  Node.js + Express                                           │
│  Hosted: Vercel (serverless)                                 │
│  Live URL: [check src/services/api.js for current URL]       │
│  Auth: JWT + Firebase Auth (Google popup)                    │
│  DB: MongoDB Atlas (mongoose)                                │
└─────────────────────────────────────────────────────────────┘
```

### Key Frontend Files
```
src/
  services/
    api.js          ← PRIMARY API client — check VITE_API_URL here
    api-clean.js    ← secondary (must match api.js URL)
  contexts/
    GamificationContext.jsx   ← gamification state, null-safety required
    LanguageContext.jsx        ← AR/EN toggle + RTL
  components/
    Dashboard_main.jsx         ← main dashboard
  content/
    content_new.js             ← bilingual {ar, en} content objects
.env.production                ← MUST contain: VITE_API_URL=https://[vercel-backend-url]
firebase.json                  ← Firebase Hosting config + CSP/COOP headers
vercel.json                    ← SPA rewrite rules for backend
```

### Backend Structure
```
backend/
  server.js         ← main Express server (binds 0.0.0.0:PORT)
  render.yaml       ← Render.com config (backup deploy option)
  routes/           ← API route handlers
  models/           ← Mongoose models
scripts/
  seed.js
  insert-questions.js
  seed-cleaning-validation.js
```

---

## 4. DEPLOYMENT FACTS

### Firebase Hosting (Frontend)
- Deploy command: `firebase deploy --only hosting`
- Project: `decisive-octane-472816-d3`
- `firebase.json` includes custom CSP + COOP headers (required for Google Auth popup)

### Vercel (Backend)
- Push to trigger redeploy: `git push origin main`
- `vercel.json` at repo root handles SPA rewrites
- Environment variables set in Vercel dashboard (not in repo)

### Critical: API URL Consistency
The most common bug is URL mismatch. These three must all point to the SAME backend:
1. `.env.production` → `VITE_API_URL`
2. `src/services/api.js` → base URL
3. `src/services/api-clean.js` → base URL

---

## 5. AUTHENTICATION

- **Method**: Firebase Auth with Google popup (`signInWithPopup`)
- **Known bug (fixed)**: Firebase UID ≠ MongoDB `userId` → fixed by using Firebase UID consistently
- **JWT**: Used for backend session validation after Firebase login
- **CSP header**: `firebase.json` must allow `accounts.google.com` and `apis.google.com`
- **COOP header**: Must be `same-origin-allow-popups` (NOT `same-origin`) for Google popup

---

## 6. DATABASE (MongoDB Atlas)

- **ORM**: Mongoose (deprecated options removed — no `useNewUrlParser` etc.)
- **Connection**: Atlas URI in Vercel env vars as `MONGODB_URI`
- **User model**: Firebase UID is the primary user identifier

### Key Collections
| Collection | Purpose |
|---|---|
| users | User profiles + Firebase UID |
| questions | Training quiz questions (AR/EN) |
| courses | Training course content |
| completions | Course/quiz completion tracking |
| gamification | Points, badges, leaderboard |

---

## 7. GAMIFICATION SYSTEM

- Context: `src/contexts/GamificationContext.jsx`
- **Rule**: Always null-check before destructuring context
  ```js
  // CORRECT
  const ctx = useGamification();
  if (!ctx) return null;
  const { points, badges } = ctx;
  
  // WRONG — crashes on first render
  const { points } = useGamification();
  ```

---

## 8. BILINGUAL SYSTEM (AR/EN)

- All strings in `src/content/content_new.js` as `{ ar: "...", en: "..." }` objects
- `LanguageContext.jsx` provides `lang` ('ar'|'en') + RTL direction toggle
- RTL: `document.dir = lang === 'ar' ? 'rtl' : 'ltr'`
- **Rule**: Never hardcode Arabic or English strings in JSX components

---

## 9. TRAINING CONTENT (8 Certificate Tracks)

| Track | Topic |
|---|---|
| A | Cleaning Validation |
| B | Process Validation |
| C | Analytical Method Validation (ICH Q2[R2]) |
| D | Equipment Qualification (IQ/OQ/PQ) |
| E | Computerized System Validation (EU Annex 11, GAMP 5 2nd ed.) |
| F | GDP / Cold Chain |
| G | ICH Q14 / Analytical Procedure Lifecycle |
| H | CAPA & Deviation Management |

- Audience: Sudanese pharmacists & pharmaceutical chemists
- Regulatory framework: WHO, FDA 21 CFR, EU GMP, ICH, Zone IVb climate

---

## 10. BUG HISTORY

### ✅ Fixed
| Bug | Fix |
|---|---|
| Certificate not issuing | Firebase UID ↔ MongoDB userId mismatch → unified to Firebase UID |
| `useGamification()` crash | Added null guard before destructuring |
| Mongoose deprecated options | Removed `useNewUrlParser`, `useUnifiedTopology` |
| CORS preflight errors | Added OPTIONS handler + proper headers |
| Google Auth popup blocked | Fixed CSP + COOP headers in `firebase.json` |
| API URL mismatch | Added `.env.production` with `VITE_API_URL` |
| Old backend URLs in source | Replaced in `api.js` + `api-clean.js` |

### ⚠️ Outstanding / Watch-Out
| Issue | Notes |
|---|---|
| Duplicate repo structure | `OneDrive/Desktop/منصة السودان للجودة/` still in git — ghost folder, never edit files there |
| Build artifacts in git | `dist/` and `.vite/` committed — should be in `.gitignore` |
| `api-clean.js` drift | Must stay in sync with `api.js` after any URL change |
| Vercel backend URL | Can change on redeploy — verify in dashboard, update `.env.production` |

---

## 11. GIT WORKFLOW

```bash
# Remote
origin → https://github.com/daoudtajeldeinn-png/sudan-quality-platform

# Push
git add .
git commit -m "feat: description"
git push origin main
# OneDrive file lock → type 'n' repeatedly until done

# Deploy frontend
firebase deploy --only hosting
```

---

## 12. ENVIRONMENT VARIABLES

### Frontend (`.env.production` at repo root)
```
VITE_API_URL=https://[current-vercel-backend-url]
```

### Backend (Vercel Dashboard)
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
FIREBASE_PROJECT_ID=decisive-octane-472816-d3
NODE_ENV=production
PORT=5000
```

---

## 13. HOW TO USE THIS FILE EFFICIENTLY

**Start every AI session**: Paste this file, then say exactly what you need.

**Efficient patterns:**
- Bug fix → "This file has a bug: [paste file]. Error: [paste error]. Fix only [function name]."
- Feature → "Add [feature] to this file: [paste file]. Follow existing code style."
- Deploy issue → "Deploy fails with: [paste error]. Config files: [paste them]."

**Never** ask the AI to "look at the repo" — always paste the actual file content. It saves credits and prevents hallucinations.

---

## 14. CURRENT STATUS (June 2026)

| Area | Status |
|---|---|
| Frontend (Firebase) | ✅ Live |
| Backend (Vercel) | ✅ Live |
| Google Auth | ✅ Working |
| Bilingual AR/EN | ✅ Complete |
| Training content (8 tracks) | 🔄 Content population in progress |
| Gamification | ✅ Core working |
| Completion tracking | ✅ Schema in place |
| Repo cleanliness | ⚠️ Duplicate structure + artifacts in git |
| Certificate generation | 🔄 Planned |

---

*Keep this file updated after every resolved issue. It is your most valuable tool for working with AI efficiently.*
