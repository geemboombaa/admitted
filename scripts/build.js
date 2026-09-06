// Rebuilds the const-literal blocks in index.html from data/schools/*.json +
// data/shared/app-config.json. Writes to a SEPARATE file (index.generated.html)
// by default so the live app is never overwritten by an unverified build —
// pass --out=index.html explicitly (and re-run the full test suite after)
// once a build has been diff/behavior-verified. index.html is the file Vercel serves.
const fs = require('fs');
const path = require('path');
const { extractScriptBlock, grabConst } = require('./_extract-lib');

const ROOT = path.join(__dirname, '..');
const outArg = (process.argv.find(a => a.startsWith('--out=')) || '').slice(6);
const OUT = outArg || 'index.generated.html';

const dir = path.join(ROOT, 'data/schools');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json') && !f.startsWith('_'));
const docs = files.map(f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
docs.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
const shared = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/shared/app-config.json'), 'utf8'));

const SCHOOLS = docs.map(d => d.general);
const VERD = {}, SOCIAL = {}, RACCESS = {}, PATHTYPE = {}, RESTRICT = {}, APPINFO = {},
  PROGRATE = {}, CLINICAL = {}, PATHNAME = {}, INSTATE_REF = {}, TUIT = {}, CDS7 = {},
  UGYRS = {}, MEDCOST = {}, MEDNAME = {};
const RELIG = [], YPArr = [];
const PATHWAYS = [...shared.standalonePathways];
const PROGVERIFIED = {};
const ACCEL = [];

for (const d of docs) {
  const id = d.id;
  if (d.verifiedFacts) VERD[id] = d.verifiedFacts;
  if (d.social != null) SOCIAL[id] = d.social;
  if (d.religAffiliated) RELIG.push(id);
  if (d.researchAccess != null) RACCESS[id] = d.researchAccess;
  if (d.pathType) PATHTYPE[id] = d.pathType;
  if (d.restrictNote) RESTRICT[id] = d.restrictNote;
  if (d.appInfo) APPINFO[id] = d.appInfo;
  if (d.progRateLegacy) PROGRATE[id] = d.progRateLegacy;
  if (d.clinicalAccess != null) CLINICAL[id] = d.clinicalAccess;
  if (d.pathNameLegacy) PATHNAME[id] = d.pathNameLegacy;
  if (d.instateRef != null) INSTATE_REF[id] = d.instateRef;
  if (d.tuition != null) TUIT[id] = d.tuition;
  if (d.cds7) CDS7[id] = d.cds7;
  if (d.accel) ACCEL.push(d.accel);
  if (d.ugYearsOverride != null) UGYRS[id] = d.ugYearsOverride;
  if (d.affiliatedMedCost != null) MEDCOST[id] = d.affiliatedMedCost;
  if (d.affiliatedMedName) MEDNAME[id] = d.affiliatedMedName;
  if (d.yieldProtection) YPArr.push(id);
  if (d.program) PATHWAYS.push(d.program);
  if (d.programVerified && d.program && d.program.pid) PROGVERIFIED[d.program.pid] = d.programVerified;
}

function lit(name, value, asSet) {
  if (asSet) return `const ${name}=new Set(${JSON.stringify(Array.from(value))});`;
  return `const ${name}=${JSON.stringify(value)};`;
}

if (shared.orphanAccel) ACCEL.push(...shared.orphanAccel);
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const src = extractScriptBlock(html);
let newSrc = src;

function replaceConst(name, replacementStatement) {
  const marker = `const ${name}=`;
  const r = grabConst(newSrc, name);
  if (!r) throw new Error('cannot find const ' + name + ' to replace');
  const at = newSrc.indexOf(marker);
  const before = newSrc.slice(0, at);
  const afterIdx = at + marker.length + r.literal.length; // position right after literal, before ';'
  const after = newSrc.slice(afterIdx + 1); // +1 skips the ';'
  newSrc = before + replacementStatement + after;
}

replaceConst('SCHOOLS', lit('SCHOOLS', SCHOOLS));
replaceConst('VERD', lit('VERD', VERD));
replaceConst('SOCIAL', lit('SOCIAL', SOCIAL));
replaceConst('RELIG', lit('RELIG', RELIG));
replaceConst('RACCESS', lit('RACCESS', RACCESS));
replaceConst('PATHTYPE', lit('PATHTYPE', PATHTYPE));
replaceConst('RESTRICT', lit('RESTRICT', RESTRICT));
replaceConst('PROGRATE', lit('PROGRATE', PROGRATE));
replaceConst('CLINICAL', lit('CLINICAL', CLINICAL));
replaceConst('PATHNAME', lit('PATHNAME', PATHNAME));
replaceConst('INSTATE_REF', lit('INSTATE_REF', INSTATE_REF));
replaceConst('TUIT', lit('TUIT', TUIT));
replaceConst('PATHWAYS', lit('PATHWAYS', PATHWAYS));
replaceConst('PROGVERIFIED', lit('PROGVERIFIED', PROGVERIFIED));
replaceConst('YP', lit('YP', YPArr, true));
replaceConst('CDS7', lit('CDS7', CDS7));
replaceConst('ACCEL', lit('ACCEL', ACCEL));
replaceConst('UGYRS', lit('UGYRS', UGYRS));
replaceConst('MEDCOST', lit('MEDCOST', MEDCOST));
replaceConst('MEDNAME', lit('MEDNAME', MEDNAME));

const newHtml = html.replace(src, () => newSrc); // function replacer avoids \$-pattern interpolation bugs
fs.writeFileSync(path.join(ROOT, OUT), newHtml);
console.log('Built', OUT, '(', newHtml.length, 'chars )');
