import test from 'node:test';
import assert from 'node:assert/strict';
import { getPassingThreshold } from './passingThreshold.js';

test('quality-system units pass at 80%', () => {
  assert.equal(getPassingThreshold('capa'), 80);
  assert.equal(getPassingThreshold('iso-9001'), 80);
  assert.equal(getPassingThreshold('qc-lab'), 80);
  assert.equal(getPassingThreshold('ipqc'), 80);
});

test('advanced ISO unit also uses 80%', () => {
  assert.equal(getPassingThreshold('adv-iso-17025'), 80);
});
