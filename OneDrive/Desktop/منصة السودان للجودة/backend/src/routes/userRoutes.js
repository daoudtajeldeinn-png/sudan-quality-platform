const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET /api/user/profile/:userId - الحصول على بروفايل المستخدم بالكامل
router.get('/profile/:userId', userController.getUserProfile);

// POST /api/user/sync/:userId - مزامنة التقدم (XP, Badges, etc)
router.post('/sync/:userId', userController.syncUserStats);

module.exports = router;
