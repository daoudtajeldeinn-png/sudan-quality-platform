const supabase = require('../config/supabase');
const jwt = require("jsonwebtoken");

const makeToken = (userId, email, authProvider) =>
  jwt.sign(
    { userId, email, authProvider },
    process.env.JWT_SECRET || "sudan_quality_secret",
    { expiresIn: "24h" }
  );

// Register / login user — UPSERT so all 42 Firebase users land in Supabase
const registerUser = async (req, res) => {
  try {
    if (req.isDemoMode) {
      const { email, userId, photoURL } = req.body;
      if (!email) return res.status(400).json({ error: "Email required" });
      const displayName = req.body.displayName || email.split('@')[0];
      let user = await req.demoDB.findUserByEmail(email);
      if (!user) {
        user = await req.demoDB.createUser({
          userId: userId || `demo_${Date.now()}`,
          email, displayName,
          photoURL: photoURL || null,
          authProvider: 'google'
        });
      }
      return res.status(200).json({
        success: true,
        token: makeToken(user._id, user.email, 'google'),
        user: { userId: user._id, email: user.email, displayName: user.displayName, photoURL: user.photoURL }
      });
    }

    // ── Production Supabase flow ──
    const { email, userId, photoURL } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });
    if (!userId) return res.status(400).json({ error: "userId required" });

    const displayName = req.body.displayName || email.split('@')[0];
    const now = new Date().toISOString();

    // Check existing user's lastLogin BEFORE upsert
    const { data: existingUser } = await supabase
      .from('users')
      .select('lastLogin, createdAt')
      .eq('userId', userId)
      .single();

    // Check 14-day inactivity (only for existing users, not new ones)
    let isInactive = false;
    if (existingUser?.lastLogin) {
      const daysSinceLogin = (Date.now() - new Date(existingUser.lastLogin).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceLogin > 14) isInactive = true;
    }

    // UPSERT on userId — if exists update lastLogin+displayName, if not create full record
    const { data: user, error } = await supabase
      .from('users')
      .upsert({
        userId,
        email,
        displayName,
        photoURL: photoURL || null,
        authProvider: 'google',
        lastLogin: now,
        // These only apply on INSERT (existing rows keep their values via upsert merge)
        xp:       0,
        level:    1,
        badges:   [],
        stats:    { totalQuizzes: 0, perfectScores: 0, lecturesCompleted: 0 },
        progress: { completedUnits: [], currentUnit: null, totalScore: 0, certificates: [] },
        createdAt: now,
      }, {
        onConflict: 'userId',
        ignoreDuplicates: false,
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Upsert user error:', error);
      return res.status(500).json({ error: error.message });
    }

    const daysSince = existingUser?.lastLogin
      ? Math.floor((Date.now() - new Date(existingUser.lastLogin).getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    console.log(`✅ User registered/updated: ${email}${isInactive ? ` (inactive ${daysSince} days)` : ''}`);
    return res.status(200).json({
      success: true,
      inactive: isInactive,
      daysSince: isInactive ? daysSince : 0,
      token: makeToken(user.userId, user.email, 'google'),
      user: { userId: user.userId, email: user.email, displayName: user.displayName, photoURL: user.photoURL }
    });

  } catch (error) {
    console.error("CRITICAL Registration error:", error);
    res.status(500).json({ error: "Server error: " + error.message });
  }
};

// Get user by userId
const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (req.isDemoMode) {
      const user = await req.demoDB.findUserById(userId);
      if (!user) return res.status(404).json({ error: "User not found" });
      return res.json({ userId: user.userId || user._id, email: user.email, displayName: user.displayName, photoURL: user.photoURL });
    }
    const { data: user, error } = await supabase.from('users').select('*').eq('userId', userId).single();
    if (error || !user) return res.status(404).json({ error: "User not found" });
    res.json({ userId: user.userId, email: user.email, displayName: user.displayName, photoURL: user.photoURL });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { registerUser, getUser };
