const express  = require('express');
const router   = express.Router();
const supabase = require('../config/supabase');

const ADMIN_EMAILS = ['daoudtajeldeinn113@gmail.com','daoudtajeldeinn@gmail.com'];
const adminAuth = (req, res, next) => {
  const email = req.headers['x-admin-email'];
  if (!email || !ADMIN_EMAILS.includes(email)) return res.status(403).json({ error:'Forbidden' });
  next();
};

const getAllFirebaseUsers = async () => {
  try {
    const { GoogleAuth } = require('google-auth-library');
    const credentials = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS);
    const auth = new GoogleAuth({ credentials, scopes: ['https://www.googleapis.com/auth/firebase'] });
    const client = await auth.getClient();
    const token  = await client.getAccessToken();

    let allUsers = [];
    let nextPageToken = undefined;
    do {
      const url = new URL('https://identitytoolkit.googleapis.com/v1/projects/decisive-octane-472816-d3/accounts:batchGet');
      url.searchParams.set('maxResults', '1000');
      if (nextPageToken) url.searchParams.set('nextPageToken', nextPageToken);
      const response = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token.token}` }
      });
      const data = await response.json();
      if (data.error) { console.error('Firebase REST error:', data.error); return []; }
      allUsers = allUsers.concat(data.users || []);
      nextPageToken = data.nextPageToken;
    } while (nextPageToken);

    console.log(`Firebase users fetched: ${allUsers.length}`);
    return allUsers;
  } catch(err) { console.error('getAllFirebaseUsers error:', err.message); return []; }
};

router.get('/stats', adminAuth, async (req, res) => {
  try {
    const [{ count: certsCount },{ count: questionsCount },{ count: supaUsersCount }, firebaseUsers] = await Promise.all([
      supabase.from('certificates').select('*',{count:'exact',head:true}),
      supabase.from('questions').select('*',{count:'exact',head:true}),
      supabase.from('users').select('*',{count:'exact',head:true}),
      getAllFirebaseUsers(),
    ]);
    const { data: xpData } = await supabase.from('users').select('xp');
    const xps = (xpData||[]).map(r=>r.xp).filter(Boolean);
    const avgXp = xps.length ? Math.round(xps.reduce((a,b)=>a+b,0)/xps.length) : 0;
    const totalUsers = firebaseUsers.length || supaUsersCount || 0;
    res.json({ totalUsers, totalCerts:certsCount||0, totalQuestions:questionsCount||0, avgXp });
  } catch(err) { res.status(500).json({ error:err.message }); }
});

router.get('/users', adminAuth, async (req, res) => {
  try {
    const [firebaseUsers, { data: supabaseUsers }] = await Promise.all([
      getAllFirebaseUsers(),
      supabase.from('users').select('userId,xp,level,createdAt'),
    ]);
    const supaMap = {};
    for (const u of (supabaseUsers||[])) { if (u.userId) supaMap[u.userId] = u; }
    let users;
    if (firebaseUsers.length > 0) {
      users = firebaseUsers.map(u => ({
        userId:      u.localId,
        displayName: u.displayName || u.email?.split('@')[0] || 'User',
        email:       u.email || '—',
        photoURL:    u.photoUrl || null,
        xp:          supaMap[u.localId]?.xp    || 0,
        level:       supaMap[u.localId]?.level || 1,
        createdAt:   u.createdAt   ? new Date(parseInt(u.createdAt)).toISOString()   : null,
        lastLogin:   u.lastLoginAt ? new Date(parseInt(u.lastLoginAt)).toISOString() : null,
        hasProgress: !!supaMap[u.localId],
      })).sort((a,b) => (b.xp||0)-(a.xp||0));
    } else {
      const { data } = await supabase.from('users')
        .select('userId,displayName,email,xp,level,photoURL,createdAt,updated_at')
        .order('xp',{ascending:false});
      users = data || [];
    }
    res.json({ users, total: users.length });
  } catch(err) { res.status(500).json({ error:err.message }); }
});

router.get('/certificates', adminAuth, async (req, res) => {
  try {
    const { data, error } = await supabase.from('certificates').select('*').order('createdAt',{ascending:false});
    if (error) throw error;
    res.json({ certificates: data||[] });
  } catch(err) { res.status(500).json({ error:err.message }); }
});

router.delete('/certificates/:id', adminAuth, async (req, res) => {
  try {
    const { error } = await supabase.from('certificates').delete().eq('id',req.params.id);
    if (error) throw error;
    res.json({ success:true });
  } catch(err) { res.status(500).json({ error:err.message }); }
});

router.delete('/users/:userId/progress', adminAuth, async (req, res) => {
  try {
    const { error } = await supabase.from('users').update({xp:0,level:1,progress:{}}).eq('userId',req.params.userId);
    if (error) throw error;
    res.json({ success:true });
  } catch(err) { res.status(500).json({ error:err.message }); }
});

module.exports = router;

// ── QUESTION MANAGER ──

// GET /api/admin/questions/:unitId
router.get('/questions/:unitId', adminAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('unitId', req.params.unitId)
      .order('id', { ascending: true });
    if (error) throw error;
    res.json({ questions: data || [] });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

// POST /api/admin/questions
router.post('/questions', adminAuth, async (req, res) => {
  try {
    const { unitId, question, options, correctAnswer, type, explanation } = req.body;
    const { data, error } = await supabase
      .from('questions')
      .insert({ unitId, question, options, correctAnswer, type: type||'mcq', explanation: explanation||'' })
      .select().single();
    if (error) throw error;
    res.json({ success: true, question: data });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/admin/questions/:id
router.put('/questions/:id', adminAuth, async (req, res) => {
  try {
    const { question, options, correctAnswer, type, explanation } = req.body;
    const { data, error } = await supabase
      .from('questions')
      .update({ question, options, correctAnswer, type, explanation })
      .eq('id', req.params.id)
      .select().single();
    if (error) throw error;
    res.json({ success: true, question: data });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/admin/questions/:id
router.delete('/questions/:id', adminAuth, async (req, res) => {
  try {
    const { error } = await supabase.from('questions').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

// POST /api/admin/users/:userId/reactivate
router.post('/users/:userId/reactivate', adminAuth, async (req, res) => {
  try {
    const { error } = await supabase
      .from('users')
      .update({ lastLogin: new Date().toISOString() })
      .eq('userId', req.params.userId);
    if (error) throw error;
    res.json({ success: true, message: 'User reactivated' });
  } catch(err) { res.status(500).json({ error: err.message }); }
});
