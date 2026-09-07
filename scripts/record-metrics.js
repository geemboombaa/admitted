// Append one line to METRICS.md capturing rubric progress + delta vs the last run.
// This is the "did this run improve?" record. stop-gate reads it to block regressions.
//   node scripts/record-metrics.js
const fs = require('fs'), cp = require('child_process');
const j = JSON.parse(cp.execSync('node scripts/rubric-score.js --json').toString());
let phase = '?'; try { phase = cp.execSync('node scripts/phase.js get').toString().trim(); } catch {}
let last = null;
if (fs.existsSync('METRICS.md')) {
  const lines = fs.readFileSync('METRICS.md', 'utf8').trim().split('\n').filter(l => /rubric=/.test(l));
  if (lines.length) { const m = lines[lines.length - 1].match(/rubric=(\d+)\//); if (m) last = +m[1]; }
}
const delta = last == null ? j.met : j.met - last;
const sign = delta > 0 ? '+' + delta : '' + delta;
const stamp = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
const line = `[${stamp}] phase=${phase} rubric=${j.met}/${j.total} (${sign}) blocked=${j.blocked} pct=${j.pct}%`;
if (!fs.existsSync('METRICS.md')) fs.writeFileSync('METRICS.md', '# METRICS — rubric progress per run (append-only, monotonic target)\n\n');
fs.appendFileSync('METRICS.md', line + '\n');
console.log(line);
