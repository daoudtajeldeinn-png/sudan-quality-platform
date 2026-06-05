const supabase = require('../config/supabase');

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
      const { data: user, error } = await req.supabase
        .from('users')
        .select('*')
        .eq('email', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Supabase error:', error);
        return res.status(500).json({ error: error.message });
      }

      if (!user && userId) {
        console.log(`✨ Auto-creating profile for: ${userId}`);
        const { data: newUser, error: insertError } = await req.supabase
          .from('users')
          .insert({
            email: userId,
            progress: { completedUnits: [], certificates: [] }
          })
          .select()
          .single();

        if (insertError) {
          console.error('Supabase insert error:', insertError);
          return res.status(500).json({ error: insertError.message });
        }

        return res.json(newUser);
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
      if (progress !== undefined) {
        updateData.progress = progress;
      }
      updateData.updated_at = new Date().toISOString();

      // البحث عن المستخدم وتحديثه (تفعيل upsert لإنشاء المستخدم إذا لم يوجد)
      const { data: user, error } = await req.supabase
        .from('users')
        .update(updateData)
        .eq('email', userId)
        .select()
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Supabase update error:', error);
        // If user doesn't exist, create it
        const { data: newUser, error: insertError } = await req.supabase
          .from('users')
          .insert({
            email: userId,
            ...updateData
          })
          .select()
          .single();

        if (insertError) {
          console.error('Supabase insert error:', insertError);
          return res.status(500).json({ error: insertError.message });
        }

        console.log(`✅ User sync successful for: ${userId} (created)`);
        return res.json({ success: true, user: newUser });
      }

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
      const { data: user, error: userError } = await req.supabase
        .from('users')
        .select('*')
        .eq('email', userId)
        .single();

      if (userError || !user) return res.status(404).json({ error: 'User not found' });

      const { data: certificates, error: certError } = await req.supabase
        .from('certificates')
        .select('*')
        .eq('userId', userId);

      res.json({ certificates: certificates || [], completedCount: certificates?.length || 0 });
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
      const { data: topUsers, error } = await req.supabase
        .from('users')
        .select('email, xp, level')
        .order('xp', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ error: error.message });
      }

      const mappedUsers = topUsers.map(u => ({
        displayName: u.email.split('@')[0],
        xp: u.xp || 0,
        level: u.level || 1,
        photoURL: null
      }));

      res.json(mappedUsers);
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
