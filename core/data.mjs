// DATA LOADER (Node/build-time only — uses fs). Builds one clean school record per
// data/schools/*.json. Two jobs the legacy app-data.js generator got wrong:
//   1. Apply the VERIFIED value per field (verifiedFacts.*) over the rough general.* value,
//      including the "sat"->s25/s75 and "gpa"->g25/g75 token mapping the old generator dropped.
//   2. Preserve the BS/MD wedge fields (program, programVerified, accel, affiliatedMedCost, cds7)
//      that the old generator threw away.
// No value is invented — every override comes straight from verifiedFacts.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// A verifiedFacts token maps to one or more OUTPUT fields.
const VF_MAP = {
  admit: ['admit'],
  coa: ['coa'],
  merit: ['merit'],
  grad4: ['grad4'],
  sat: ['s25', 's75'],
  gpa: ['g25', 'g75'],
};

/** Build one clean, verified, wedge-preserving school record from a raw JSON doc. */
export function buildSchool(doc) {
  const g = doc.general || {};
  const out = { ...g };
  if (out.social == null && doc.social != null) out.social = doc.social;

  const vfObj = doc.verifiedFacts || {};
  const tokens = vfObj.vf || [];
  const verifiedFields = [];
  for (const tok of tokens) {
    const targets = VF_MAP[tok] || [tok];
    for (const f of targets) {
      if (vfObj[f] != null) { out[f] = vfObj[f]; verifiedFields.push(f); }
    }
  }
  out.vf = verifiedFields;                 // which OUTPUT fields carry a verified value (per-field badges)
  out.verified = verifiedFields.length > 0; // legacy whole-school flag (retire in UI; kept for now)

  // Wedge fields — dropped by the legacy generator, preserved here.
  if (doc.program) out.program = doc.program;
  if (doc.programVerified) out.programVerified = doc.programVerified;
  if (doc.accel) out.accel = doc.accel;
  if (doc.affiliatedMedCost != null) out.affiliatedMedCost = doc.affiliatedMedCost;
  if (doc.affiliatedMedName) out.affiliatedMedName = doc.affiliatedMedName;
  if (doc.cds7) out.cds7 = doc.cds7;
  if (doc.pathType) out.pathType = doc.pathType;
  return out;
}

/** Load + build every school in a directory, ordered by doc.order. */
export function loadSchools(dir) {
  const files = readdirSync(dir).filter(f => f.endsWith('.json') && !f.startsWith('_'));
  const docs = files.map(f => JSON.parse(readFileSync(join(dir, f), 'utf8')));
  docs.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  return docs.map(buildSchool);
}

export function getSchool(schools, id) {
  return schools.find(s => s.id === id) || null;
}
