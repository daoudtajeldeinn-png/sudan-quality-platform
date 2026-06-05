const supabase = require('../config/supabase');

// Internal: Create cert document (refactored)
const createCertDoc = async (supabase, userId, userName, level, includedUnits, unitId, unitName, score, percentage) => {
  const certNumber = `SQP-L${level}-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  const verifyUrl = `${process.env.FRONTEND_URL || ''}/verify?id=${certNumber}`;

  const { data: cert, error } = await supabase
    .from('certificates')
    .insert({
      userId,
      userName,
      level,
      includedUnits,
      unitId: includedUnits?.length > 1 ? null : unitId,
      unitName,
      score,
      percentage,
      certNumber,
      verifyUrl,
      certificateData: {
        certNumber,
        verifyUrl,
        issuedAt: new Date().toISOString()
      }
    })
    .select()
    .single();

  if (error) throw error;
  return cert;
};

// Smart award: handles level logic
exports.awardCertificateSmart = async (req, res) => {
  try {
    const { userId, userName, unitId, unitName, score, percentage } = req.body;
    if (!userId || !unitId || score < 90) return res.status(400).json({ error: 'Valid completion required (90%+)' });

    if (req.isDemoMode) {
      const cert = await req.demoDB.awardCertificate(userId, {
        userName,
        unitId,
        unitName,
        score,
        percentage,
        level: 2 // Assume advanced for specialized
      });
      return res.json({ success: true, certificate: cert, level: 2, completedCount: 1 });
    }

    // Get or create user
    const { data: user, error: userError } = await req.supabase
      .from('users')
      .select('*')
      .eq('email', userId)
      .single();

    if (userError && userError.code !== 'PGRST116') {
      console.error('Supabase error:', userError);
      return res.status(500).json({ error: userError.message });
    }

    let userData = user;
    // Auto-create user if not exists
    if (!user) {
      const { data: newUser, error: insertError } = await req.supabase
        .from('users')
        .insert({
          email: userId,
          progress: {
            completedUnits: [],
            certificates: [],
            level: 1
          }
        })
        .select()
        .single();

      if (insertError) {
        console.error('Supabase insert error:', insertError);
        return res.status(500).json({ error: insertError.message });
      }
      userData = newUser;
      console.log(`[Auto-create] Created user ${userId}`);
    }

    // Mark unit complete if not already
    const progress = userData.progress || { completedUnits: [], certificates: [], level: 1 };
    if (!progress.completedUnits.includes(unitId)) {
      progress.completedUnits.push(unitId);
    }

    const level = progress.level || 1;
    let cert;

    // Check for duplicate cert for this unit
    const { data: existingCert, error: existingError } = await req.supabase
      .from('certificates')
      .select('*')
      .eq('userId', userId)
      .eq('unitId', unitId)
      .single();

    if (existingCert) {
      console.log(`[Award] Cert already exists for ${userId}/${unitId}, skipping`);
      return res.json({ success: true, certificate: existingCert, level, completedCount: progress.completedUnits.length, duplicate: true });
    }

    // Always award one certificate per unit
    cert = await createCertDoc(req.supabase, userId, userName, level, null, unitId, unitName, score, percentage);

    if (cert) {
      progress.certificates.push({
        certificateId: cert.id,
        issueDate: new Date().toISOString(),
        score,
        unitType: unitName,
        unitId,
        level
      });

      await req.supabase
        .from('users')
        .update({ progress, updated_at: new Date().toISOString() })
        .eq('email', userId);
    }

    return res.json({ success: true, certificate: cert || null, level, completedCount: progress.completedUnits.length });
  } catch (err) {
    console.error('awardCertificateSmart error', err);
    return res.status(500).json({ error: 'internal' });
  }
};

// Legacy create (kept for compatibility)
exports.createCertificate = async (req, res) => {
  try {
    const { userId, userName, unitId, unitName, score, percentage, level = 2 } = req.body;
    const cert = await createCertDoc(req.supabase, userId, userName, level, null, unitId, unitName, score, percentage);
    return res.json({ success: true, certificate: cert });
  } catch (err) {
    console.error('createCertificate error', err);
    return res.status(500).json({ error: 'internal' });
  }
};

// Verify by number
exports.verifyByNumber = async (req, res) => {
  try {
    const certNumber = req.query.certNumber || req.query.id;
    if (!certNumber) return res.status(400).json({ error: 'certNumber required' });

    const { data: cert, error } = await req.supabase
      .from('certificates')
      .select('*')
      .eq('certNumber', certNumber)
      .single();

    if (error || !cert) return res.status(404).json({ found: false });
    return res.json({ found: true, id: cert.id, data: cert });
  } catch (err) {
    console.error('verifyByNumber error', err);
    return res.status(500).json({ error: 'internal' });
  }
};

// Check by user and unit (supports bundled)
exports.checkUserCertificate = async (req, res) => {
  try {
    const { userId, unitId } = req.query;
    if (!userId || !unitId) return res.status(400).json({ error: 'userId and unitId required' });

    const { data: cert, error } = await req.supabase
      .from('certificates')
      .select('*')
      .eq('userId', userId)
      .eq('unitId', unitId)
      .single();

    if (!cert || error) {
      // Check if in bundled includedUnits
      const { data: bundledCert, error: bundledError } = await req.supabase
        .from('certificates')
        .select('*')
        .eq('userId', userId)
        .contains('includedUnits', [{ unitId }])
        .single();

      if (!bundledCert || bundledError) return res.json({ found: false });
      return res.json({ found: true, data: bundledCert });
    }
    return res.json({ found: true, data: cert });
  } catch (err) {
    console.error('checkUserCertificate error', err);
    return res.status(500).json({ error: 'internal' });
  }
};
