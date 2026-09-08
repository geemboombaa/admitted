// Real tests for the grounded tool layer, over the actual data/schools/*.json corpus. No mocks.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { loadSchools, getSchool } from '../core/data.mjs';
import { chanceTool, costTool, eligibilityTool, programOddsTool, attritionTool, whatFlipsItTool } from '../core/tools.mjs';

const DATA_DIR = fileURLToPath(new URL('../data/schools', import.meta.url));
const schools = loadSchools(DATA_DIR);
const drex = getSchool(schools, 'drex');
const brown = getSchool(schools, 'brown');
const hof = getSchool(schools, 'hof');
const noProg = schools.find(s => !s.program);

test('chanceTool with no profile returns the published admit rate, not a personalized number', () => {
  const r = chanceTool(drex, {});
  assert.equal(r.personalized, false);
  assert.equal(r.value, 79);            // verified admit 0.794 -> 79
  assert.equal(r.badge, 'verified');    // admit is a verified fact for Drexel
  assert.match(r.note, /not a personalized chance/);
});

test('chanceTool with a profile is ESTIMATED, with a band + heuristic range', () => {
  const r = chanceTool(drex, { gpa: 3.2, sat: 1250 });
  assert.equal(r.personalized, true);
  assert.equal(r.badge, 'estimated');   // personalized chance is never "verified"
  assert.ok(['Reach', 'Target', 'Likely', 'Safety'].includes(r.band));
  assert.deepEqual(r.range, { Reach: [2, 30], Target: [30, 55], Likely: [55, 75], Safety: [75, 96] }[r.band]);
  assert.equal(r.baseAdmitBadge, 'verified');
});

test('costTool: 4-yr net from verified inputs + raw affiliated med cost (never multiplied)', () => {
  const r = costTool(drex);
  assert.equal(r.annualNet, 86353 - 23607);      // verified coa - verified merit
  assert.equal(r.fourYearNet, (86353 - 23607) * 4);
  assert.equal(r.inputsVerified, true);
  assert.equal(r.badge, 'estimated');            // the x4 is a simplification
  assert.ok(r.bsmd && r.bsmd.medCost === 95000, 'raw affiliated med cost surfaced');
  assert.match(r.bsmd.note, /do NOT multiply/);
});

test('eligibilityTool: Below vs Meets minimum off the structured bar', () => {
  assert.equal(eligibilityTool(drex, { gpa: 3.0, sat: 1200 }).status, 'Below minimum'); // bar 3.5/1420
  const meets = eligibilityTool(drex, { gpa: 3.9, sat: 1500 });
  assert.equal(meets.status, 'Meets minimum');
  assert.match(meets.note, /minimum ≠ competitive/);   // honesty: clearing min isn't being competitive
});

test('eligibilityTool: no bar / no program -> honest not-applicable', () => {
  const b = eligibilityTool(brown, { gpa: 3.9, sat: 1500 }); // Brown PLME publishes no min
  assert.equal(b.applicable, false);
  assert.equal(b.status, 'no-published-gate');
  assert.match(eligibilityTool(noProg, { gpa: 3.9 }).note, /No BS\/MD program/);
});

test('programOddsTool: reports the rate + raw counts, badge "reported" (never "verified")', () => {
  const r = programOddsTool(drex);
  assert.equal(r.published, true);
  assert.equal(r.value, 2.7);
  assert.equal(r.admitCount, 66);
  assert.equal(r.applicantCount, 2406);
  assert.equal(r.badge, 'reported');   // provenance varies; we do not elevate to "verified"
  assert.ok(r.source);
  // Hofstra's rate is derived, Brown's is newspaper — both must ALSO be 'reported', not 'verified'.
  assert.equal(programOddsTool(hof).badge, 'reported');
  assert.equal(programOddsTool(brown).badge, 'reported');
});

test('programOddsTool: no-program school -> published:false, no invented rate', () => {
  const r = programOddsTool(noProg);
  assert.equal(r.published, false);
  assert.equal(r.value, undefined);
});

test('attritionTool: honestly unpublished, surfaces undergrad grad rate as a DISTINCT signal', () => {
  const r = attritionTool(drex);
  assert.equal(r.published, false);
  assert.equal(r.badge, 'unpublished');
  assert.equal(r.grad4, 52);
  assert.match(r.grad4Note, /NOT BS\/MD program retention/);
});

test('whatFlipsItTool: safety / flippable / honest ceiling', () => {
  assert.equal(whatFlipsItTool(drex, { gpa: 4.0, sat: 1500 }).status, 'safety');
  const flip = whatFlipsItTool(drex, { gpa: 3.3, sat: 1250 });
  assert.ok(['flippable', 'ceiling'].includes(flip.status));
  // Brown admit 0.05 -> even a perfect profile can't clear Reach -> ceiling.
  assert.equal(whatFlipsItTool(brown, { gpa: 3.99, sat: 1560 }).status, 'ceiling');
});

test('whatFlipsItTool needs a profile', () => {
  assert.equal(whatFlipsItTool(drex, {}).status, 'need-profile');
});

test('no tool throws and no tool fabricates across the WHOLE corpus', () => {
  const profile = { gpa: 3.7, sat: 1350 };
  for (const s of schools) {
    for (const fn of [chanceTool, costTool, eligibilityTool, whatFlipsItTool]) {
      const r = fn(s, profile);
      assert.ok(r && typeof r === 'object', `${s.id}: ${fn.name} returned non-object`);
      if (r.value != null && typeof r.value === 'number') assert.ok(Number.isFinite(r.value), `${s.id}: ${fn.name} non-finite value`);
    }
    // Lock the badges corpus-wide (catches a regression that "verifies" an estimate or multiplies med cost).
    const c = costTool(s);
    if (c.ok) {
      assert.equal(c.badge, 'estimated', `${s.id}: cost must stay estimated`);
      if (c.bsmd) assert.equal(c.bsmd.medCost, s.affiliatedMedCost, `${s.id}: med cost must be the raw value, never multiplied`);
    }
    const ch = chanceTool(s, profile);
    if (ch.personalized) assert.equal(ch.badge, 'estimated', `${s.id}: a personalized chance must never be "verified"`);
    const po = programOddsTool(s);
    // programOdds may ONLY claim published when a real admitRatePct exists, and never badges "verified".
    if (po.published) {
      assert.ok(s.programVerified && s.programVerified.admitRatePct != null, `${s.id}: programOdds claimed published without data`);
      assert.notEqual(po.badge, 'verified', `${s.id}: program rate provenance varies — never "verified"`);
    }
    const at = attritionTool(s);
    assert.equal(at.published, false, `${s.id}: attrition must never claim published (no data)`);
  }
});
