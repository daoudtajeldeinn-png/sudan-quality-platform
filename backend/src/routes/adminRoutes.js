const express = require('express');
const router  = express.Router();
const supabase = require('../config/supabase');

const ADMIN_EMAILS = ['daoudtajeldeinn113@gmail.com','daoudtajeldeinn@gmail.com'];
const adminAuth = (req, res, next) => {
  const email = req.headers['x-admin-email'];
  if (!email || !ADMIN_EMAILS.includes(email)) return res.status(403).json({ error:'Forbidden' });
  next();
};

// GET /api/admin/stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const [
      { count: usersCount },
      { count: certsCount },
      { count: questionsCount },
      { count: progressCount },
    ] = await Promise.all([
      supabase.from('users').select('*', { count:'exact', head:true }),
      supabase.from('certificates').select('*', { count:'exact', head:true }),
      supabase.from('questions').select('*', { count:'exact', head:true }),
      supabase.from('user_progress').select('*', { count:'exact', head:true }),
    ]);

    const { data: xpData } = await supabase.from('users').select('xp');
    const xps = (xpData||[]).map(r => r.xp).filter(Boolean);
    const avgXp = xps.length ? Math.round(xps.reduce((a,b)=>a+b,0)/xps.length) : 0;

    // Total unique users = max of users table OR user_progress table
    const totalUsers = Math.max(usersCount||0, progressCount||0);

    res.json({
      totalUsers,
      totalCerts:     certsCount     || 0,
      totalQuestions: questionsCount || 0,
      avgXp,
    });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

// GET /api/admin/users — merge users + user_progress for most complete list
router.get('/users', adminAuth, async (req, res) => {
  try {
    const [
      { data: usersData,    error: e1 },
      { data: progressData, error: e2 },
    ] = await Promise.all([
      supabase.from('users').select('userId,displayName,email,xp,level,photoURL,createdAt').order('xp', { ascending:false }),
      supabase.from('user_progress').select('userId,unitId,score').order('score', { ascending:false }),
    ]);

    if (e1) console.warn('users table error:', e1.message);
    if (e2) console.warn('user_progress table error:', e2.message);

    // Build merged map keyed by userId
    const merged = {};

    // First add all users from users table
    for (const u of (usersData||[])) {
      merged[u.userId] = {
        userId:      u.userId,
        displayName: u.displayName || 'User',
        email:       u.email || '—',
        xp:          u.xp   || 0,
        level:       u.level || 1,
        photoURL:    u.photoURL || null,
        createdAt:   u.createdAt || null,
        units:       0,
      };
    }

    // Then add/augment from user_progress (catches users not yet in users table)
    for (const p of (progressData||[])) {
      if (!merged[p.userId]) {
        merged[p.userId] = {
          userId:      p.userId,
          displayName: 'Student',
          email:       '—',
          xp:          p.score || 0,
          level:       1,
          photoURL:    null,
          createdAt:   null,
          units:       1,
        };
      } else {
        merged[p.userId].units = (merged[p.userId].units || 0) + 1;
      }
    }

    const users = Object.values(merged).sort((a,b) => (b.xp||0) - (a.xp||0));
    res.json({ users, total: users.length });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

// GET /api/admin/certificates
router.get('/certificates', adminAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .order('createdAt', { ascending:false });
    if (error) throw error;
    res.json({ certificates: data||[] });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/admin/certificates/:id
router.delete('/certificates/:id', adminAuth, async (req, res) => {
  try {
    const { error } = await supabase.from('certificates').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success:true });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/admin/users/:userId/progress
router.delete('/users/:userId/progress', adminAuth, async (req, res) => {
  try {
    const { error } = await supabase.from('users')
      .update({ xp:0, level:1, progress:{} })
      .eq('userId', req.params.userId);
    if (error) throw error;
    res.json({ success:true });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
