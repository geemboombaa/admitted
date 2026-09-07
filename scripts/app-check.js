// Objective gate for the app-improve loop: app.html must stay linked to app-data.js,
// be non-trivial, and its inline JS must parse (catches builder syntax breakage headlessly).
const fs = require('fs'), cp = require('child_process');
const h = fs.readFileSync('app.html', 'utf8');
const err = [];
if (!/src=["']app-data\.js["']/.test(h)) err.push('app.html no longer links app-data.js');
if (h.length < 8000) err.push('app.html suspiciously small (' + h.length + ' bytes)');
// inline <script> blocks have no attributes; the app-data include has src=, so it is skipped
const blocks = [...h.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
if (!blocks.length) err.push('no inline <script> found');
blocks.forEach((code, i) => {
  const tmp = '.scratch_appcheck_' + i + '.js';
  fs.writeFileSync(tmp, 'const window={SCHOOLS:[]},document={},localStorage={getItem(){},setItem(){}},navigator={};\n' + code);
  try { cp.execSync('node --check ' + tmp, { stdio: 'pipe' }); }
  catch (e) { err.push('inline script #' + i + ' syntax error: ' + String(e.stderr || e.message).split('\n')[0]); }
  fs.unlinkSync(tmp);
});
if (err.length) { console.log('app-check FAILED:'); err.forEach(e => console.log(' -', e)); process.exit(1); }
console.log('app-check PASSED');
