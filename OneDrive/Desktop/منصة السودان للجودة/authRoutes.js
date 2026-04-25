const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/register - تسجيل مستخدم جديد
router.post('/register', authController.registerUser);

// GET /api/auth/user/:userId - الحصول على بيانات المستخدم
router.get('/user/:userId', authController.getUser);

module.exports = router;
