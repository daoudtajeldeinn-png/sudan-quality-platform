const supabase = require('../config/supabase');
const { buildCertificatePayload, resolveThreshold } = require('../services/certificateStorage.cjs');

const createCertDoc = async (supabaseClient, userId, userName, level, includedUnits, unitId, unitName, score, percentage) => {
  const payload = buildCertificatePayload({
    userId,
    userName,
    level,
    includedUnits,
    unitId,
    unitName,
    score,
    percentage
  });

  const { data: cert, error } = await supabaseClient
    .from('certificates')
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return cert;
};

// Smart award: handles level logic
exports.awardCertificateSmart = async (req, res) => {
  try {
    const { userId, userName, unitId, unitName, score, percentage } = req.body;
    const threshold = resolveThreshold(unitId);
    if (!userId || !unitId || score < threshold) return res.status(400).json({ error: `Valid completion required (${threshold}%+)` });

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

    let { data: user, error: userError } = await req.supabase
      .from('users')
      .select('*')
      .eq('userId', userId)
      .single();

    // Auto-create user if not exists (for Firebase auth users)
    if (userError || !user) {
      const { data: newUser, error: insertError } = await req.supabase
        .from('users')
        .insert({
          userId,
          email: userName,
          displayName: userName,
          progress: {
            completedUnits: [],
            certificates: [],
            level: 1
          },
          createdAt: new Date().toISOString()
        })
        .select()
        .single();

      if (insertError) {
        console.error('❌ Create user error:', insertError);
        return res.status(500).json({ error: insertError.message });
      }
      user = newUser;
      console.log(`[Auto-create] Created user ${userId}`);
    }

    // Mark unit complete if not already
    const completedUnits = user.progress?.completedUnits || [];
    if (!completedUnits.includes(unitId)) {
      completedUnits.push(unitId);
    }

    const level = user.progress?.level || user.level || 1;
    let cert;

    // Check for duplicate cert for this unit.
    // IMPORTANT: certificates created from bundled/multi-unit awards may store unitId as NULL
    // while still listing the real units inside includedUnits.
    const { data: existingCerts } = await req.supabase
      .from('certificates')
      .select('*')
      .eq('userId', userId)
      .eq('status', 'active');

    const existingCert = existingCerts?.find(c => {
      if (c.unitId && c.unitId === unitId) return true;
      return Array.isArray(c.includedUnits) && c.includedUnits.some(u => u?.unitId === unitId);
    });


    if (existingCert) {
      console.log(`[Award] Cert already exists for ${userId}/${unitId}, skipping`);
      return res.json({ success: true, certificate: existingCert, level, completedCount: completedUnits.length, duplicate: true });
    }

    // Always award one certificate per unit
    cert = await createCertDoc(req.supabase, userId, userName, level, null, unitId, unitName, score, percentage);

    if (cert) {
      const certificates = user.progress?.certificates || [];
      certificates.push({
        certificateId: cert.id,
        issueDate: new Date().toISOString(),
        score,
        unitType: unitName,
        unitId,
        level
      });

      await req.supabase
        .from('users')
        .update({
          progress: {
            ...user.progress,
            completedUnits,
            certificates
          }
        })
        .eq('userId', userId);
    }

    return res.json({ success: true, certificate: cert || null, level, completedCount: completedUnits.length });
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
      .eq('status', 'active')
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

    let { data: cert, error } = await req.supabase
      .from('certificates')
      .select('*')
      .eq('userId', userId)
      .eq('unitId', unitId)
      .eq('status', 'active')
      .single();

    if (error || !cert) {
      // Check if in bundled includedUnits (JSON array contains check)
      const { data: allCerts } = await req.supabase
        .from('certificates')
        .select('*')
        .eq('userId', userId)
        .eq('status', 'active');

      if (allCerts) {
        cert = allCerts.find(c => 
          c.includedUnits && 
          Array.isArray(c.includedUnits) && 
          c.includedUnits.some(u => u.unitId === unitId)
        );
      }
    }
    if (!cert) return res.json({ found: false });
    return res.json({ found: true, data: cert });
  } catch (err) {
    console.error('checkUserCertificate error', err);
    return res.status(500).json({ error: 'internal' });
  }
};
