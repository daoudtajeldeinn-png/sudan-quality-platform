const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class UserController {
  // تسجيل مستخدم جديد
  static async register(req, res) {
    try {
      const { email, password, displayName } = req.body;
      
      // التحقق من وجود البريد الإلكتروني
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "البريد الإلكتروني مسجل مسبقاً" });
      }
      
      // تشفير كلمة المرور
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // إنشاء مستخدم جديد
      const user = new User({
        userId: `user_${Date.now()}`, // ID مؤقت
        email,
        displayName,
        password: hashedPassword,
        photoURL: null,
        createdAt: new Date(),
        lastLogin: new Date()
      });
      
      await user.save();
      
      // إنشاء JWT token
      const token = jwt.sign(
        { userId: user.userId, email: user.email },
        process.env.JWT_SECRET || "sudan_quality_secret",
        { expiresIn: "24h" }
      );
      
      res.status(201).json({
        success: true,
        token,
        user: {
          userId: user.userId,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        }
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "حدث خطأ في الخادم" });
    }
  }

  // تسجيل دخول المستخدم
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // البحث عن المستخدم
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "بيانات الدخول غير صحيحة" });
      }
      
      // التحقق من كلمة المرور
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "بيانات الدخول غير صحيحة" });
      }
      
      // تحديث تاريخ آخر دخول
      user.lastLogin = new Date();
      await user.save();
      
      // إنشاء JWT token
      const token = jwt.sign(
        { userId: user.userId, email: user.email },
        process.env.JWT_SECRET || "sudan_quality_secret",
        { expiresIn: "24h" }
      );
      
      res.json({
        success: true,
        token,
        user: {
          userId: user.userId,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "حدث خطأ في الخادم" });
    }
  }

  // الحصول على بيانات المستخدم الحالي
  static async getCurrentUser(req, res) {
    try {
      const user = await User.findOne({ userId: req.user.userId });
      if (!user) {
        return res.status(404).json({ error: "المستخدم غير موجود" });
      }
      
      res.json({ user });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "حدث خطأ في الخادم" });
    }
  }
}

module.exports = UserController;
