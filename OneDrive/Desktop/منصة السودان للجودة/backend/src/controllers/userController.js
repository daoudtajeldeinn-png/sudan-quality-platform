const User = require("../models/User");

// الحصول على الملف الشخصي الكامل (XP, Level, Badges, Progress)
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ userId });
    
    if (!user) {
      return res.status(404).json({ error: "المستخدم غير موجود" });
    }
    
    res.json(user);
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
  } catch (error) {
    console.error("Sync stats error:", error);
    res.status(500).json({ error: "فشلت عملية المزامنة مع الخادم" });
  }
};

module.exports = {
  getUserProfile,
  syncUserStats
};
