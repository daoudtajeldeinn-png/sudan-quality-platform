const Certificate = require('../models/Certificate');
const User = require('../models/User');

// Internal: Create cert document (refactored)
const createCertDoc = async (userId, userName, level, includedUnits, unitId, unitName, score, percentage) => {
  const certNumber = `SQP-L${level}-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  const verifyUrl = `${process.env.FRONTEND_URL || ''}/verify?id=${certNumber}`;
  const cert = new Certificate({ 
    userId, userName, level, includedUnits, 
    unitId: includedUnits?.length > 1 ? null : unitId, // single for advanced
    unitName, score, percentage, certNumber, verifyUrl 
  });
  await cert.save();
  return cert;
};

// Smart award: handles level logic
exports.awardCertificateSmart = async (req, res) => {
  try {
    const { userId, userName, unitId, unitName, score, percentage } = req.body;
    if (!userId || !unitId || score < 90) return res.status(400).json({ error: 'Valid completion required (90%+)' });

    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Mark unit complete if not already
    if (!user.progress.completedUnits.includes(unitId)) {
      user.progress.completedUnits.push(unitId);
      user.progress.totalScore += score;
    }

    const level = user.progress.level || user.level || 1; // Prefer progress.level
    let cert;

    if (level === 1) {
      // Basic: check if multiple of 3
      if (user.progress.completedUnits.length % 3 === 0) {
        const last3 = user.progress.completedUnits.slice(-3).map((id, idx) => ({
          unitId: id,
          unitName: unitName, // Simplify, or fetch names
          score: score,
          percentage
        }));
        const avgScore = score; // Avg of last 3 (simplified)
        cert = await createCertDoc(userId, userName, 1, last3, null, `3 كورسات ابتدائية (Basic)`, avgScore, percentage);
      }
    } else {
      // Advanced: per unit
      cert = await createCertDoc(userId, userName, 2, null, unitId, unitName, score, percentage);
    }

    if (cert) {
      user.progress.certificates.push({
        certificateId: cert._id.toString(),
        issueDate: new Date(),
        score,
        unitType: unitName,
        level
      });
      await user.save();
    }

    return res.json({ success: true, certificate: cert || null, level, completedCount: user.progress.completedUnits.length });
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

    const cert = await Certificate.findOne({ certNumber, status: 'active' }).lean();
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

    let cert = await Certificate.findOne({ userId, unitId, status: 'active' }).lean();
    if (!cert) {
      // Check if in bundled includedUnits
      cert = await Certificate.findOne({ 
        userId, 
        'includedUnits.unitId': unitId, 
        status: 'active' 
      }).lean();
    }
    if (!cert) return res.json({ found: false });
    return res.json({ found: true, data: cert });
  } catch (err) {
    console.error('checkUserCertificate error', err);
    return res.status(500).json({ error: 'internal' });
  }
};
