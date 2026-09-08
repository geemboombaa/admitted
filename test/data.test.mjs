// Real tests over ALL school JSON files. No fixtures — loads the actual data/schools/*.json.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { loadSchools, getSchool, buildSchool } from '../core/data.mjs';
import { chance } from '../core/engine.mjs';

const DATA_DIR = fileURLToPath(new URL('../data/schools', import.meta.url));
const schools = loadSchools(DATA_DIR);

test('loads the full school set', () => {
  assert.ok(schools.length >= 100, `expected >=100 schools, got ${schools.length}`);
});

test('every school has the numeric fields the engine requires', () => {
  for (const s of schools) {
    assert.ok(typeof s.id === 'string' && s.id, `missing id`);
    assert.equal(typeof s.admit, 'number', `${s.id}: admit not numeric`);
    assert.ok(s.admit > 0 && s.admit <= 1, `${s.id}: admit out of range (${s.admit})`);
    assert.equal(typeof s.g25, 'number', `${s.id}: g25 not numeric`);
    assert.equal(typeof s.g75, 'number', `${s.id}: g75 not numeric`);
    assert.ok(s.g75 >= s.g25, `${s.id}: g75 < g25`);
    if (s.s25 > 0) assert.ok(s.s75 >= s.s25, `${s.id}: s75 < s25`);
  }
});

test('chance() produces a valid probability for every real school', () => {
  for (const s of schools) {
    const p = chance(s, 3.8, 1300, false);
    assert.ok(p >= 0.02 && p <= 0.96, `${s.id}: chance out of range (${p})`);
  }
});

test('verified values override the rough general.* values (the trust fix)', () => {
  const drex = getSchool(schools, 'drex');
  assert.ok(drex, 'drexel present');
  // verifiedFacts: admit 0.794 (not 0.8), coa 86353, merit 23607, sat 1250/1430 (not 1200/1400).
  assert.equal(drex.admit, 0.794, 'verified admit applied');
  assert.equal(drex.coa, 86353, 'verified coa applied');
  assert.equal(drex.merit, 23607, 'verified merit applied');
  assert.equal(drex.s25, 1250, 'verified s25 applied (sat token -> s25)');
  assert.equal(drex.s75, 1430, 'verified s75 applied (sat token -> s75)');
});

test('vf lists exactly the fields that carry a verified value (per-field badges)', () => {
  const drex = getSchool(schools, 'drex');
  for (const f of ['admit', 'coa', 'merit', 's25', 's75']) {
    assert.ok(drex.vf.includes(f), `vf should include ${f}`);
  }
  // No token should leak in that has no value (e.g. the raw "sat"/"gpa" tokens).
  assert.ok(!drex.vf.includes('sat'), 'raw "sat" token must not appear as a verified field');
});

test('no fabrication: every field named in vf actually has a non-null value', () => {
  for (const s of schools) {
    for (const f of (s.vf || [])) {
      assert.ok(s[f] != null, `${s.id}: vf names ${f} but value is null`);
    }
  }
});

test('BS/MD wedge fields are preserved (not discarded like the legacy generator)', () => {
  const drex = getSchool(schools, 'drex');
  assert.ok(drex.program && drex.program.bar, 'program.bar preserved');
  assert.equal(drex.program.bar.gpa, 3.5);
  assert.equal(drex.program.bar.sat, 1420);
  assert.ok(drex.programVerified, 'programVerified preserved');
  assert.equal(drex.programVerified.admitRatePct, 2.7, 'real program admit rate preserved');
  assert.equal(drex.affiliatedMedCost, 95000, 'affiliated med cost preserved');
});

test('buildSchool never invents a verified flag from nothing', () => {
  const bare = buildSchool({ id: 'z', general: { id: 'z', admit: 0.5, g25: 3, g75: 4 } });
  assert.equal(bare.verified, false);
  assert.deepEqual(bare.vf, []);
});
