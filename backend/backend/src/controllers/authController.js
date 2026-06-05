const supabase = require('../config/supabase');
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
        const token = jwt.sign(
          { userId: existingUser._id, email: existingUser.email },
          process.env.JWT_SECRET || "sudan_quality_secret",
          { expiresIn: "24h" }
        );

        return res.status(200).json({
          success: true,
          token,
          user: {
            userId: existingUser._id,
            email: existingUser.email,
            displayName: existingUser.displayName,
            photoURL: existingUser.photoURL
          }
        });
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

    // Normal Supabase flow for production
    const { email, displayName = email.split('@')[0], password, userId } = req.body;
    const isGoogleUser = userId && !password;

    if (!isGoogleUser && (!password || password.length < 6)) {
      return res.status(400).json({ error: "كلمة المرور مطلوبة (6 أحرف على الأقل)" });
    }

    // التحقق من وجود البريد الإلكتروني
    const { data: existingUser, error: existingError } = await req.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      // إذا كان مستخدم جوجل، نسمح بتسجيل الدخول مباشرة والحصول على التوكن
      const token = jwt.sign(
        { userId: existingUser.email, email: existingUser.email, authProvider: 'google' },
        process.env.JWT_SECRET || "sudan_quality_secret",
        { expiresIn: "24h" }
      );

      return res.status(200).json({
        success: true,
        token,
        user: {
          userId: existingUser.email,
          email: existingUser.email,
          displayName: existingUser.email.split('@')[0],
          photoURL: null
        }
      });
    }

    let hashedPassword = null;
    if (!isGoogleUser) {
      // Local users only: hash password
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    // إنشاء مستخدم جديد
    const { data: user, error: insertError } = await req.supabase
      .from('users')
      .insert({
        email,
        progress: {
          completedUnits: [],
          currentUnit: null,
          totalScore: 0,
          certificates: []
        },
        xp: 0,
        level: 1,
        badges: [],
        stats: {
          totalQuizzes: 0,
          perfectScores: 0,
          lecturesCompleted: 0
        }
      })
      .select()
      .single();

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      return res.status(500).json({ error: insertError.message });
    }

    // إنشاء JWT token لكل المستخدمين
    const token = jwt.sign(
      { userId: user.email, email: user.email, authProvider: isGoogleUser ? 'google' : 'local' },
      process.env.JWT_SECRET || "sudan_quality_secret",
      { expiresIn: "24h" }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        userId: user.email,
        email: user.email,
        displayName: displayName,
        photoURL: null
      }
    });
  } catch (error) {
    console.error("CRITICAL Registration error:", error);
    res.status(500).json({
      error: "حدث خطأ في الخادم",
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
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
      const { data: user, error } = await req.supabase
        .from('users')
        .select('*')
        .eq('email', userId)
        .single();

      if (error || !user) {
        return res.status(404).json({ error: "المستخدم غير موجود" });
      }
      res.json({
        userId: user.email,
        email: user.email,
        displayName: user.email.split('@')[0],
        photoURL: null
      });
    }

  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "حدث خطأ في الخادم" });
  }
};


module.exports = { registerUser, getUser };
