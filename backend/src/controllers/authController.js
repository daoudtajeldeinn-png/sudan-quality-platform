const supabase = require('../config/supabase');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// تسجيل مستخدم جديد
const registerUser = async (req, res) => {
  try {
    // Demo mode bypass using in-memory DB
    if (req.isDemoMode) {
      if (!req.body || !req.body.email) {
        return res.status(400).json({ error: "البريد الإلكتروني مطلوب" });
      }
      const { email, password, userId, photoURL } = req.body;
      const displayName = req.body.displayName || email.split('@')[0];
      
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
    if (!req.body || !req.body.email) {
      return res.status(400).json({ error: "البريد الإلكتروني مطلوب" });
    }
    const { email, password, userId } = req.body;
    const displayName = req.body.displayName || email.split('@')[0];
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

    if (existingUser && !existingError) {
      // إذا كان مستخدم جوجل، نسمح بتسجيل الدخول مباشرة والحصول على التوكن
      const token = jwt.sign(
        { userId: existingUser.userId, email: existingUser.email, authProvider: existingUser.authProvider },
        process.env.JWT_SECRET || "sudan_quality_secret",
        { expiresIn: "24h" }
      );

      return res.status(200).json({
        success: true,
        token,
        user: {
          userId: existingUser.userId,
          email: existingUser.email,
          displayName: existingUser.displayName,
          photoURL: existingUser.photoURL
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
        userId: userId || `user_${Date.now()}`,
        email,
        authProvider: isGoogleUser ? 'google' : 'local',
        displayName,
        photoURL: req.body.photoURL || null,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
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
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Create user error:', insertError);
      return res.status(500).json({ error: insertError.message });
    }

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
        .eq('userId', userId)
        .single();

      if (error || !user) {
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
