# Fix Firebase White Page - Detailed Plan & Progress

**Root Cause:** Dynamic `await import('./firebase/config')` in `frontend/src/App.jsx` fails in production (chunk load error → infinite loading/white screen). No error handling.

**Information Gathered:**
- firebase.json: Correct (public: 'dist', rewrites ** → /index.html)
- App.jsx: Dynamic Firebase import, apiService dependency (services/api.js exists), BrowserRouter, contexts, Dashboard import.
- main.jsx: Standard.

**Plan:**
1. Update App.jsx: Static Firebase imports, ErrorBoundary, safe apiService stub, fallback UI.
2. Add global error logging to main.jsx.
3. Optimize vite.config.js.
4. Build & deploy.

**Dependent Files:**
- frontend/src/App.jsx
- frontend/src/main.jsx
- frontend/vite.config.js

**Followup:**
- `cd frontend && npm i && npm run build`
- `firebase deploy --only hosting`
- Test console.

**Progress:**
- [x] 1. Edit App.jsx (static imports, ErrorBoundary, safe API)
- [x] 2. Edit main.jsx (error logging)
- [x] 3. Edit vite.config.js (base '/', Firebase optimize)
- [ ] 4. Build & deploy

Proceed with edits?

