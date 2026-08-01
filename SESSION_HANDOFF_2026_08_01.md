# Sudan Quality Platform — Session Handoff
_Generated: 2026-08-01 | Use this file to start any new AI session_

---

## 🚀 Project
- **Frontend**: https://decisive-octane-472816-d3.web.app
- **Backend**: https://backend-lime-gamma-gf9yal9mmd.vercel.app
- **Repo**: daoudtajeldeinn-png/sudan-quality-platform
- **Branch**: main (primary), cleanup/remove-duplicates-and-backups
- **Local**: C:\Users\daoud\OneDrive\Desktop\منصة السودان للجودة\

---

## ✅ COMPLETED — Full Platform Summary

### Core Platform
- 24 pharmaceutical courses with quizzes (Demo Mode fallback for units missing DB questions)
- Admin Dashboard: 45 users, question manager, reactivate button, real analytics
- Student Shell: 5 tabs (Academy, Toolkit, Analytics, Certificates, Leaderboard)
- Certificate system: Arabic display, English PDF, base64 logos, QR verification
- 14-day inactivity policy (admin-excluded), EmailJS notifications
- Mobile responsive (bottom nav <768px)
- Login fixed for all devices (apis.google.com in CSP)
- Badge wallet moved to sidebar (no longer full-width above courses)

### Latest Session Completed
- ✅ Certificate verification page — fully working, tested end-to-end
- ✅ Real analytics from Supabase (no more Math.random())
- ✅ Admin reactivate button + backend endpoint
- ✅ Leaderboard tab in StudentShell
- ✅ Tab sync (sidebar → Dashboard viewMode)
- ✅ Admin excluded from inactivity check
- ✅ Badge wallet moved into 350px sidebar column

---

## 🔴 CRITICAL — Missing Quiz Questions

**17 out of 24 units have ZERO questions in Supabase!**
These units fall back to Demo Mode (hardcoded questions):

❌ Missing: gmp-intro, glp-basics, iso-17025, ich-guidelines,
   validation-qualification, data-integrity, qrm-basics, gdp-basics,
   ich-q10, sterile-annex1, gamp5-basics, batch-records,
   adv-gmp, adv-glp, adv-validation, adv-qrm, adv-gdp

✅ Have real questions: nmpb-reg, adv-iso-17025, cleaning-validation,
   process-validation, hold-time-stability, method-validation,
   equipment-qualification

### How to add questions:
1. Go to: https://supabase.com/dashboard/project/xxlxfhlliojkplrcvukc/sql/new
2. Use the fixed SQL with QUOTED column names:
   `"unitId"`, `"correctAnswer"`, `"correctAnswers"` (all need quotes!)
3. `fixed_questions.sql` in project root has ready SQL for:
   ich-guidelines, validation-qualification, adv-validation, gdp-basics, adv-gdp
4. Run it in Supabase SQL Editor to add ~30 real questions

### Question table schema:
```sql
INSERT INTO questions (
  "unitId", question, options, "correctAnswer", "correctAnswers", type, explanation
) VALUES (
  'gmp-intro',           -- unit ID
  'Question text here',  -- question
  '["A","B","C","D"]',   -- options (JSON array string)
  '1',                   -- correctAnswer (index as string, for multiple choice)
  NULL,                  -- correctAnswers (array, for fill-in)
  'multiple',            -- type: 'multiple', 'tf', 'fill'
  NULL                   -- explanation (optional)
);
```

---

## 📁 Key Files
```
src/pages/
├── Dashboard.jsx       ← main app, badge wallet in sidebar
├── StudentShell.jsx    ← 5-tab sidebar shell
├── AdminDashboard.jsx  ← admin panel with real analytics
├── Leaderboard.jsx     ← podium + rankings
└── VerifyCertificate.jsx ← working QR verification

backend/src/routes/adminRoutes.js  ← admin API + analytics endpoint
backend/src/controllers/
├── authController.js   ← UPSERT + inactivity (admin excluded)
└── questionController.js ← rotate questions with fallback

fixed_questions.sql    ← READY TO RUN in Supabase SQL Editor
```

---

## 🔑 Critical Rules
| Rule | Details |
|------|---------|
| Backend deploy | `npx vercel --prod --force` from `backend/` ONLY |
| JSX edits | python3 ONLY — never sed |
| SQL in Supabase | Column names need quotes: `"unitId"`, `"correctAnswer"` |
| firebase-admin.json | NEVER commit — gitignored |
| Git push rejected | `git stash && git pull --rebase && git stash pop && git push` |

---

## 👤 Admins
- daoudtajeldeinn113@gmail.com
- daoudtajeldeinn@gmail.com

## 📧 EmailJS
- Service: service_5cdkh5d | Template: template_lrfl1xq | Key: C-YEGgyegcQ0BL0KU

## 🗄️ Supabase: xxlxfhlliojkplrcvukc

---

## 🔴 NEXT SESSION TASKS

### TASK 1 (URGENT): Add real questions to 17 missing units
Run `fixed_questions.sql` in Supabase SQL Editor first.
Then write/seed questions for remaining units (gmp-intro, glp-basics, etc.)
Each unit needs minimum 10 questions.

### TASK 2: GMP Pharma materials integration
G:\GMP Pharma folder has:
- 6 templates (capa, bmr-bpr, internal-audit, iq-oq-pq, oot-oos, quality-policy)
- Case studies
- Extra courses: CAPA, IPQC, ISO 9001, QC Lab
Plan: Add templates as downloadable PDFs in Toolkit section

### TASK 3: FCM Push Notifications
Need VAPID key from Firebase Console:
https://console.firebase.google.com/project/decisive-octane-472816-d3/settings/cloudmessaging
Notifications: A=inactivity, B=cert earned, C=new course

### TASK 4: New course units from GMP Pharma
- CAPA (course-capa.html)
- IPQC (course-ipqc.html)
- ISO 9001 (course-iso-9001.html)
- QC Lab (course-qc-lab.html)

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
1. 17/24 units use Demo Mode questions (real questions missing from Supabase)
2. 18 npm vulnerabilities — need breaking changes to fix
3. Hard refresh (Ctrl+Shift+R) needed after deploy to clear service worker
4. certAssets.js must be regenerated if logos change
5. adv-iso-17025 threshold = 80% (special case in Quiz.jsx)
