const User = require("../models/User");

// الحصول على الملف الشخصي الكامل (XP, Level, Badges, Progress)
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (req.isDemoMode) {
      const user = await req.demoDB.findUserById(userId);
      if (!user) {
        return res.status(404).json({ error: "المستخدم غير موجود" });
      }
      res.json(user);
    } else {
      const user = await User.findOne({ userId });
      
      if (!user) {
        return res.status(404).json({ error: "المستخدم غير موجود" });
      }
      
      res.json(user);
    }
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "حدث خطأ في جلب بيانات المستخدم" });
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
        // البحث عن المستخدم وتحديثه
        const user = await User.findOneAndUpdate(
          { userId },
          { 
            $set: { 
              xp, 
              level, 
              badges, 
              stats,
              progress,
              lastLogin: new Date() // تحديث تاريخ التواجد
            } 
          },
          { new: true, upsert: false }
        );
        
        if (!user) {
          return res.status(404).json({ error: "المستخدم غير موجود للمزامنة" });
        }
        
        res.json({ success: true, user });
      }
    } catch (error) {
      console.error("Sync stats error:", error);
      res.status(500).json({ error: "فشلت عملية المزامنة مع الخادم" });
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
