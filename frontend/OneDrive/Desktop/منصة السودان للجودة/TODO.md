# Deployment Fix - Backend Vercel + Frontend Firebase - Approved Plan

**Previous Dashboard Fixes:**
1. [x] Read backend/src/routes/userRoutes.js → routes OK ✅
2. [x] Edit frontend/src/pages/Dashboard.jsx → loading/error fixes ✅
3. [x] Test local dev ✅

**Current Deployment Steps:**
4. [ ] Fix Vercel backend: edit backend/package.json (move mongodb-memory-server to deps), backend/server.js (try-catch memory server)
5. [ ] cd backend && npm install && node server.js (test demo mode no crash)
6. [ ] Git add/commit/push backend (Vercel auto-deploys)
7. [ ] cd frontend && npm run build && firebase deploy --only hosting
8. [ ] Vercel dashboard: Add env MONGODB_URI=your_mongo_connection_string
9. [ ] Test live: Vercel backend URLs, Firebase frontend no CORS/deploy errors

**Next:** Proceed with step 4 edits. Dev servers running.
