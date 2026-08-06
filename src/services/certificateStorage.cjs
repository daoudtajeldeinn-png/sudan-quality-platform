const createCertificateRecord = ({ userId, userName, level, includedUnits, unitId, unitName, score, percentage }) => {
  const certNumber = `SQP-L${level}-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  const verifyUrl = `${process.env.FRONTEND_URL || ''}/verify?id=${certNumber}`;

  return {
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
    status: 'active',
    createdAt: new Date().toISOString()
  };
};

const buildCertificatePayload = (input) => createCertificateRecord(input);

const resolveThreshold = (unitId) => {
  const specializedUnits = ['adv-iso-17025', 'capa', 'iso-9001', 'qc-lab', 'ipqc'];
  return specializedUnits.includes(unitId) ? 80 : 90;
};

module.exports = {
  createCertificateRecord,
  buildCertificatePayload,
  resolveThreshold
};
