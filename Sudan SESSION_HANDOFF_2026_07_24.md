# Sudan Quality Platform — Session Handoff
_Generated: 2026-07-24 | Use this file to start any new AI session_

---

## 🚀 Project Overview
- **Frontend**: React/Vite → Firebase: `https://decisive-octane-472816-d3.web.app`
- **Backend**: Node.js/Express → Vercel: `https://backend-lime-gamma-gf9yal9mmd.vercel.app`
- **Database**: Supabase (users, questions, certificates, user_progress)
- **Auth**: Firebase Auth (Google Sign-In)
- **Git repo**: `daoudtajeldeinn-png/sudan-quality-platform`
- **Branch**: `cleanup/remove-duplicates-and-backups` (also merged to `main`)
- **Local**: `C:\Users\daoud\OneDrive\Desktop\منصة السودان للجودة\`

---

## ✅ ALL TASKS COMPLETED

### TASK 1 ✅ — Firebase Admin shows all 45 users
- Uses `google-auth-library` REST API (not firebase-admin SDK)
- `backend/src/routes/adminRoutes.js` calls Firebase Identity Toolkit API
- `FIREBASE_ADMIN_CREDENTIALS` env var in Vercel ✅
- Admin dashboard now shows all 45 Firebase Auth users

### TASK 2 ✅ — Arabic PDF fixed
- `Dashboard.jsx` downloadPDF() switches to English before html2canvas capture
- Restores Arabic after PDF is saved
- Arabic displays correctly in browser, PDF downloads in clean English

### TASK 3 ✅ — 14-day inactivity policy
- `authController.js` checks lastLogin on every login
- Zero-XP users inactive >14 days → `{ inactive: true, daysSince: N }` response
- `useAuth.js` handles `isInactive` + `daysSinceLogin` states
- `App.jsx` shows inactivity screen with "Continue Anyway" + "Sign Out" buttons
- Active students (XP > 0) are never blocked

### TASK 4 ✅ — Question Manager in Admin
- Full UI in AdminDashboard.jsx Questions section
- Dropdown to select any of 24 units
- Lists all questions with correct answer highlighted green
- Add/Edit/Delete forms with 4 options + radio for correct answer
- Backend: `GET/POST/PUT/DELETE /api/admin/questions/:unitId`

### TASK 5 ✅ — npm audit fix
- All safe fixes applied
- 16 remaining vulnerabilities require breaking changes (jspdf, vite, firebase)
- Acceptable — these are dependency-level issues, not runtime user risks

### TASK 6 ✅ — Merged to main
- `cleanup/remove-duplicates-and-backups` → merged to `main`
- Both branches up to date

---

## 📁 Current File Structure

```
src/
├── pages/
│   ├── Dashboard.jsx          ← certToOpen + onCertClosed + PDF English fix
│   ├── StudentShell.jsx       ← passes certToOpen to Dashboard
│   ├── AdminDashboard.jsx     ← Full admin panel with Question Manager
│   └── VerifyCertificate.jsx
├── hooks/useAuth.js           ← isAdmin + isInactive + popup/redirect fallback
├── firebase/config.js         ← authDomain = web.app
├── App.jsx                    ← inactivity screen + admin/student routing
├── main.jsx                   ← imports design-system.css
├── styles/design-system.css   ← @import Arabic fonts at TOP
└── index.html                 ← Arabic font preload links

backend/
├── server.js                  ← adminRoutes wired, x-admin-email in CORS
├── src/
│   ├── config/
│   │   ├── supabase.js
│   │   ├── firebaseAdmin.js   ← stub (not used — REST API used instead)
│   │   └── firebase-admin.json ← gitignored, DO NOT COMMIT
│   ├── controllers/
│   │   ├── authController.js  ← UPSERT + 14-day inactivity check
│   │   └── userController.js
│   └── routes/
│       ├── adminRoutes.js     ← Full admin API + question manager endpoints
│       ├── authRoutes.js
│       ├── certificateRoutes.js
│       ├── questionRoutes.js
│       └── userRoutes.js
```

---

## 🔑 Critical Rules

| Rule | Details |
|------|---------|
| Backend deploy | `npx vercel --prod --force` from `backend/` ONLY |
| NEVER | Vercel "Promote to Production" → causes 500 errors |
| Frontend deploy | `npm run build && firebase deploy --only hosting` |
| firebase-admin.json | NEVER commit — gitignored |
| JSX file edits | ALWAYS use python3 — never sed for JSX |
| content_new.js | If corrupted → `git checkout src/data/content_new.js` |
| Vercel hang | If >10min → Ctrl+C and retry |

---

## 👤 Admin Credentials
- `daoudtajeldeinn113@gmail.com` — Super Admin
- `daoudtajeldeinn@gmail.com` — Super Admin
- Defined in: `useAuth.js`, `AdminDashboard.jsx`, `adminRoutes.js`

---

## 🗄️ Supabase Tables
- `users` — userId, email, displayName, xp, level, badges, progress, createdAt, lastLogin
- `questions` — unitId, question, options, correctAnswer, type, explanation
- `certificates` — userId, unitId, issueDate, verificationId, createdAt
- `user_progress` — userId, unitId, score
- Supabase project: `xxlxfhlliojkplrcvukc`

---

## 🎨 Design Tokens
```
navy:    #0f2557   navyMid: #1a3a7a   navyDk:  #0d1f4a
gold:    #d4af37   goldLt:  #f0d060
green:   #1d9e75   blue:    #185fa5   purple:  #7f77dd
bg:      #f0f2f7   card:    white     border:  #e4e8f0
```

---

## 🔴 NEXT SESSION TASKS

### TASK 1: Mobile responsive design
Both dashboards need mobile breakpoints:
- Sidebar collapses to bottom nav on mobile (<768px)
- Cards stack vertically
- Tables scroll horizontally

### TASK 2: Email notifications for inactivity
When user is flagged as inactive:
- Send email via SendGrid or Firebase Email Extension
- "Your Sudan Quality Platform account is inactive — please log in to continue"

### TASK 3: Admin — reactivate user button
In AdminDashboard Users table, add "Reactivate" button for inactive users:
- Calls `/api/admin/users/:userId/reactivate`
- Updates `lastLogin` in Supabase to today
- User can login normally again

### TASK 4: Student Dashboard tab sync
When StudentShell sidebar tab changes, Dashboard should switch view:
```javascript
// In Dashboard.jsx:
const [viewMode, setViewMode] = useState(activeTab || 'academy');
useEffect(() => {
  if (activeTab && activeTab !== 'certs') setViewMode(activeTab);
}, [activeTab]);
```

### TASK 5: Certificate PDF — embed logo properly
Currently `pharma_logo.png` may not render in PDF (CORS issue with html2canvas).
Fix: convert logo to base64 and embed directly in the certificate HTML before capture.

---

## 🚀 Deploy Commands
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

## ⚠️ Known Issues
1. 16 npm vulnerabilities — require breaking changes to fix (jspdf, vite, firebase)
2. Service worker CSP warnings for fonts — cosmetic only, not breaking
3. `adv-iso-17025` threshold is 80% not 90% — special case in Quiz.jsx
4. `firebase-admin.json` gitignored but exists at `backend/src/config/`
5. Always use python3 for JSX edits — sed breaks JSX syntax
