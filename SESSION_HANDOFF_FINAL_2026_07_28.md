# Sudan Quality Platform — Session Handoff
_Generated: 2026-07-28 | Use this file to start any new AI session_

---

## 🚀 Project
- **Frontend**: https://decisive-octane-472816-d3.web.app
- **Backend**: https://backend-lime-gamma-gf9yal9mmd.vercel.app
- **Repo**: daoudtajeldeinn-png/sudan-quality-platform
- **Branch**: cleanup/remove-duplicates-and-backups (merged to main)
- **Local**: C:\Users\daoud\OneDrive\Desktop\منصة السودان للجودة\

---

## ✅ COMPLETED THIS SESSION

### 1. Cleanup
- Deleted Dashboard.jsx.backup and Dashboard_backup.jsx

### 2. Leaderboard tab in StudentShell
- Added 🏆 Leaderboard to sidebar nav
- Wired to existing Leaderboard.jsx (props: user, isRtl)

### 3. Tab sync fixed
- StudentShell sidebar clicks now sync Dashboard viewMode
- `useState(activeTab || 'academy')` + `useEffect([activeTab])`
- Excludes 'certificates' and 'leaderboard' tabs (handled separately)

### 4. Admin excluded from inactivity check
- `authController.js` now skips inactivity flag for admin emails
- Admins will never see the "Account Inactive" screen

### 5. Merged to main ✅

---

## 📁 Pages
- Dashboard.jsx — main student app (tab sync fixed)
- StudentShell.jsx — sidebar shell (5 tabs including Leaderboard)
- AdminDashboard.jsx — admin panel
- Leaderboard.jsx — podium + full rankings
- VerifyCertificate.jsx

---

## 🔑 Critical Rules
| Rule | Details |
|------|---------|
| Backend deploy | `npx vercel --prod --force` from `backend/` ONLY |
| JSX edits | ALWAYS python3 — never sed |
| firebase-admin.json | NEVER commit — gitignored |
| Git push rejected | `git stash && git pull --rebase && git stash pop && git push` |
| Merge conflicts | `git checkout --theirs <file> && git add <file>` |

---

## 👤 Admins (excluded from inactivity)
- daoudtajeldeinn113@gmail.com
- daoudtajeldeinn@gmail.com
- Defined in: useAuth.js, AdminDashboard.jsx, adminRoutes.js, authController.js

---

## 📧 EmailJS Config
- Service: service_5cdkh5d
- Template: template_lrfl1xq
- Key: C-YEGgyegcQ0BL0KU
- Vars: to_email, user_name, days_inactive

---

## 🗄️ Supabase: xxlxfhlliojkplrcvukc
- users, questions, certificates, user_progress

---

## 🔴 NEXT SESSION — FCM Push Notifications

### Setup needed:
1. Get VAPID key from Firebase Console:
   https://console.firebase.google.com/project/decisive-octane-472816-d3/settings/cloudmessaging
   → Web Push certificates → Generate key pair → copy key

2. Notifications to implement (D = all):
   - A) Inactivity reminder (14 days)
   - B) Certificate earned 🎓
   - C) New course available 📚

### Implementation plan:
1. Add `firebase-messaging-sw.js` to public/ folder
2. Update `src/firebase/config.js` to init messaging
3. Create `src/hooks/useFCM.js` — request permission + get token
4. Store FCM token in Supabase `users.fcmToken` field
5. Backend: send push via Firebase Admin SDK when events trigger
6. Update sw.js to handle push events

### Firebase messaging service worker template:
```javascript
// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCtbCNpk39MjhZkaVPOKjiovBexuO3_W_o",
  authDomain: "decisive-octane-472816-d3.web.app",
  projectId: "decisive-octane-472816-d3",
  storageBucket: "decisive-octane-472816-d3.firebasestorage.app",
  messagingSenderId: "338906119415",
  appId: "1:338906119415:web:2767a85e29b0b5b1a727f2"
});

const messaging = firebase.messaging();
messaging.onBackgroundMessage(payload => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/logo.png'
  });
});
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
git add -A && git commit -m "message" && git push origin cleanup/remove-duplicates-and-backups
```

---

## ⚠️ Known Issues
1. 18 npm vulnerabilities — need breaking changes
2. Hard refresh (Ctrl+Shift+R) needed after deploy
3. adv-iso-17025 threshold = 80% (special case in Quiz.jsx)
4. certAssets.js must be regenerated if logos change
