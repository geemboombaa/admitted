// Real tests for the pure render layer. Cards come from the real tools over the real corpus.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { loadSchools, getSchool } from '../core/data.mjs';
import { chanceTool, costTool, eligibilityTool, programOddsTool, attritionTool, whatFlipsItTool } from '../core/tools.mjs';
import { renderCard, renderCards, esc, badge } from '../web/render.mjs';

const DATA_DIR = fileURLToPath(new URL('../data/schools', import.meta.url));
const schools = loadSchools(DATA_DIR);
const drex = getSchool(schools, 'drex');

test('esc escapes HTML metacharacters', () => {
  assert.equal(esc('<script>&"'), '&lt;script&gt;&amp;&quot;');
});

test('chance card (personalized) shows band, range, and an EST badge', () => {
  const html = renderCard(chanceTool(drex, { gpa: 3.3, sat: 1250 }));
  assert.match(html, /Reach|Target|Likely|Safety/);
  assert.match(html, /EST/);
  assert.match(html, /Overall admit rate: 79%/); // grounded base admit
});

test('cost card shows verified-input net cost and raw med cost (formatted, grounded)', () => {
  const html = renderCard(costTool(drex));
  assert.match(html, /\$62,746/);   // annual net from verified inputs
  assert.match(html, /\$250,984/);  // x4
  assert.match(html, /\$95,000/);   // raw affiliated med cost, not multiplied
});

test('eligibility card shows Meets/Below against the published bar', () => {
  assert.match(renderCard(eligibilityTool(drex, { gpa: 3.0, sat: 1200 })), /Below minimum/);
  const meets = renderCard(eligibilityTool(drex, { gpa: 3.9, sat: 1500 }));
  assert.match(meets, /Meets minimum/);
  // Drexel's bar is a WEIGHTED 3.5 — the label must say so (honesty: not like-for-like with unweighted input).
  assert.match(meets, /3\.5 weighted GPA \/ 1420 SAT/);
  assert.match(meets, /WEIGHTED GPA; your entered GPA is unweighted/);
});

test('renderCard escapes malicious card text (no HTML injection)', () => {
  const evil = { tool: 'attrition', ok: true, published: false, note: '<img src=x onerror=alert(1)>', grad4: null };
  const html = renderCard(evil);
  assert.ok(!/<img/.test(html), 'raw tag must be escaped');
  assert.match(html, /&lt;img/);
});

test('program odds card shows the reported rate + raw counts', () => {
  const html = renderCard(programOddsTool(drex));
  assert.match(html, /2\.7%/);
  assert.match(html, /66 of 2406/);
  assert.match(html, /REPORTED/);
});

test('attrition card is NOT PUBLISHED and folds the what-flips-it locus companion (#15)', () => {
  const cards = [attritionTool(drex), whatFlipsItTool(drex, { gpa: 3.3, sat: 1250 })];
  const html = renderCards(cards);
  assert.match(html, /NOT PUBLISHED/);
  assert.match(html, /NOT BS\/MD program retention/);
  assert.match(html, /What's in your control/); // locus pairing present
  // whatFlipsIt must NOT also appear as a standalone card (folded in).
  assert.equal((html.match(/class="card flip/g) || []).length, 0);
});

test('badge renders a source tooltip when a source is present', () => {
  const b = badge('reported', 'https://example.edu/cds');
  assert.match(b, /title="https:\/\/example.edu\/cds"/);
  assert.match(b, /REPORTED/);
});

test('renderCards never throws across the whole corpus', () => {
  for (const s of schools) {
    const cards = [chanceTool(s, { gpa: 3.7, sat: 1350 }), costTool(s), eligibilityTool(s, { gpa: 3.7, sat: 1350 }), programOddsTool(s), attritionTool(s), whatFlipsItTool(s, { gpa: 3.7, sat: 1350 })];
    const html = renderCards(cards);
    assert.ok(typeof html === 'string' && html.length > 0, `${s.id}: empty render`);
  }
});
