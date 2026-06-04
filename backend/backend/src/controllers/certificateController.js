const Certificate = require('../models/Certificate');
const User = require('../models/User');

// Internal: Create cert document (refactored)
const createCertDoc = async (userId, userName, level, includedUnits, unitId, unitName, score, percentage) => {
  const certNumber = `SQP-L${level}-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  const verifyUrl = `${process.env.FRONTEND_URL || ''}/verify?id=${certNumber}`;

  const cert = await Certificate.create({
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
  });

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
    let user = await User.findOne({ email: userId });
    if (!user) {
      user = await User.create({
        email: userId,
        progress: {
          completedUnits: [],
          certificates: [],
          level: 1
        }
      });
      console.log(`[Auto-create] Created user ${userId}`);
    }

    // Mark unit complete if not already
    const progress = user.progress || { completedUnits: [], certificates: [], level: 1 };
    if (!progress.completedUnits.includes(unitId)) {
      progress.completedUnits.push(unitId);
    }

    const level = progress.level || 1;
    let cert;

    // Check for duplicate cert for this unit
    const existingCert = await Certificate.findOne({ userId, unitId });

    if (existingCert) {
      console.log(`[Award] Cert already exists for ${userId}/${unitId}, skipping`);
      return res.json({ success: true, certificate: existingCert, level, completedCount: progress.completedUnits.length, duplicate: true });
    }

    // Always award one certificate per unit
    cert = await createCertDoc(userId, userName, level, null, unitId, unitName, score, percentage);

    if (cert) {
      progress.certificates.push({
        certificateId: cert._id,
        issueDate: new Date().toISOString(),
        score,
        unitType: unitName,
        unitId,
        level
      });

      await User.updateOne(
        { email: userId },
        { progress }
      );
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
    const cert = await createCertDoc(userId, userName, level, null, unitId, unitName, score, percentage);
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

    const cert = await Certificate.findOne({ certNumber });

    if (!cert) return res.status(404).json({ found: false });
    return res.json({ found: true, id: cert._id, data: cert });
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

    const cert = await Certificate.findOne({ userId, unitId });

    if (!cert) {
      // Check if in bundled includedUnits
      const bundledCert = await Certificate.findOne({ userId, 'includedUnits.unitId': unitId });
      if (!bundledCert) return res.json({ found: false });
      return res.json({ found: true, data: bundledCert });
    }
    return res.json({ found: true, data: cert });
  } catch (err) {
    console.error('checkUserCertificate error', err);
    return res.status(500).json({ error: 'internal' });
  }
};
