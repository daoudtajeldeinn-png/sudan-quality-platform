const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String },
  unitId: { type: String, required: true },
  unitName: { type: String },
  score: { type: Number },
  percentage: { type: Number },
  certNumber: { type: String, required: true, unique: true },
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now },
  verifyUrl: { type: String }
});

module.exports = mongoose.model('Certificate', CertificateSchema);
