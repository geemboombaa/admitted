// Improvement metric: parse RUBRIC.md checkboxes -> MET/total score.
// [x]=met, [ ]=unmet, [~]=blocked (excluded from denominator). This is the number every
// build run must move up. Used by stop-gate.sh (no-regression gate) and record-metrics.js.
//   node scripts/rubric-score.js         -> human line
//   node scripts/rubric-score.js --json  -> {met,unmet,blocked,total,pct}
const fs = require('fs');
const f = process.argv.includes('--file') ? process.argv[process.argv.indexOf('--file') + 1] : 'RUBRIC.md';
const txt = fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : '';
let met = 0, unmet = 0, blocked = 0;
for (const line of txt.split('\n')) {
  // accept numbered (1. / 6a.) OR bullet (- / *) list items; case-insensitive [x]/[X]
  const m = line.match(/^\s*(?:\d+[a-z]?\.|[-*])\s*\[([ xX~])\]/);
  if (!m) continue;
  const c = m[1].toLowerCase();
  if (c === 'x') met++; else if (c === '~') blocked++; else unmet++;
}
const total = met + unmet;                       // blocked not counted (can't close now)
const pct = total ? Math.round((met / total) * 100) : 0;
if (process.argv.includes('--json')) {
  process.stdout.write(JSON.stringify({ met, unmet, blocked, total, pct }));
} else {
  console.log(`RUBRIC: ${met}/${total} MET (${pct}%) · ${blocked} blocked-on-data`);
}
