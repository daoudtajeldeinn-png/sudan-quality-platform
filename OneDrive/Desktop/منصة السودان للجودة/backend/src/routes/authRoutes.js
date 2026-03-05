const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");

// POST /api/auth/register - تسجيل مستخدم جديد
router.post("/register", UserController.register);

// POST /api/auth/login - تسجيل دخول المستخدم
router.post("/login", UserController.login);

// GET /api/auth/me - الحصول على بيانات المستخدم الحالي
router.get("/me", require("../middleware/authMiddleware"), UserController.getCurrentUser);

module.exports = router;
