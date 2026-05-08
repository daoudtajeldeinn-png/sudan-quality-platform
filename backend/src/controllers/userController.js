const User = require("../models/User");

// الحصول على الملف الشخصي الكامل (XP, Level, Badges, Progress)
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`🔍 Fetching profile for: ${userId} (DemoMode: ${req.isDemoMode})`);

    if (req.isDemoMode) {
      if (!req.demoDB) return res.status(500).json({ error: "Demo database not initialized" });
      const user = await req.demoDB.findUserById(userId);
      if (!user) return res.status(404).json({ error: "المستخدم غير موجود" });
      return res.json(user);
    } else {
      let user = await User.findOne({ userId });
      
      if (!user && userId) {
        console.log(`✨ Auto-creating profile for: ${userId}`);
        user = new User({
          userId,
          email: "quality@sudan-quality.com",
          displayName: "Quality Member",
          createdAt: new Date(),
          progress: { completedUnits: [], certificates: [] }
        });
        await user.save();
      }
      
      if (!user) return res.status(404).json({ error: "User not found after creation attempt" });
      res.json(user);
    }
  } catch (error) {
    console.error("❌ Get profile error:", error.message);
    res.status(500).json({ error: "Server Error: " + error.message });
  }
};

// مزامنة البيانات (XP, Level, Badges, Stats)
const syncUserStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const { xp, level, badges, stats, progress } = req.body;
    
    if (req.isDemoMode) {
      const updatedUser = await req.demoDB.updateUser(userId, {
        xp, 
        level, 
        badges, 
        stats,
        progress,
        lastLogin: new Date()
      });
      res.json({ success: true, user: updatedUser });
    } else {
      // بناء كائن التحديث ديناميكياً لتجنب مسح البيانات الموجودة
      const updateData = {};
      if (xp !== undefined) updateData.xp = xp;
      if (level !== undefined) updateData.level = level;
      if (badges !== undefined) updateData.badges = badges;
      if (stats !== undefined) updateData.stats = stats;
      if (progress !== undefined) updateData.progress = progress;
      updateData.lastLogin = new Date();

      // البحث عن المستخدم وتحديثه (تفعيل upsert لإنشاء المستخدم إذا لم يوجد)
      const user = await User.findOneAndUpdate(
        { userId },
        { $set: updateData },
        { new: true, upsert: true } // Changed upsert to true to fix 404/500 loop
      );
      
      console.log(`✅ User sync successful for: ${userId}`);
      res.json({ success: true, user });
    }
  } catch (error) {
    console.error("❌ Sync stats fatal error:", error);
    res.status(500).json({ error: "فشلت عملية المزامنة: " + error.message });
  }
};


// الحصول على القائمة المتصدرة (Leaderboard)
const getCertificates = async (req, res) => {
  try {
    const { userId } = req.params;
    if (req.isDemoMode) {
      const user = await req.demoDB.findUserById(userId);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json({ 
        certificates: user.progress?.certificates || [], 
        completedCount: user.progress?.completedUnits?.length || 0 
      });
    } else {
      const user = await User.findOne({ userId });
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json({ certificates: user.progress.certificates || [], completedCount: user.progress.completedUnits.length });
    }

  } catch (err) {
    res.status(500).json({ error: 'internal' });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    if (req.isDemoMode) {
      const topUsers = Array.from(req.demoDB.users.values())
        .sort((a, b) => (b.xp || 0) - (a.xp || 0))
        .slice(0, 10)
        .map(u => ({
          displayName: u.displayName,
          xp: u.xp || 0,
          level: u.level || 1,
          photoURL: u.photoURL
        }));
      res.json(topUsers);
    } else {
      const topUsers = await User.find({}, 'displayName xp level photoURL')
        .sort({ xp: -1 })
        .limit(10);
      
      res.json(topUsers);
    }

  } catch (error) {
    console.error("Leaderboard error:", error);
    res.status(500).json({ error: "فشل جلب قائمة المتصدرين" });
  }
};


module.exports = {
  getUserProfile,
  syncUserStats,
  getCertificates,
  getLeaderboard
};
