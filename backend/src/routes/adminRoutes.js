const express  = require('express');
const router   = express.Router();
const supabase = require('../config/supabase');

const ADMIN_EMAILS = ['daoudtajeldeinn113@gmail.com','daoudtajeldeinn@gmail.com'];
const adminAuth = (req, res, next) => {
  const email = req.headers['x-admin-email'];
  if (!email || !ADMIN_EMAILS.includes(email)) return res.status(403).json({ error:'Forbidden' });
  next();
};

router.get('/stats', adminAuth, async (req, res) => {
  try {
    const [{ count: certsCount },{ count: questionsCount },{ count: usersCount }] = await Promise.all([
      supabase.from('certificates').select('*',{count:'exact',head:true}),
      supabase.from('questions').select('*',{count:'exact',head:true}),
      supabase.from('users').select('*',{count:'exact',head:true}),
    ]);
    const { data: xpData } = await supabase.from('users').select('xp');
    const xps = (xpData||[]).map(r=>r.xp).filter(Boolean);
    const avgXp = xps.length ? Math.round(xps.reduce((a,b)=>a+b,0)/xps.length) : 0;
    res.json({ totalUsers: usersCount||0, totalCerts: certsCount||0, totalQuestions: questionsCount||0, avgXp });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

router.get('/users', adminAuth, async (req, res) => {
  try {
    const { data, error } = await supabase.from('users')
      .select('userId,displayName,email,xp,level,photoURL,createdAt,updated_at')
      .order('xp',{ascending:false});
    if (error) throw error;
    res.json({ users: data||[], total: (data||[]).length });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

router.get('/certificates', adminAuth, async (req, res) => {
  try {
    const { data, error } = await supabase.from('certificates').select('*').order('createdAt',{ascending:false});
    if (error) throw error;
    res.json({ certificates: data||[] });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

router.delete('/certificates/:id', adminAuth, async (req, res) => {
  try {
    const { error } = await supabase.from('certificates').delete().eq('id',req.params.id);
    if (error) throw error;
    res.json({ success:true });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

router.delete('/users/:userId/progress', adminAuth, async (req, res) => {
  try {
    const { error } = await supabase.from('users').update({xp:0,level:1,progress:{}}).eq('userId',req.params.userId);
    if (error) throw error;
    res.json({ success:true });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
