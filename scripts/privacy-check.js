// Privacy hard gate: no shipped/public HTML may contain the applicant's or parent's real name.
// Scans the files given as args, else ALL index*.html in the repo root (the deployable copies).
// Fail-closed: exit 1 if a name is found OR if there is nothing to verify. Run before any deploy.
//   node scripts/privacy-check.js [file ...]
const fs = require('fs');
const NAMES = [/hrithik/i, /prans/i];
let files = process.argv.slice(2);
if (!files.length) files = fs.readdirSync('.').filter(f => /^index.*\.html$/i.test(f));
if (!files.length) { console.error('privacy-check FAILED: no index*.html to verify (fail-closed)'); process.exit(1); }
const bad = [];
for (const f of files) {
  if (!fs.existsSync(f)) { bad.push(f + ' (missing)'); continue; }
  const txt = fs.readFileSync(f, 'utf8');
  const hits = NAMES.filter(re => re.test(txt)).map(re => re.source);
  if (hits.length) bad.push(f + ': ' + hits.join(', '));
}
if (bad.length) { console.error('privacy-check FAILED: ' + bad.join(' | ')); process.exit(1); }
console.log('privacy-check PASSED (' + files.join(', ') + ': 0 real names)');
