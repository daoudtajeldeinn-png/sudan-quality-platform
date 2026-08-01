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
        .eq('userId', userId)
        .single();

      if (error || !user) {
        if (userId) {
          console.log(`✨ Auto-creating profile for: ${userId}`);
          const { data: newUser, error: insertError } = await req.supabase
            .from('users')
            .insert({
              userId,
              email: `${userId}@sudan-quality.com`,
              displayName: "Quality Member",
              createdAt: new Date().toISOString(),
              progress: { completedUnits: [], certificates: [] }
            })
            .select()
            .single();

          if (insertError) {
            console.error('❌ Create user error:', insertError);
            return res.status(500).json({ error: insertError.message });
          }
          return res.json(newUser);
        }
        return res.status(404).json({ error: "User not found" });
      }

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
      // Derive xp from progress.totalScore if xp not sent directly
      else if (progress && progress.totalScore !== undefined) updateData.xp = progress.totalScore;
      if (level !== undefined) updateData.level = level;
      if (badges !== undefined) updateData.badges = badges;
      if (stats !== undefined) updateData.stats = stats;
      if (progress !== undefined) {
        // Merge progress with existing progress
        updateData.progress = progress;
      }
      updateData.updated_at = new Date().toISOString();

      // Check if user exists
      const { data: existingUser } = await req.supabase
        .from('users')
        .select('userId')
        .eq('userId', userId)
        .single();

      if (existingUser) {
        // Update existing user
        const { data: user, error } = await req.supabase
          .from('users')
          .update(updateData)
          .eq('userId', userId)
          .select()
          .single();

        if (error) {
          console.error('❌ Update user error:', error);
          return res.status(500).json({ error: error.message });
        }
        console.log(`✅ User sync successful for: ${userId}`);
        res.json({ success: true, user });
      } else {
        // Create new user
        const { data: user, error } = await req.supabase
          .from('users')
          .insert({
            userId,
            email: `${userId}@sudan-quality.com`,
            displayName: "Quality Member",
            ...updateData
          })
          .select()
          .single();

        if (error) {
          console.error('❌ Create user error:', error);
          return res.status(500).json({ error: error.message });
        }
        console.log(`✅ User sync successful for: ${userId}`);
        res.json({ success: true, user });
      }
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
        .eq('userId', userId)
        .single();

      if (userError || !user) return res.status(404).json({ error: 'User not found' });

      const { data: certificates, error: certError } = await req.supabase
        .from('certificates')
        .select('*')
        .eq('userId', userId);

      if (certError) {
        console.error('❌ Get certificates error:', certError);
        return res.status(500).json({ error: certError.message });
      }

      res.json({ certificates: certificates || [], completedCount: certificates ? certificates.length : 0 });
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
        .select('userId, displayName, xp, level, photoURL')
        .order('xp', { ascending: false })
        .limit(10);

      if (error) {
        console.error('❌ Leaderboard error:', error);
        return res.status(500).json({ error: error.message });
      }

      res.json(topUsers || []);
    }

  } catch (error) {
    console.error("Leaderboard error:", error);
    res.status(500).json({ error: "فشل جلب قائمة المتصدرين" });
  }
};

// Mark a unit as completed
const markUnitCompleted = async (req, res) => {
  try {
    const { userId } = req.params;
    const { unitId, score, totalQuestions } = req.body;

    if (req.isDemoMode) {
      const user = await req.demoDB.findUserById(userId);
      if (!user) return res.status(404).json({ error: 'User not found' });

      const completedUnits = user.progress?.completedUnits || [];
      if (!completedUnits.includes(unitId)) {
        completedUnits.push(unitId);
      }

      const completionDates = user.progress?.completionDates || {};
      completionDates[unitId] = new Date().toISOString();

      await req.demoDB.updateUser(userId, {
        progress: {
          ...user.progress,
          completedUnits,
          completionDates
        }
      });

      res.json({ success: true, completedUnits, completionDates });
    } else {
      const { data: user, error: userError } = await req.supabase
        .from('users')
        .select('*')
        .eq('userId', userId)
        .single();

      if (userError || !user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const completedUnits = user.completedUnits || {};
      const completionDates = user.completionDates || {};

      // Mark unit as completed with score
      completedUnits[unitId] = {
        completed: true,
        score,
        totalQuestions,
        completedAt: new Date().toISOString()
      };
      completionDates[unitId] = new Date().toISOString();

      const { data: updatedUser, error: updateError } = await req.supabase
        .from('users')
        .update({
          completedUnits,
          completionDates,
          updated_at: new Date().toISOString()
        })
        .eq('userId', userId)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Mark unit completed error:', updateError);
        return res.status(500).json({ error: updateError.message });
      }

      console.log(`✅ Unit ${unitId} marked as completed for user ${userId}`);
      res.json({ success: true, completedUnits, completionDates });
    }
  } catch (error) {
    console.error("❌ Mark unit completed error:", error);
    res.status(500).json({ error: "فشل تحديث حالة الوحدة: " + error.message });
  }
};


module.exports = {
  getUserProfile,
  syncUserStats,
  getCertificates,
  getLeaderboard,
  markUnitCompleted
};
