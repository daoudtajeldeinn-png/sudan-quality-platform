const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET /api/user/profile/:userId - الحصول على بروفايل المستخدم بالكامل
router.get('/profile/:userId', userController.getUserProfile);

// GET /api/user/certificates/:userId - شهادات المستخدم
router.get('/certificates/:userId', userController.getCertificates);

// POST /api/user/sync/:userId - مزامنة التقدم (XP, Badges, etc)
router.post('/sync/:userId', userController.syncUserStats);

// GET /api/user/leaderboard - قائمة المتصدرين
router.get('/leaderboard', userController.getLeaderboard);

module.exports = router;
