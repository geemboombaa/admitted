// Phase state machine for the whole run: requirements -> design -> build -> prototype -> ship.
// Enforces the thing that was missing: a gate at EVERY phase, not just data/app.
// A phase can only be advanced after its checkpoint is user-approved; each phase has an
// artifact invariant the Stop hook verifies every turn.
//   node scripts/phase.js get                 -> current phase
//   node scripts/phase.js set <phase>         -> force-set (rarely; prefer next)
//   node scripts/phase.js approve             -> mark current phase's checkpoint approved
//   node scripts/phase.js next                -> advance (only if current phase approved)
//   node scripts/phase.js gate                -> verify current phase invariant; exit 0 ok / 1 fail
const fs = require('fs'), cp = require('child_process');
const F = '.phase.json';
const ORDER = ['requirements', 'design', 'build', 'prototype', 'ship'];
const load = () => fs.existsSync(F) ? JSON.parse(fs.readFileSync(F, 'utf8')) : { phase: 'requirements', approved: [] };
const save = s => fs.writeFileSync(F, JSON.stringify(s, null, 2) + '\n');
const tracked = f => { try { cp.execSync('git ls-files --error-unmatch ' + f, { stdio: 'ignore' }); return true; } catch { return false; } };

// invariant that must hold WHILE in each phase (checked by the Stop hook every turn)
function invariant(phase) {
  const bad = [];
  const need = f => { if (!fs.existsSync(f)) bad.push('missing ' + f); else if (!tracked(f)) bad.push(f + ' not committed (a reset/clean would wipe it)'); };
  if (['requirements', 'design', 'build', 'prototype', 'ship'].includes(phase)) { need('SPEC.md'); need('RUBRIC.md'); }
  if (phase === 'prototype' || phase === 'ship') need('PROTOTYPE-REPORT.md');
  return bad;
}

const s = load(), cmd = process.argv[2], arg = process.argv[3];
if (cmd === 'get') { console.log(s.phase); }
else if (cmd === 'set') { if (!ORDER.includes(arg)) { console.error('unknown phase ' + arg); process.exit(1); } s.phase = arg; save(s); console.log('phase=' + arg); }
else if (cmd === 'approve') { if (!s.approved.includes(s.phase)) s.approved.push(s.phase); save(s); console.log('approved checkpoint: ' + s.phase); }
else if (cmd === 'next') {
  if (!s.approved.includes(s.phase)) { console.error('BLOCKED: "' + s.phase + '" checkpoint not approved yet. Run the checkpoint, get user go, then: node scripts/phase.js approve'); process.exit(1); }
  const i = ORDER.indexOf(s.phase);
  if (i >= ORDER.length - 1) { console.log('already at final phase'); process.exit(0); }
  s.phase = ORDER[i + 1]; save(s); console.log('advanced -> ' + s.phase);
}
else if (cmd === 'gate') {
  const bad = invariant(s.phase);
  if (bad.length) { console.error('PHASE-GATE FAIL (' + s.phase + '):'); bad.forEach(b => console.error(' - ' + b)); process.exit(1); }
  console.log('phase-gate OK (' + s.phase + ')'); process.exit(0);
}
else { console.error('usage: phase.js get|set <p>|approve|next|gate'); process.exit(1); }
