// Real unit tests for the shipped decision engine (chance/band) — extracted from app.html and run
// against the REAL 101-school dataset (no fabricated inputs; pure-function tests only). Asserts the
// invariants trust depends on: output clamped, monotonic in GPA, bands map to the fixed thresholds.
// Wired into stop-gate.sh. Exit 0 = pass, 1 = fail.
const fs = require('fs');
const html = fs.readFileSync('app.html', 'utf8');
const dataSrc = fs.readFileSync('app-data.js', 'utf8');

// load the real schools (app-data.js does window.SCHOOLS = [...])
const window = {};
new Function('window', dataSrc)(window);
const SCHOOLS = window.SCHOOLS || [];

// extract the actual shipped functions from app.html (so we test the real code, not a copy)
const chanceSrc = (html.match(/function chance\(s,gpa,sat,to\)\{[\s\S]*?\n\}/) || [])[0];
const bandSrc = (html.match(/function band\(p\)\{[^}]*\}/) || [])[0];
if (!chanceSrc || !bandSrc) { console.error('test-engine: could not extract chance()/band() from app.html'); process.exit(1); }
const chance = new Function('return (' + chanceSrc + ')')();
const band = new Function('return (' + bandSrc + ')')();

const fails = [];
const ok = (c, m) => { if (!c) fails.push(m); };

// 1. bands map to the fixed thresholds (SPEC/RUBRIC #5)
ok(band(0.75) === 'Safety', 'band(.75) should be Safety');
ok(band(0.74) === 'Likely', 'band(.74) should be Likely');
ok(band(0.55) === 'Likely', 'band(.55) should be Likely');
ok(band(0.54) === 'Target', 'band(.54) should be Target');
ok(band(0.30) === 'Target', 'band(.30) should be Target');
ok(band(0.29) === 'Reach', 'band(.29) should be Reach');

// 2. per-school invariants against real data
ok(SCHOOLS.length > 50, 'expected >50 real schools, got ' + SCHOOLS.length);
let checked = 0;
for (const s of SCHOOLS) {
  if (typeof s.admit !== 'number' || typeof s.g25 !== 'number' || typeof s.g75 !== 'number') continue;
  checked++;
  const low = chance(s, 2.0, 1000, false);
  const high = chance(s, 4.0, 1600, false);
  ok(low >= 0.02 && low <= 0.96, `${s.id||s.name}: low chance out of clamp (${low})`);
  ok(high >= 0.02 && high <= 0.96, `${s.id||s.name}: high chance out of clamp (${high})`);
  ok(high >= low, `${s.id||s.name}: chance not monotonic in GPA/SAT (${low} -> ${high})`);
}
ok(checked > 50, 'expected >50 schools with numeric bands, checked ' + checked);

if (fails.length) { console.error('test-engine FAILED:'); fails.slice(0, 10).forEach(f => console.error(' -', f)); process.exit(1); }
console.log(`test-engine PASSED (${checked} real schools, clamp+monotonic+bands)`);
