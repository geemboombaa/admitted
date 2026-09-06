// Checkpoint data-quality report — objective, computed from repo state (no opinions, no web).
// Data quality = share of schools that are BOTH verified AND have no open gap flagged against them.
// Run at every checkpoint: node scripts/checkpoint-report.js
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const dir = path.join(ROOT, 'data/schools');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json') && !f.startsWith('_'));

// School ids named in still-open GAPS.md items ("- [ ] ... <id> ...").
const gaps = fs.existsSync(path.join(ROOT, 'GAPS.md')) ? fs.readFileSync(path.join(ROOT, 'GAPS.md'), 'utf8') : '';
const openGapLines = gaps.split('\n').filter(l => l.trimStart().startsWith('- [ ]'));
const ids = files.map(f => f.replace('.json', ''));
const flagged = new Set();
for (const line of openGapLines) for (const id of ids) {
  // match id as a whole word (e.g. "osu", "howard") to avoid substrings
  if (new RegExp(`\\b${id}\\b`).test(line)) flagged.add(id);
}

let verified = 0, nullVf = 0, clean = 0;
for (const f of files) {
  const d = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  const id = d.id;
  const isVerified = d.verifiedFacts && typeof d.verifiedFacts === 'object';
  if (isVerified) verified++; else nullVf++;
  if (isVerified && !flagged.has(id)) clean++;
}

const N = files.length;
const pct = n => (100 * n / N).toFixed(1);
const dq = (10 * clean / N).toFixed(1); // data-quality score /10 = fully-clean share

console.log('=== DATA QUALITY (computed) ===');
console.log(`schools:              ${N}`);
console.log(`verifiedFacts set:    ${verified} (${pct(verified)}%)`);
console.log(`verifiedFacts null:   ${nullVf}`);
console.log(`open gaps flagged:    ${flagged.size} schools -> ${[...flagged].sort().join(' ')}`);
console.log(`fully clean (verified & no open gap): ${clean} (${pct(clean)}%)`);
console.log(`DATA-QUALITY SCORE:   ${dq}/10   (= fully-clean share)`);
