// Lightweight validator (no external deps — device network access can't be
// assumed). Checks structural + referential integrity across data/schools.
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const dir = path.join(ROOT, 'data/schools');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json') && !f.startsWith('_'));

let errors = [];
const seenIds = new Set();

for (const f of files) {
  const idFromFile = f.replace(/\.json$/, '');
  let doc;
  try { doc = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); }
  catch (e) { errors.push(`${f}: invalid JSON — ${e.message}`); continue; }

  if (doc.id !== idFromFile) errors.push(`${f}: id "${doc.id}" does not match filename`);
  if (seenIds.has(doc.id)) errors.push(`${f}: duplicate id "${doc.id}"`);
  seenIds.add(doc.id);

  if (!doc.general) { errors.push(`${f}: missing "general" block`); continue; }
  for (const req of ['n', 'city', 'st', 'type', 'coa', 'admit', 'g25', 'g75']) {
    if (doc.general[req] === undefined) errors.push(`${f}: general.${req} missing`);
  }

  if (doc.programVerified) {
    const pv = doc.programVerified;
    const hasNumeric = ['minGpa','minSat','avgGpa','avgSat','admitRatePct'].some(k => pv[k] != null);
    if (hasNumeric && !pv.src && !pv.discontinued) {
      errors.push(`${f}: programVerified has numeric data but no "src" — no-fabrication rule requires a source URL for every published number`);
    }
  }
  if (doc.program && doc.program.pid && doc.programVerified === null && !doc.program.bar === undefined) {
    // informational only, not an error: programs can legitimately have no verified stats yet
  }
}

console.log(`Checked ${files.length} school files.`);
if (errors.length) {
  console.log(`FAILED — ${errors.length} issue(s):`);
  errors.forEach(e => console.log(' -', e));
  process.exit(1);
} else {
  console.log('PASSED — no structural or referential issues found.');
}
