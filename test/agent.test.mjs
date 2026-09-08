// Real tests for the agent spine + the grounding guard. Over the actual corpus. No mocks of data.
// The "model" seam is exercised with scripted stand-ins (honest + lying) to prove the guard.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { loadSchools, getSchool } from '../core/data.mjs';
import { createAgent, deterministicRoute, composeText, renderCards, groundingGuard } from '../core/agent.mjs';

const DATA_DIR = fileURLToPath(new URL('../data/schools', import.meta.url));
const schools = loadSchools(DATA_DIR);
const drex = getSchool(schools, 'drex');
const brown = getSchool(schools, 'brown');

// violation-set helper (violations are typed {kind, value})
const hasV = (vs, kind, value) => vs.some(v => v.kind === kind && (value === undefined || Math.abs(v.value - value) < 0.001));

test('deterministicRoute maps intent to the right tools', () => {
  assert.deepEqual(deterministicRoute('what are my chances?').tools, ['chance', 'whatFlipsIt']);
  assert.deepEqual(deterministicRoute('how much does it cost').tools, ['cost']);
  assert.deepEqual(deterministicRoute('will I actually finish / wash out').tools, ['attrition', 'whatFlipsIt']);
  assert.deepEqual(deterministicRoute('do I qualify / meet the minimum').tools, ['eligibility']);
  assert.deepEqual(deterministicRoute('what is the program admit rate').tools, ['programOdds']);
});

test('composeText for a real school is grounded by construction (guard passes)', () => {
  const cards = renderCards(['chance', 'whatFlipsIt', 'cost', 'eligibility', 'programOdds', 'attrition'], drex, { gpa: 3.3, sat: 1250 });
  const text = composeText(cards);
  const guard = groundingGuard(text, cards, { gpa: 3.3, sat: 1250 });
  assert.ok(guard.ok, `template text should be fully grounded, violations: ${guard.violations}`);
  assert.ok(text.length > 0);
});

test('groundingGuard CATCHES a fabricated percentage and dollar amount', () => {
  const cards = renderCards(['chance', 'cost'], drex, { gpa: 3.3, sat: 1250 });
  const lie = 'Honestly you have an 88% chance and it only costs $1,234 a year.';
  const guard = groundingGuard(lie, cards, { gpa: 3.3, sat: 1250 });
  assert.equal(guard.ok, false);
  assert.ok(hasV(guard.violations, 'pct', 88), 'must flag the fabricated 88%');
  assert.ok(hasV(guard.violations, 'usd', 1234), 'must flag the fabricated $1,234');
});

test('guard is UNIT-AWARE: a cost number cannot launder as a percentage', () => {
  // 62746 is Drexel annual net cost. Restated as a chance %, it must NOT pass.
  const cards = renderCards(['cost'], drex, {});
  const g = groundingGuard('You have a 62746% chance — a lock.', cards, {});
  assert.equal(g.ok, false);
  assert.ok(hasV(g.violations, 'pct', 62746), 'cost value laundered as % must be caught');
});

test('guard catches WORD-FORM percentages, digit ratios, and certainty phrases', () => {
  const cards = renderCards(['chance', 'whatFlipsIt'], drex, { gpa: 3.3, sat: 1250 });
  assert.equal(groundingGuard('roughly 88 percent chance', cards, {}).ok, false); // word-form %
  assert.equal(groundingGuard('9 out of 10 kids like you get in', cards, {}).ok, false); // ratio -> 90%
  assert.equal(groundingGuard('honestly, a 70 chance here', cards, {}).ok, false); // bare-int % near "chance"
  assert.equal(groundingGuard('your odds are around 85', cards, {}).ok, false); // bare-int % near "odds"
  const cert = groundingGuard('You are a near-certain admit here.', cards, {});
  assert.equal(cert.ok, false);
  assert.ok(hasV(cert.violations, 'certainty'), 'qualitative overstatement must be caught');
});

test('agent (no model): deterministic, grounded, returns cards + text', () => {
  const agent = createAgent();
  const res = agent.handle('what are my chances at Drexel?', { school: drex, profile: { gpa: 3.3, sat: 1250 } });
  assert.equal(res.grounded, true);
  assert.ok(res.cards.length >= 1);
  assert.ok(res.tools.includes('chance'));
  assert.ok(/Reach|Target|Likely|Safety/.test(res.text));
});

test('agent ENFORCES the guard: a lying model is replaced by the grounded template', () => {
  const lyingModel = { compose: () => 'Trust me, 88% chance, basically a lock.' };
  const agent = createAgent(lyingModel);
  const res = agent.handle('my chances?', { school: drex, profile: { gpa: 3.3, sat: 1250 } });
  assert.equal(res.grounded, false, 'must mark the model output ungrounded');
  assert.ok(hasV(res.violations, 'pct', 88));
  assert.ok(!/88%/.test(res.text), 'the fabricated number must NOT reach the user');
});

test('agent TRUSTS a model that stays grounded', () => {
  // Honest model: restates only a real tool number.
  const honestModel = { compose: (_msg, cards) => `Your published admit rate here is ${cards[0].value}%.` };
  const agent = createAgent(honestModel);
  const res = agent.handle('chances?', { school: drex, profile: {} }); // no profile -> chance card value = base admit 79
  assert.equal(res.grounded, true);
  assert.ok(/79/.test(res.text), 'grounded model prose is used verbatim');
});

test('agent asks for a school when none is in context (no fabricated numbers)', () => {
  const res = createAgent().handle('what are my odds?', { profile: { gpa: 3.9 } });
  assert.equal(res.needsSchool, true);
  assert.equal(res.grounded, true);
  assert.equal(res.cards.length, 0);
});

test('agent never throws and stays grounded across the WHOLE corpus', () => {
  const agent = createAgent();
  for (const s of schools) {
    const res = agent.handle('what are my chances and cost?', { school: s, profile: { gpa: 3.7, sat: 1350 } });
    assert.ok(res && typeof res.text === 'string', `${s.id}: bad result`);
    assert.equal(res.grounded, true, `${s.id}: template path must be grounded`);
  }
});
