# Sudan Quality Platform — Session Handoff
_Generated: 2026-08-01 | Use this file to start any new AI session_

---

## 🚀 Project
- **Frontend**: https://decisive-octane-472816-d3.web.app
- **Backend**: https://backend-lime-gamma-gf9yal9mmd.vercel.app
- **Repo**: daoudtajeldeinn-png/sudan-quality-platform
- **Branch**: main
- **Local**: C:\Users\daoud\OneDrive\Desktop\منصة السودان للجودة\

---

## ✅ PLATFORM IS 100% COMPLETE

### 28 Course Units (all have real Supabase questions)
Original 24: gmp-intro, glp-basics, iso-17025, ich-guidelines,
validation-qualification, data-integrity, qrm-basics, gdp-basics,
ich-q10, sterile-annex1, gamp5-basics, batch-records, nmpb-reg,
adv-gmp, adv-glp, adv-iso-17025, adv-validation, adv-qrm, adv-gdp,
cleaning-validation, process-validation, hold-time-stability,
method-validation, equipment-qualification

New 4 (added this session): capa, ipqc, iso-9001, qc-lab

### XP System Fixed
- XP now calculated from certificates (single source of truth)
- `getUserProfile` in userController.js fetches certs + calculates XP
- No more sync issues between localStorage and Supabase
- Formula: 100% = 600 XP, 95%+ = 550, 90%+ = 500, else 450
- Level thresholds: 1000=6, 2000=7, 3000=8, 4000=9, 5500=10,
  7000=11, 9000=12, 11000=13, 13000=14

### Dr. Daoud's Profile
- 28/28 certificates earned
- XP: 15900 | Level: 14

---

## 📁 Key Files
```
src/pages/
├── Dashboard.jsx       — 28 units, cert-based progress
├── StudentShell.jsx    — 5-tab sidebar (Academy, Toolkit, Analytics, Certs, Leaderboard)
├── AdminDashboard.jsx  — real analytics, question manager, reactivate
├── Leaderboard.jsx     — podium + rankings
└── VerifyCertificate.jsx — working QR verification

backend/src/controllers/
├── userController.js   — XP calculated from certificates
├── authController.js   — UPSERT + inactivity (admin excluded)
└── questionController.js

backend/src/routes/
└── adminRoutes.js      — full admin API + analytics
```

---

## 🔑 Critical Rules
| Rule | Details |
|------|---------|
| Backend deploy | `npx vercel --prod --force` from `backend/` ONLY |
| JSX edits | python3 ONLY — never sed |
| SQL columns | Need quotes: `"unitId"`, `"correctAnswer"`, `"correctAnswers"` |
| XP source | Always from certificates table — never manually set |
| firebase-admin.json | NEVER commit — gitignored |
| Git push rejected | `git stash && git pull --rebase && git stash pop && git push` |

---

## 👤 Admins
- daoudtajeldeinn113@gmail.com
- daoudtajeldeinn@gmail.com

## 📧 EmailJS
- Service: service_5cdkh5d
- Template: template_lrfl1xq
- Key: C-YEGgyegcQ0BL0KU

## 🗄️ Supabase: xxlxfhlliojkplrcvukc
Tables: users, questions, certificates, user_progress

---

## 🔴 NEXT SESSION TASKS

### TASK 1: GMP Pharma templates as downloadable resources
G:\GMP Pharma\templates\ has 6 professional bilingual templates:
- bmr-bpr-template.md
- capa-template.md
- internal-audit-template.md
- iq-oq-pq-template.md
- oot-oos-template.md
- quality-policy-template.md
Plan: Convert to PDF and add as downloadable resources in Toolkit section

### TASK 2: FCM Push Notifications
Need VAPID key from:
https://console.firebase.google.com/project/decisive-octane-472816-d3/settings/cloudmessaging
Notifications: inactivity reminder, cert earned, new course

### TASK 3: Progress display for new 4 units
Users who completed old 24 units won't see progress for new 4 units
until they take those quizzes — this is expected behavior.
Consider adding a "New Courses Available" banner for returning users.

### TASK 4: XP localStorage cleanup
When user loads app, if backend XP > localStorage XP, clear localStorage
gamification key to force fresh fetch. Add this to GamificationContext:
```javascript
if (remoteXp > localXp) {
  localStorage.removeItem(`sqp_gamification_${userEmail}`);
}
```

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
git add -A && git commit -m "message" && git push origin main
```

## ⚠️ Known Issues
1. localStorage may show old XP until user clears it or backend > local
2. 204 npm vulnerabilities — need breaking changes to fix
3. Hard refresh (Ctrl+Shift+R) needed after deploy
4. certAssets.js must be regenerated if logos change
5. adv-iso-17025 threshold = 80% (special case in Quiz.jsx)
