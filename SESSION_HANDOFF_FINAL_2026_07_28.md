# Sudan Quality Platform — Session Handoff
_Generated: 2026-07-28 | Use this file to start any new AI session_

## 🚀 Project
- Frontend: https://decisive-octane-472816-d3.web.app
- Backend: https://backend-lime-gamma-gf9yal9mmd.vercel.app
- Repo: daoudtajeldeinn-png/sudan-quality-platform
- Branch: cleanup/remove-duplicates-and-backups (merged to main)
- Local: C:\Users\daoud\OneDrive\Desktop\منصة السودان للجودة\

## ✅ ALL DONE
- Admin Dashboard: 45 users, question manager, reactivate button, mobile nav
- Student Shell: 4 tabs, mobile nav, admin toggle in top bar
- Certificate: base64 logo/seal, Arabic display, English PDF
- Auth: 14-day inactivity, EmailJS, Chrome fix, CSP login fix
- Leaderboard.jsx: podium + rankings (added independently)
- Firebase REST batchGet: accurate user count
- Header hidden in StudentShell (activeTab check)
- Merged to main ✅

## 📁 Pages
- Dashboard.jsx — main student app
- StudentShell.jsx — sidebar shell
- AdminDashboard.jsx — admin panel
- Leaderboard.jsx — NEW podium + rankings
- VerifyCertificate.jsx
- Dashboard.jsx.backup + Dashboard_backup.jsx — DELETE THESE

## 🔑 Rules
- Backend: npx vercel --prod --force from backend/ ONLY
- JSX edits: ALWAYS python3 never sed
- firebase-admin.json: NEVER commit
- Git rejected: git stash && git pull --rebase && git stash pop && git push
- certAssets.js: regenerate if logos change

## 📧 EmailJS
- Service: service_5cdkh5d
- Template: template_lrfl1xq  
- Key: C-YEGgyegcQ0BL0KU

## 👤 Admins
- daoudtajeldeinn113@gmail.com
- daoudtajeldeinn@gmail.com

## 🔴 NEXT TASKS
1. Student Dashboard tab sync (activeTab → viewMode in Dashboard.jsx)
2. Add Leaderboard tab to StudentShell sidebar
3. Clean up: rm Dashboard.jsx.backup Dashboard_backup.jsx
4. PWA push notifications (FCM)
5. Real analytics from Supabase user_progress table
6. Test /verify/:certId route

## 🚀 Deploy
cd "...منصة السودان للجودة" && npm run build && firebase deploy --only hosting
cd ".../backend" && npx vercel --prod --force

## ⚠️ Known Issues
1. 18 npm vulns — need breaking changes to fix
2. adv-iso-17025 threshold = 80% (special case in Quiz.jsx)
3. Hard refresh needed after deploy (Ctrl+Shift+R)
