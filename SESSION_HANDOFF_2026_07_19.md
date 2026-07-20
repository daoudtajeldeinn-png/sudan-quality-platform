# Sudan Quality Platform — Session Handoff
_Generated: 2026-07-19 | Use this file to start any new AI session_

---

## 🚀 Project Overview
**Sudan Quality Platform** — Pharmaceutical quality training with 24 courses, quizzes, certificates.

- **Frontend**: React/Vite → Firebase: `https://decisive-octane-472816-d3.web.app`
- **Backend**: Node.js/Express → Vercel: `https://backend-lime-gamma-gf9yal9mmd.vercel.app`
- **Database**: Supabase (questions, certificates, progress)
- **Auth**: Firebase Auth (Google Sign-In)
- **Git repo**: `daoudtajeldeinn-png/sudan-quality-platform`
- **Active branch**: `cleanup/remove-duplicates-and-backups`
- **Local path**: `C:\Users\daoud\OneDrive\Desktop\منصة السودان للجودة\`

---

## ✅ Completed This Session (2026-07-19)

### 1. Admin Role Detection
- `src/hooks/useAuth.js` — `isAdmin` flag added, `ADMIN_EMAILS` array defined
- Returns `isAdmin` in hook return object
- Sets `isAdmin` to `false` on logout

### 2. App.jsx Routing
- Imports `AdminDashboard` and `StudentShell`
- Admin users → `<AdminDashboard>`
- Student users → `<StudentShell>` (wraps Dashboard)
- Floating toggle button: admin can switch to student view and back
- ErrorBoundary updated to navy/gold "Under Maintenance" UI

### 3. AdminDashboard.jsx (REBUILT — professional version)
- Real `pharma_logo.png` in sidebar and hero
- Collapsible navy sidebar with gold accents
- Sections: Overview, Users, Certificates, Analytics, Questions, Settings
- Stats cards: Total Users, Certificates, Avg Score, Active Courses
- Users table: fetches from leaderboard API
- Certificates table: fetches from getUserCertificates API
- Analytics: bar chart for all 24 course pass rates
- Questions: links to Supabase dashboard
- Settings: platform config + admin emails list
- `filteredUsers` and `filteredCerts` use `Array.isArray()` guard (bug fix)

### 4. StudentShell.jsx (NEW)
- Navy/gold sidebar wrapping existing `Dashboard.jsx`
- Sidebar nav: Academy, Toolkit, Analytics, Certificates
- Collapsible sidebar with toggle button
- Top bar: theme toggle, language toggle
- RTL support for Arabic
- User avatar + logout in sidebar footer
- `Dashboard.jsx` renders inside the shell — all existing logic preserved

### 5. Backend Admin API (`backend/src/routes/adminRoutes.js`)
- `GET /api/admin/stats` — totalCerts, totalQuestions, avgScore
- `GET /api/admin/users` — from user_progress table
- `GET /api/admin/certificates` — from certificates table
- `DELETE /api/admin/certificates/:id` — revoke certificate
- `DELETE /api/admin/users/:userId/progress` — reset user progress
- Auth: `x-admin-email` header checked against ADMIN_EMAILS
- Added `x-admin-email` to CORS `allowedHeaders` in `server.js`

### 6. CSP (firebase.json)
- `https://www.googletagmanager.com` already in connect-src ✅
- Added `https://tagmanager.google.com` to script-src ✅

---

## 📁 Current File Structure

```
src/
├── pages/
│   ├── Dashboard.jsx          ← Original student app (1076 lines) — PRESERVED
│   ├── StudentShell.jsx       ← NEW navy sidebar wrapper for Dashboard
│   ├── AdminDashboard.jsx     ← NEW professional admin panel
│   └── VerifyCertificate.jsx
├── hooks/
│   └── useAuth.js             ← isAdmin flag added
├── App.jsx                    ← Routes admin→AdminDashboard, student→StudentShell
├── assets/
│   ├── pharma_logo.png        ← Used in sidebar + certificates
│   ├── certificate_bg.png     ← MD5: 08200e24ec97b269a3becd9b2cfaa666
│   └── gold_seal.png

backend/
├── server.js                  ← v1.0.9, adminRoutes added, x-admin-email in CORS
└── src/routes/
    ├── adminRoutes.js         ← NEW admin API endpoints
    ├── authRoutes.js
    ├── certificateRoutes.js
    ├── questionRoutes.js
    └── userRoutes.js
```

---

## 🔑 Critical Rules (Never Break)

| Rule | Details |
|------|---------|
| Backend deploy | `npx vercel --prod --force` from `backend/` folder ONLY |
| NEVER | Vercel dashboard "Promote to Production" → causes 500 errors |
| Frontend deploy | `npm run build && firebase deploy --only hosting` |
| content_new.js | If corrupted → `git checkout src/data/content_new.js` |
| OneDrive | Can lock git files → answer `n` to retry |
| Git | Push to cleanup branch, then merge to main |
| sed commands | Always verify with grep after running — can duplicate imports |

---

## 👤 Admin Credentials
- `daoudtajeldeinn113@gmail.com` — Super Admin
- `daoudtajeldeinn@gmail.com` — Super Admin
- Defined in: `src/hooks/useAuth.js` AND `src/pages/AdminDashboard.jsx`

---

## 🗄️ Supabase Tables
- `questions` — unitId, question, options, correctAnswer, type, explanation
- `certificates` — userId, unitId, issueDate, verificationId, createdAt
- `user_progress` — userId, unitId, score
- `quiz_history` — userId, unitId, score, timestamp
- Supabase project ID: `xxlxfhlliojkplrcvukc`

---

## 🎨 Design System (Both Dashboards)
```
navy:    #0f2557
navyMid: #1a3a7a
navyDk:  #0d1f4a
gold:    #d4af37
goldLt:  #f0d060
green:   #1d9e75
blue:    #185fa5
purple:  #7f77dd
danger:  #dc2626
bg:      #f0f2f7
card:    white
border:  #e4e8f0
```

---

## 📊 Course Progress (Dr. Daoud)
22/24 passed. All scores 90%+. adv-iso-17025 passes at 80% threshold.

---

## 🔴 NEXT SESSION TASKS (In Order)

### TASK 1: Connect AdminDashboard to real backend data
The admin stats/users/certs currently use `apiService` (leaderboard + getUserCertificates).
Need to wire up the new `/api/admin/*` endpoints instead:
```javascript
// In AdminDashboard.jsx fetchData():
const headers = { 'x-admin-email': user.email };
const statsRes = await fetch(`${API_URL}/api/admin/stats`, { headers });
const usersRes = await fetch(`${API_URL}/api/admin/users`, { headers });
const certsRes = await fetch(`${API_URL}/api/admin/certificates`, { headers });
```
Import `API_URL` from `../services/api`.

### TASK 2: StudentShell sidebar sync with Dashboard tabs
Currently StudentShell sidebar nav doesn't control Dashboard tabs.
Dashboard.jsx has its own `viewMode` state ('academy','toolkit','analytics').
Fix: pass `activeTab` prop down and use it in Dashboard:
```javascript
// In Dashboard.jsx, replace:
const [viewMode, setViewMode] = useState('academy');
// With:
const [viewMode, setViewMode] = useState(activeTab || 'academy');
useEffect(() => { if (activeTab) setViewMode(activeTab); }, [activeTab]);
```

### TASK 3: Certificates section in StudentShell
Add a dedicated Certificates view in the StudentShell sidebar
that shows the student's earned certificates with download buttons.
This replaces the inline certificate section in Dashboard.jsx.

### TASK 4: Real logo on certificate
`pharma_logo.png` is already used on the certificate in Dashboard.jsx ✅
But the certificate footer signature image is also `LOGO_PATH = pharmaLogo`.
Verify the PDF download renders the logo correctly (CORS issues possible).
If logo doesn't show in PDF, convert to base64 and embed directly.

### TASK 5: Git commit everything
```bash
cd "/c/Users/daoud/OneDrive/Desktop/منصة السودان للجودة"
git add -A
git commit -m "feat: AdminDashboard redesign, StudentShell sidebar, backend admin routes"
git push origin cleanup/remove-duplicates-and-backups
```

### TASK 6: Student Dashboard header cleanup
Dashboard.jsx still renders its own `<header>` with logo/buttons.
Now that StudentShell handles the top bar, the Dashboard header is redundant.
Options:
- Hide Dashboard header when `activeTab` prop is present
- Or keep it for now (it doesn't break anything, just looks doubled)

### TASK 7: Mobile responsive design
Both dashboards need mobile breakpoints:
- Sidebar collapses to bottom nav on mobile (<768px)
- Cards stack vertically
- Tables scroll horizontally

### TASK 8: Question Manager in Admin
Build a proper UI in AdminDashboard Questions section:
- Dropdown to select unit
- List all questions from Supabase
- Add/edit/delete question forms
- Use `/api/admin/questions` endpoints (need to build these too)

---

## 🚀 Deploy Commands (Quick Reference)
```bash
# Frontend
cd "/c/Users/daoud/OneDrive/Desktop/منصة السودان للجودة"
npm run build && firebase deploy --only hosting

# Backend
cd "/c/Users/daoud/OneDrive/Desktop/منصة السودان للجودة/backend"
npx vercel --prod --force

# Git
git add -A
git commit -m "your message"
git push origin cleanup/remove-duplicates-and-backups
```

---

## ⚠️ Known Issues / Bugs to Watch
1. `sed` commands can duplicate imports if run twice — always verify with `grep -n`
2. Vercel deploy can hang >10 min on first attempt — Ctrl+C and retry
3. Service worker caches old CSP — hard refresh (Ctrl+Shift+R) after deploy
4. OneDrive file locking during git operations — answer `n` to retry prompts
5. `content_new.js` corrupts with literal `\n` — restore via `git checkout`
6. `adv-iso-17025` passing threshold is 80% not 90% — special case in Quiz.jsx
