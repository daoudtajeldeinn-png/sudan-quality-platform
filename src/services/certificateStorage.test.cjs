const test = require('node:test');
const assert = require('node:assert/strict');
const { buildCertificatePayload, resolveThreshold } = require('./certificateStorage.cjs');

test('buildCertificatePayload keeps a single unit id for regular awards', () => {
  const payload = buildCertificatePayload({
    userId: 'u1',
    userName: 'Alice',
    level: 2,
    includedUnits: null,
    unitId: 'iso-9001',
    unitName: 'ISO 9001',
    score: 95,
    percentage: 95
  });

  assert.equal(payload.unitId, 'iso-9001');
  assert.equal(payload.unitName, 'ISO 9001');
  assert.equal(payload.status, 'active');
});

test('resolveThreshold uses the higher threshold for specialized units', () => {
  assert.equal(resolveThreshold('adv-iso-17025'), 80);
  assert.equal(resolveThreshold('iso-9001'), 80);
  assert.equal(resolveThreshold('basic-unit'), 90);
});
