// One-time (repeatable) migration: reads the CURRENT live index1.html and
// writes an equivalent data/schools/*.json + data/shared/*.json tree.
// Read-only w.r.t. index1.html — never touches the live file.
const fs = require('fs');
const path = require('path');
const { extractScriptBlock, grabConst } = require('./_extract-lib');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'index1.html'), 'utf8');
const src = extractScriptBlock(html);

const NAMES = ['SCHOOLS','VERD','SOCIAL','RELIG','RACCESS','PATHTYPE','RESTRICT',
  'APPINFO','PROGRATE','CLINICAL','PATHNAME','INSTATE_REF','TUIT','LINES',
  'PATHWAYS','PROGVERIFIED','UCS','WDEFS','PRESETS','YP','CDS7','ACCEL',
  'ACCEL_LIKE','UGYRS','MEDCOST','MEDNAME','BANDCOLOR','VDATE','EC_SUMMARY',
  'UC_NOTE','FREE_MD_HTML'];

const got = {};
const missing = [];
for (const n of NAMES) {
  const r = grabConst(src, n);
  if (!r) { missing.push(n); continue; }
  got[n] = r.value;
}
console.log('Extracted:', Object.keys(got).length, '| missing:', missing);

const SCHOOLS = got.SCHOOLS;
const idsSet = new Set(SCHOOLS.map(s => s.id));

// ---- match PATHWAYS/PROGVERIFIED entries to a SCHOOLS id ----
function matchSchoolId(p) {
  if (p.pid) {
    const stripped = p.pid.replace(/_prog$/, '');
    if (idsSet.has(stripped)) return stripped;
  }
  const scName = (p.sc || '').split(' /')[0];
  const hit = SCHOOLS.find(x => scName && (scName.startsWith(x.n) || x.n.startsWith(scName)));
  return hit ? hit.id : null;
}

const pathwaysByPid = {}; // pid -> pathways entry
for (const p of (got.PATHWAYS || [])) if (p.pid) pathwaysByPid[p.pid] = p;

const mapping = []; // for the audit log
const standalonePathways = [];
const pathwaysBySchoolId = {};
for (const p of (got.PATHWAYS || [])) {
  const id = matchSchoolId(p);
  mapping.push({ pid: p.pid || null, sc: p.sc, matchedId: id });
  if (id) pathwaysBySchoolId[id] = p;
  else standalonePathways.push(p);
}

// ---- assemble per-school JSON ----
const RELIG = new Set(got.RELIG || []);
const YP = new Set(got.YP instanceof Set ? got.YP : (got.YP || []));
fs.mkdirSync(path.join(ROOT, 'data/schools'), { recursive: true });
let written = 0;
for (let idx=0; idx<SCHOOLS.length; idx++) {
  const s = SCHOOLS[idx];
  const id = s.id;
  const doc = {
    id,
    order: idx,
    general: s,
    verifiedFacts: (got.VERD || {})[id] || null,
    social: (got.SOCIAL || {})[id] ?? null,
    religAffiliated: RELIG.has(id),
    researchAccess: (got.RACCESS || {})[id] ?? null,
    pathType: (got.PATHTYPE || {})[id] || null,
    restrictNote: (got.RESTRICT || {})[id] || null,
    appInfo: (got.APPINFO || {})[id] || null,
    progRateLegacy: (got.PROGRATE || {})[id] || null,
    clinicalAccess: (got.CLINICAL || {})[id] ?? null,
    pathNameLegacy: (got.PATHNAME || {})[id] || null,
    instateRef: (got.INSTATE_REF || {})[id] ?? null,
    tuition: (got.TUIT || {})[id] ?? null,
    cds7: (got.CDS7 || {})[id] || null,
    accel: (got.ACCEL || []).find(a => a.id === id) || null,
    ugYearsOverride: (got.UGYRS || {})[id] ?? null,
    affiliatedMedCost: (got.MEDCOST || {})[id] ?? null,
    affiliatedMedName: (got.MEDNAME || {})[id] || null,
    yieldProtection: YP.has(id),
    program: pathwaysBySchoolId[id] || null,
    programVerified: pathwaysBySchoolId[id] && pathwaysBySchoolId[id].pid
      ? (got.PROGVERIFIED || {})[pathwaysBySchoolId[id].pid] || null
      : null
  };
  fs.writeFileSync(path.join(ROOT, 'data/schools', id + '.json'), JSON.stringify(doc, null, 1));
  written++;
}
console.log('Wrote', written, 'per-school JSON files.');

// ---- shared/global config (not per-school) ----
fs.mkdirSync(path.join(ROOT, 'data/shared'), { recursive: true });
const orphanAccel = (got.ACCEL || []).filter(a => !idsSet.has(a.id));
const shared = {
  weightDefs: got.WDEFS, presets: got.PRESETS, bandColor: got.BANDCOLOR,
  verifiedDate: got.VDATE, ecSummary: got.EC_SUMMARY, ucNote: got.UC_NOTE,
  freeMdHtml: got.FREE_MD_HTML, accelLike: got.ACCEL_LIKE, lines: got.LINES,
  ucs: got.UCS, standalonePathways, orphanAccel
};
if (orphanAccel.length) console.log('WARNING: ACCEL entries with no matching SCHOOLS id (kept in data/shared/app-config.json -> orphanAccel):', orphanAccel.map(a=>a.id));
fs.writeFileSync(path.join(ROOT, 'data/shared/app-config.json'), JSON.stringify(shared, null, 1));

fs.writeFileSync(path.join(ROOT, 'data/schools/_pathway-mapping-audit.json'), JSON.stringify(mapping, null, 1));
console.log('Standalone (unmatched) pathways:', standalonePathways.length);
console.log('Total PATHWAYS entries:', (got.PATHWAYS||[]).length, '| matched to a school:', Object.keys(pathwaysBySchoolId).length);
