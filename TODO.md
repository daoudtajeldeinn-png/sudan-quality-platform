# Fix Registration 400 + AbortErrors - منصة السودان للجودة

## Status: 🚀 Implementation Started

### 📋 Task Steps:

## [ ] 1. **Update User Model** (backend/src/models/User.js)
- Add `authProvider: { type: String, enum: ['local', 'google'], default: 'local' }`
- Make `password: { type: String, required: false }`

## [ ] 2. **Fix Registration Endpoint** (backend/src/controllers/authController.js) 
- Skip password validation if `authProvider: 'google'` or no `password` field
- Skip bcrypt.hash for external users
- Always generate JWT with userId
- Return { success, token, user }

## [ ] 3. **Frontend Token Management** (frontend/src/App.jsx)
- Store `response.token` from registerUser in state/context
- Pass token to child components (Dashboard, Gamification)

## [ ] 4. **API Auth Headers** (frontend/src/services/api.js)
- Add optional `authToken` param
- Set `Authorization: Bearer ${authToken}` header
- Update all methods to accept/use token

## [ ] 5. **Update Consumers** 
- GamificationContext.jsx: Pass/use token for profile/sync calls
- Dashboard.jsx: Pass/use token for leaderboard/profile

## [ ] 6. **Backend Dependencies**
```
cd backend && npm install bcryptjs jsonwebtoken
```

## [ ] 7. **Testing**
```
1. Backend: npm start (port 5000)
2. Frontend dev server
3. Google login → ✅ No 400 error
4. ✅ Dashboard loads (no AbortErrors)
5. Quiz → ✅ Profile/leaderboard syncs
```

## [x] ✅ Planning & File Analysis Complete
## [ ] 🔄 Awaiting First Edits

**Next Action**: Edit User model → authController → test registration

