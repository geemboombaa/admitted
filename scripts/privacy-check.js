// Privacy hard gate: the deployed/public copy must never contain the applicant's or parent's real
// name. Run before any deploy. Exit 1 (block) if a real name appears. Default target: index.html.
//   node scripts/privacy-check.js [file]
const fs = require('fs');
const file = process.argv[2] || 'index.html';
const NAMES = [/hrithik/i, /prans/i];
if (!fs.existsSync(file)) { console.error('privacy-check: ' + file + ' not found'); process.exit(1); }
const txt = fs.readFileSync(file, 'utf8');
const hits = NAMES.filter(re => re.test(txt)).map(re => re.source);
if (hits.length) { console.error('privacy-check FAILED: real name(s) in ' + file + ': ' + hits.join(', ')); process.exit(1); }
console.log('privacy-check PASSED (' + file + ': 0 real names)');
