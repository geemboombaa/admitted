// Real tests for the frozen engine. No mocks. Uses real school records where a shape is needed.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chance, band, flipDelta, fit, BANDCOL } from '../core/engine.mjs';

// A real-shaped school (Drexel general, pre-verified values not needed for math tests).
const DREX = { id: 'drex', admit: 0.794, g25: 3.3, g75: 3.85, s25: 1250, s75: 1430, tb: false, coa: 86353, merit: 23607, region: 'Other', premed: 7, research: 7, social: 6 };
const REACH = { id: 'x', admit: 0.05, g25: 3.9, g75: 4.0, s25: 1500, s75: 1560, tb: false }; // marquee-BS/MD-like low admit

test('chance is clamped to [0.02, 0.96]', () => {
  // Way below range -> floor; way above -> capped by admit*(0.35+1.3*1.25) then 0.96 ceiling.
  assert.ok(chance(DREX, 1.0, 400, false) >= 0.02);
  assert.ok(chance(DREX, 5.0, 1600, false) <= 0.96);
  // A tiny-admit school can never exceed its own ceiling ~ admit*1.71.
  const hi = chance(REACH, 5.0, 1600, false);
  assert.ok(hi <= 0.96);
  assert.ok(hi <= REACH.admit * (0.35 + 1.3 * 1.25) + 1e-9);
});

test('chance is monotonic non-decreasing in GPA, and strictly rises overall', () => {
  let prev = -1;
  const first = chance(DREX, 2.0, 1300, false);
  let last = first;
  for (let g = 2.0; g <= 4.5; g += 0.1) {
    const p = chance(DREX, g, 1300, false);
    assert.ok(p >= prev - 1e-9, `dropped at gpa=${g}`);
    prev = p;
    last = p;
  }
  // Strict overall rise — catches a "GPA does nothing / returns a constant" regression.
  assert.ok(last > first + 0.05, `GPA had no real effect: ${first} -> ${last}`);
});

test('test-optional drops the SAT track (SAT stops mattering)', () => {
  const withSat = chance(DREX, 3.6, 1600, false);
  const toHigh = chance(DREX, 3.6, 1600, true);
  const toLow = chance(DREX, 3.6, 400, true);
  assert.equal(toHigh, toLow, 'test-optional must ignore SAT entirely');
  assert.notEqual(withSat, toHigh, 'a high SAT should change the non-TO result');
});

test('band thresholds are exact at the boundaries', () => {
  assert.equal(band(0.75), 'Safety');
  assert.equal(band(0.7499), 'Likely');
  assert.equal(band(0.55), 'Likely');
  assert.equal(band(0.5499), 'Target');
  assert.equal(band(0.30), 'Target');
  assert.equal(band(0.2999), 'Reach');
});

test('band colors are the frozen palette', () => {
  assert.deepEqual(BANDCOL, { Safety: '#00ff88', Likely: '#00d4ff', Target: '#f5a623', Reach: '#a855f7' });
});

test('flipDelta returns null once already Safety', () => {
  // Strong profile at high-admit Drexel -> Safety.
  const p = chance(DREX, 4.0, 1500, false);
  assert.equal(band(p), 'Safety');
  assert.equal(flipDelta(DREX, 4.0, 1500, false), null);
});

test('flipDelta gives an honest ceiling when even perfect cannot flip the band', () => {
  // admit 0.05 -> max ~0.0855, always Reach. Coach must admit the ceiling, not promise a flip.
  const r = flipDelta(REACH, 3.95, 1550, false);
  assert.ok(r && /ceiling/.test(r.txt), 'must state the admit-rate ceiling');
  assert.equal(r.b, 'Reach');
});

test('flipDelta names a concrete delta when a flip IS reachable', () => {
  // Mid profile at Drexel -> should be flippable with a stated GPA/SAT bump.
  const r = flipDelta(DREX, 3.3, 1250, false);
  assert.ok(r, 'expected a delta object');
  assert.ok(/GPA|SAT/.test(r.txt), `expected a concrete delta, got: ${r.txt}`);
  assert.ok(r.nextB, 'must name the next band');
});

test('fit computes the exact weighted average for a known profile', () => {
  // DREX: premed=7; cost = clamp(10 - ((86353-23607)-15000)/6500) = 2.6545.
  // avg(7, 2.6545) = 4.827 -> round(*10) = 48. Exact value catches a weighting regression.
  assert.equal(fit(DREX, ['premed', 'cost']), 48);
  assert.ok(fit(DREX, []) >= 0 && fit(DREX, []) <= 100, 'default-priority fit stays in 0-100');
});
