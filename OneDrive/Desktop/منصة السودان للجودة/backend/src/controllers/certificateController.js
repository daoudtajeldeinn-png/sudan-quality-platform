const Certificate = require('../models/Certificate');

// Create a certificate (backend-only)
exports.createCertificate = async (req, res) => {
  try {
    const { userId, userName, unitId, unitName, score, percentage } = req.body;
    if (!userId || !unitId) return res.status(400).json({ error: 'userId and unitId required' });

    const certNumber = `SQP-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    const verifyUrl = `${process.env.FRONTEND_URL || ''}/verify?id=${certNumber}`;

    const cert = new Certificate({ userId, userName, unitId, unitName, score, percentage, certNumber, verifyUrl });
    await cert.save();
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

// Check by user and unit
exports.checkUserCertificate = async (req, res) => {
  try {
    const { userId, unitId } = req.query;
    if (!userId || !unitId) return res.status(400).json({ error: 'userId and unitId required' });

    const cert = await Certificate.findOne({ userId, unitId, status: 'active' }).lean();
    if (!cert) return res.json({ found: false });
    return res.json({ found: true, data: cert });
  } catch (err) {
    console.error('checkUserCertificate error', err);
    return res.status(500).json({ error: 'internal' });
  }
};
