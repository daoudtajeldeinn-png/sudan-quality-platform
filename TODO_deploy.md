# منصة السودان للجودة - Deployment TODO

Status: Backend Vercel + Frontend Firebase (Demo mode ready)

## Backend (Vercel)
- [x] 1. Install deps: `cd backend && npm install` ✅
- [ ] 2. Test local: `cd backend && npm start` → Visit http://localhost:5000/health (should show demo mode OK)
- [ ] 3. Git init: `cd backend && git init`
- [ ] 4. Add .gitignore improvements if needed (node_modules, .env)
- [ ] 5. Commit & push: Create GitHub repo 'sudan-quality-backend', `git remote add origin https://github.com/YOUR_USERNAME/sudan-quality-backend.git` (replace USERNAME), `git add . && git commit -m \"Deploy ready backend\" && git push -u origin main`
- [ ] 6. Vercel: vercel.com → New Project → Import GitHub repo → Deploy (auto from vercel.json). Add env MONGODB_URI=your_mongo_uri (Atlas free tier optional)
- [ ] 7. Note Vercel URL (e.g. sudan-quality-backend.vercel.app)

## Frontend (Firebase)
- [x] Live: https://decisive-octane-472816-d3.web.app/
- [ ] 8. If changes: `cd frontend && npm run build && firebase deploy --only hosting`
- [ ] 9. Update frontend/src/services/api.js: const API_BASE = 'https://YOUR_BACKEND.vercel.app/api';

## Testing
- [ ] 10. Local full stack: Backend 5000 + Frontend vite dev (update api to localhost:5000)
- [ ] 11. Live: Frontend Firebase → calls Backend Vercel APIs (auth, quiz, certs, no CORS)

**Next**: Run step 1-2 first. Provide GitHub username/repo or Vercel project for automation. Mongo URI optional.
