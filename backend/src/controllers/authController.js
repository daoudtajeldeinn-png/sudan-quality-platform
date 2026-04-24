const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// تسجيل مستخدم جديد
const registerUser = async (req, res) => {
  try {
if (!password || password.length < 6) {
  return res.status(400).json({ error: "كلمة المرور مطلوبة (6 أحرف على الأقل)" });
}
const { email, displayName = email.split('@')[0] } = req.body;
    
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
      userId: req.body.userId || `user_${Date.now()}`,
      email,
      displayName,
      photoURL: req.body.photoURL || null,
      password: hashedPassword,
      createdAt: new Date(),
      lastLogin: new Date(),
      xp: 0,
      level: 1,
      badges: [],
      stats: {
        totalQuizzes: 0,
        perfectScores: 0,
        lecturesCompleted: 0
      },
      progress: {
        completedUnits: [],
        currentUnit: null,
        totalScore: 0,
        certificates: []
      }
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
};

// الحصول على بيانات المستخدم
const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ error: "المستخدم غير موجود" });
    }
    res.json({
      userId: user.userId,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "حدث خطأ في الخادم" });
  }
};

module.exports = { registerUser, getUser };
