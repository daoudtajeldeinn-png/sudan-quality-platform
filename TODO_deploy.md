# منصة السودان للجودة - Deployment TODO

Status: ✅ Backend Vercel + Frontend Firebase — Production Ready

## Backend (Vercel)
- [x] 1. Install deps: `cd backend && npm install` ✅
- [x] 2. Test local: `cd backend && npm start` → http://localhost:5000/health ✅
- [x] 3. Git init + push to GitHub ✅
- [x] 4. `.gitignore` configured ✅
- [x] 5. Deployed to Vercel ✅
- [x] 6. Vercel project live ✅
- [x] 7. Backend URL: `https://backend-lime-gamma-gf9yal9mmd.vercel.app/api`

## Frontend (Firebase)
- [x] Live: https://decisive-octane-472816-d3.web.app/
- [x] `src/services/api.js` → points to Vercel backend ✅
- [x] Quiz scoring fix deployed (answerResults) ✅
- [x] Certificate + badge logic in Dashboard.jsx ✅
- [x] Re-deploy if local changes not yet pushed: `npm run build && firebase deploy --only hosting`

## Database (Supabase)
- [x] Questions table populated for most units
- [x] Run `fixed_questions.sql` to insert missing questions (ich-guidelines, validation-qualification, gdp-basics, adv-validation, etc.)

## Testing
- [x] 10. Local full stack: Backend 5000 + Frontend vite dev ✅
- [x] 11. Live: Frontend Firebase → Backend Vercel APIs (auth, quiz, certs) ✅
- [x] 12. Verify certificate issues after completing a quiz with ≥90% score on live site

**Next**: Remove duplicate unit keys in `content_new.js`, run `fixed_questions.sql`, commit adminRoutes changes.
