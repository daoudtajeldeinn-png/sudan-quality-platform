const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Certificate = require('../src/models/Certificate');

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not set in backend/.env');
    process.exit(1);
  }

  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  const certNumber = `SQP-${Date.now()}-${Math.random().toString(36).substr(2,5).toUpperCase()}`;
  const cert = new Certificate({
    userId: 'test_user_1',
    userName: 'Test User',
    unitId: 'unit-test-1',
    unitName: 'Test Unit',
    score: 9,
    percentage: 85,
    certNumber,
    status: 'active',
    verifyUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify?id=${certNumber}`
  });

  await cert.save();
  console.log('Created test certificate:', { id: cert._id.toString(), certNumber });

  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
