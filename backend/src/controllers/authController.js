const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// تسجيل مستخدم جديد
const registerUser = async (req, res) => {
  try {
    // Demo mode bypass using in-memory DB
    if (req.isDemoMode) {
      const { email, displayName = email.split('@')[0], password, userId, photoURL } = req.body;
      
      // Check existing in demo DB
      const existingUser = await req.demoDB.findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "البريد الإلكتروني مسجل مسبقاً" });
      }
      
      const demoUser = await req.demoDB.createUser({
        userId: userId || `demo_${Date.now()}`,
        email,
        displayName,
        photoURL: photoURL || null,
        authProvider: userId ? 'google' : 'local'
      });
      
      const token = jwt.sign(
        { userId: demoUser._id, email: demoUser.email },
        process.env.JWT_SECRET || "sudan_quality_secret",
        { expiresIn: "24h" }
      );
      
      return res.status(201).json({
        success: true,
        token,
        user: {
          userId: demoUser._id,
          email: demoUser.email,
          displayName: demoUser.displayName,
          photoURL: demoUser.photoURL
        }
      });
    }
    
    // Normal Mongoose flow for production
    const { email, displayName = email.split('@')[0], password, userId } = req.body;
    const isGoogleUser = userId && !password; 
    
    if (!isGoogleUser && (!password || password.length < 6)) {
      return res.status(400).json({ error: "كلمة المرور مطلوبة (6 أحرف على الأقل)" });
    }

    // التحقق من وجود البريد الإلكتروني
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "البريد الإلكتروني مسجل مسبقاً" });
    }
    let hashedPassword = null;
    if (!isGoogleUser) {
      // Local users only: hash password
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }
    
    // إنشاء مستخدم جديد
    const user = new User({
      userId: userId || `user_${Date.now()}`,
      email,
      authProvider: isGoogleUser ? 'google' : 'local',

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
    
    // إنشاء JWT token لكل المستخدمين
    const token = jwt.sign(
      { userId: user.userId, email: user.email, authProvider: user.authProvider },

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
    if (req.isDemoMode) {
      const user = await req.demoDB.findUserById(userId);
      if (!user) {
        return res.status(404).json({ error: "المستخدم غير موجود" });
      }
      res.json({
        userId: user.userId || user._id,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      });
    } else {
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
    }

  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "حدث خطأ في الخادم" });
  }
};


module.exports = { registerUser, getUser };
