# Sudan Quality Platform — Session Handoff
_Generated: 2026-07-28 | Use this file to start any new AI session_

---

## 🚀 Project Overview
- **Frontend**: React/Vite → Firebase: `https://decisive-octane-472816-d3.web.app`
- **Backend**: Node.js/Express → Vercel: `https://backend-lime-gamma-gf9yal9mmd.vercel.app`
- **Database**: Supabase (users, questions, certificates, user_progress)
- **Auth**: Firebase Auth (Google Sign-In)
- **Git repo**: `daoudtajeldeinn-png/sudan-quality-platform`
- **Branch**: `cleanup/remove-duplicates-and-backups` (merged to `main`)
- **Local**: `C:\Users\daoud\OneDrive\Desktop\منصة السودان للجودة\`

---

## ✅ ALL PRIORITIES COMPLETED

### Priority 1 ✅ — Mobile Responsive Design
- Both AdminDashboard and StudentShell have mobile bottom nav on <768px
- `useWindowWidth` hook + `isMobile` state in both components
- Sidebar hides on mobile, bottom nav shows with icons + labels
- Content gets `paddingBottom: 72px` to avoid overlap with bottom nav

### Priority 2 ✅ — Email Notifications (EmailJS)
- Package: `@emailjs/browser` installed
- Credentials: Service `service_5cdkh5d`, Template `template_lrfl1xq`, Key `C-YEGgyegcQ0BL0KU`
- Sends email automatically when inactive user (zero XP, >14 days) logs in
- `useEffect` in `App.jsx` (before any conditional returns — important!)
- Email template variables: `to_email`, `user_name`, `days_inactive`

### Priority 3 ✅ — Admin Reactivate Button
- "↺ Reactivate" button appears next to inactive users in Admin Users table
- Calls `POST /api/admin/users/:userId/reactivate`
- Updates `lastLogin` to today in Supabase
- Refreshes user list after reactivation

### Priority 4 ✅ — Certificate Logo as Base64
- `src/assets/certAssets.js` — auto-generated file with base64 logo + seal
- Regenerate with: `node -e "..." > src/assets/certAssets.js` (see script below)
- `Dashboard.jsx` swaps img src to base64 before html2canvas capture
- Restores original src after PDF saved
- Fixes CORS issue that caused blank logos in PDF

### Bonus ✅ — Login Fix for Other Devices
- Added `https://apis.google.com` to CSP `connect-src` in `firebase.json`
- Was blocking Google Sign-In popup on other devices/browsers
- Users must hard refresh (Ctrl+Shift+R) to clear old service worker cache

---

## 📁 Current File Structure

```
src/
├── pages/
│   ├── Dashboard.jsx          ← base64 logo for PDF, hide cert banner in shell
│   ├── StudentShell.jsx       ← mobile bottom nav, isMobile hook
│   ├── AdminDashboard.jsx     ← mobile nav, reactivate button, question manager
│   └── VerifyCertificate.jsx
├── hooks/useAuth.js           ← isAdmin + isInactive + daysSinceLogin
├── firebase/config.js         ← authDomain = web.app
├── App.jsx                    ← EmailJS, inactivity screen, admin/student toggle
├── assets/
│   ├── certAssets.js          ← AUTO-GENERATED base64 logo + seal
│   ├── pharma_logo.png
│   ├── certificate_bg.png
│   └── gold_seal.png
├── main.jsx                   ← imports design-system.css
├── styles/design-system.css   ← @import Arabic fonts at TOP
└── index.html                 ← Arabic font preload + api.google.com allowed

backend/
├── server.js
├── src/
│   ├── config/
│   │   ├── supabase.js
│   │   ├── firebaseAdmin.js   ← stub (not used)
│   │   └── firebase-admin.json ← gitignored, DO NOT COMMIT
│   ├── controllers/
│   │   └── authController.js  ← UPSERT + 14-day inactivity check
│   └── routes/
│       ├── adminRoutes.js     ← all admin endpoints + reactivate + questions
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
| certAssets.js | Regenerate if logos change (see script below) |
| Git push rejected | `git pull origin <branch> --rebase && git push` |
| Stash before pull | `git stash && git pull ... && git stash pop` |

---

## 🔄 Regenerate certAssets.js (if logos change)
```bash
node -e "
const fs = require('fs');
const logoB64 = fs.readFileSync('src/assets/pharma_logo.png').toString('base64');
const sealB64 = fs.readFileSync('src/assets/gold_seal.png').toString('base64');
fs.writeFileSync('src/assets/certAssets.js', \`export const LOGO_B64 = 'data:image/png;base64,\${logoB64}';\nexport const SEAL_B64 = 'data:image/png;base64,\${sealB64}';\n\`);
console.log('Done');
"
```

---

## 👤 Admin Credentials
- `daoudtajeldeinn113@gmail.com` — Super Admin
- `daoudtajeldeinn@gmail.com` — Super Admin

---

## 🗄️ Supabase Tables
- `users` — userId, email, displayName, xp, level, lastLogin
- `questions` — unitId, question, options, correctAnswer, explanation
- `certificates` — userId, unitId, issueDate, verificationId, createdAt
- `user_progress` — userId, unitId, score
- Supabase project: `xxlxfhlliojkplrcvukc`

---

## 🎨 Design Tokens
```
navy:#0f2557  navyMid:#1a3a7a  gold:#d4af37  green:#1d9e75
blue:#185fa5  purple:#7f77dd   bg:#f0f2f7    border:#e4e8f0
```

---

## 🔴 NEXT SESSION TASKS

### TASK 1: Student Dashboard tab sync
When StudentShell sidebar tab changes, Dashboard should switch view:
```javascript
// In Dashboard.jsx:
const [viewMode, setViewMode] = useState(activeTab || 'academy');
useEffect(() => {
  if (activeTab && activeTab !== 'certs') setViewMode(activeTab);
}, [activeTab]);
```

### TASK 2: Push notification (PWA)
Add web push notifications for:
- New course available
- Certificate earned
- Inactivity reminder (complement to email)
Use Firebase Cloud Messaging (FCM)

### TASK 3: Analytics improvements
- Real quiz pass rates from Supabase (not random)
- Time spent per unit tracking
- Export analytics as PDF/Excel report

### TASK 4: Question Manager improvements
- Import questions from CSV/Excel
- Question preview before saving
- Duplicate question detection

### TASK 5: Certificate verification page
`/verify/:certId` page already exists — test and improve:
- QR code scan → opens verify page
- Shows certificate details + status (valid/revoked)

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
1. 18 npm vulnerabilities — require breaking changes (jspdf, vite, firebase)
2. Service worker CSP warnings for fonts — cosmetic only
3. `adv-iso-17025` threshold is 80% not 90% — special case in Quiz.jsx
4. Hard refresh needed after deploy to clear service worker cache
5. Always use python3 for JSX edits — sed breaks JSX syntax
6. certAssets.js must be regenerated if logo/seal images change
