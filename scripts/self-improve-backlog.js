// Tiny helper for SELF-IMPROVE-BACKLOG.md — no deps, deliberately dumb.
// `node scripts/self-improve-backlog.js next`        -> prints the next unchecked item's text, exits 1 if none
// `node scripts/self-improve-backlog.js done "text"` -> flips that exact "- [ ] text" line to "- [x] text"
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', 'SELF-IMPROVE-BACKLOG.md');

function readLines() { return fs.readFileSync(FILE, 'utf8').split('\n'); }

const cmd = process.argv[2];
if (cmd === 'next') {
  const line = readLines().find(l => l.startsWith('- [ ] '));
  if (!line) { process.exit(1); }
  process.stdout.write(line.slice('- [ ] '.length));
} else if (cmd === 'done') {
  const text = process.argv[3];
  if (!text) { console.error('usage: done "<exact item text>"'); process.exit(2); }
  const target = '- [ ] ' + text;
  const lines = readLines();
  const idx = lines.indexOf(target);
  if (idx === -1) { console.error('item not found (exact text match required):', target); process.exit(3); }
  lines[idx] = '- [x] ' + text;
  fs.writeFileSync(FILE, lines.join('\n'));
  console.log('marked done:', text);
} else {
  console.error('usage: next | done "<text>"');
  process.exit(2);
}
