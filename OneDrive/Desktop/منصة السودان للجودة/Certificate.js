const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String },
  unitId: { type: String }, // For advanced/single unit
  unitName: { type: String },
  level: { type: Number, default: 1 }, // 1=basic (every 3), 2=advanced (per unit)
  includedUnits: [{ unitId: String, unitName: String, score: Number, percentage: Number }], // Array for basic bundled certs
  score: { type: Number },
  percentage: { type: Number }, // Overall for bundled
  certNumber: { type: String, required: true, unique: true },
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now },
  verifyUrl: { type: String }
});

module.exports = mongoose.model('Certificate', CertificateSchema);
