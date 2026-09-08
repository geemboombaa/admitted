// GROUNDED TOOL LAYER — the "never lies" contract in code.
// Each tool takes a real school record (+ optional profile) and returns a STRUCTURED result
// with an explicit badge + source. The agent renders these; it never emits a number itself.
// No value is invented: unknown -> an honest "not published / unavailable" state, never a guess.
//
// Badge vocabulary:
//   'verified'    — an officially-sourced fact carried from verifiedFacts.
//   'estimated'   — a model estimate or a simplified derivation (e.g. flat x4 cost, personalized chance).
//   'reported'    — a number reported/derived from counts, provenance varies (see source). NOT "verified".
//   'unpublished' — we do not have this datum; stated honestly.
import { chance, band, flipDelta } from './engine.mjs';

// H6: range = the band's OWN probability interval (a heuristic), clamped to the engine's [2,96].
const BAND_RANGE = { Reach: [2, 30], Target: [30, 55], Likely: [55, 75], Safety: [75, 96] };
const pct = p => Math.round(p * 100);
const srcOf = s => (s.cds7 && s.cds7.src) || null;
const vintageOf = s => (s.cds7 && s.cds7.y) || null;
const hasNum = v => typeof v === 'number' && v > 0;

/** Personalized admit probability — or the honest base rate when there's no profile. */
export function chanceTool(school, profile = {}) {
  const { gpa, sat, testOptional = false } = profile;
  const admitVerified = (school.vf || []).includes('admit');
  if (!hasNum(gpa)) {
    return {
      tool: 'chance', ok: true, personalized: false,
      value: pct(school.admit), band: band(school.admit),
      display: pct(school.admit) + '% overall admit rate',
      badge: admitVerified ? 'verified' : 'estimated',
      source: srcOf(school), vintage: vintageOf(school),
      note: "No GPA on file — showing the school's published admit rate, not a personalized chance.",
    };
  }
  const p = chance(school, gpa, sat, testOptional);
  const b = band(p);
  const [lo, hi] = BAND_RANGE[b];
  return {
    tool: 'chance', ok: true, personalized: true,
    value: pct(p), band: b, range: [lo, hi],
    display: b + ' · ~' + lo + '–' + hi + '%',
    badge: 'estimated', // a personalized chance is ALWAYS a model estimate, never "verified"
    baseAdmit: pct(school.admit),
    baseAdmitBadge: admitVerified ? 'verified' : 'estimated',
    source: srcOf(school), vintage: vintageOf(school),
    note: 'Heuristic band + range from a linear model — not an outcome-fitted prediction.',
  };
}

/** 4-year net cost (flat x4, ESTIMATED) + raw affiliated med cost where present (never multiplied). */
export function costTool(school) {
  if (school.coa == null) {
    return { tool: 'cost', ok: false, note: 'Cost data unavailable for this school.' };
  }
  const merit = school.merit || 0;
  const annualNet = school.coa - merit;
  const vf = school.vf || [];
  const inputsVerified = vf.includes('coa') && (merit === 0 || vf.includes('merit'));
  const res = {
    tool: 'cost', ok: true,
    annualNet, fourYearNet: annualNet * 4,
    badge: 'estimated', inputsVerified,
    source: srcOf(school), vintage: vintageOf(school),
    note: '4-year figure = annual net (COA − merit) × 4 (flat simplification) — ESTIMATED.',
  };
  if (school.affiliatedMedCost != null) {
    res.bsmd = {
      medCost: school.affiliatedMedCost,
      medName: school.affiliatedMedName || null,
      note: 'Published affiliated med-school cost, shown raw — we do NOT multiply by an assumed number of med years (not in our verified data).',
    };
  }
  return res;
}

/** Program-eligibility gate off the STRUCTURED program.bar (never from prose — RULES #1). */
export function eligibilityTool(school, profile = {}) {
  const bar = school.program && school.program.bar;
  if (!bar || (bar.gpa == null && bar.sat == null)) {
    return {
      tool: 'eligibility', ok: true, applicable: false, status: 'no-published-gate',
      note: school.program ? 'This program publishes no GPA/SAT gate.' : 'No BS/MD program at this school.',
    };
  }
  if (!hasNum(profile.gpa)) {
    return { tool: 'eligibility', ok: true, applicable: true, status: 'need-profile', bar, note: 'Enter GPA/SAT to check against the program minimum.' };
  }
  const gpaOK = profile.gpa >= bar.gpa;
  const satOK = bar.sat == null || (hasNum(profile.sat) && profile.sat >= bar.sat);
  const meets = gpaOK && satOK;
  const pv = school.programVerified || {};
  const gpaType = pv.minGpaType || null; // 'weighted' | 'unweighted' | null
  const avgTxt = pv.avgGpa ? ` (avg admitted ~${pv.avgGpa} GPA${pv.avgSat ? ` / ${pv.avgSat} SAT` : ''})` : '';
  // Honesty: our profile GPA is unweighted; if the bar is WEIGHTED the GPA comparison isn't like-for-like.
  const scaleCaveat = gpaType === 'weighted' ? ' Note: this bar is a WEIGHTED GPA; your entered GPA is unweighted, so treat the GPA check as indicative, not exact.' : '';
  return {
    tool: 'eligibility', ok: true, applicable: true,
    status: meets ? 'Meets minimum' : 'Below minimum',
    meets, bar, gpaType, gpaOK, satOK,
    avgGpa: pv.avgGpa ?? null, avgSat: pv.avgSat ?? null, admitRatePct: pv.admitRatePct ?? null,
    source: pv.src || srcOf(school),
    note: (meets
      ? 'Clears the published minimum. The average ADMITTED profile is typically higher' + avgTxt + ' — minimum ≠ competitive.'
      : "Below the program's published minimum bar.") + scaleCaveat,
  };
}

/** Program-level admit rate where a school publishes counts. Uniform 'reported' badge (provenance varies). */
export function programOddsTool(school) {
  const pv = school.programVerified;
  if (!pv || pv.admitRatePct == null) {
    return {
      tool: 'programOdds', ok: true, published: false,
      note: school.program ? 'This program does not publish an admit rate.' : 'No BS/MD program at this school.',
    };
  }
  return {
    tool: 'programOdds', ok: true, published: true,
    value: pv.admitRatePct, display: pv.admitRatePct + '% program admit rate',
    applicantCount: pv.applicantCount ?? null, admitCount: pv.admitCount ?? null,
    // Provenance (institutional vs newspaper vs derived) lives only in the source string.
    // We do NOT parse it into a verdict (RULES #1) — badge uniformly 'reported' and show the source.
    badge: 'reported', source: pv.src || null,
    note: 'Program-level admit rate — distinct from (and far lower than) the undergrad admit rate. Source provenance varies; see source.',
  };
}

/** BS/MD attrition — honestly unpublished in our data; surface undergrad grad rate as a distinct signal. */
export function attritionTool(school) {
  const res = {
    tool: 'attrition', ok: true, published: false, badge: 'unpublished',
    note: 'BS/MD program retention/attrition is not published in our data.',
  };
  if (school.grad4 != null) {
    res.grad4 = school.grad4;
    res.grad4Note = 'Overall 4-year UNDERGRAD graduation rate (' + school.grad4 + '%) — NOT BS/MD program retention. Shown as a related, distinct signal.';
  }
  return res;
}

/** Exact GPA/SAT delta to flip up one band, or the honest ceiling. Wraps flipDelta(). */
export function whatFlipsItTool(school, profile = {}) {
  const { gpa, sat, testOptional = false } = profile;
  if (!hasNum(gpa)) {
    return { tool: 'whatFlipsIt', ok: true, status: 'need-profile', note: 'Enter GPA to see what moves your band.' };
  }
  const r = flipDelta(school, gpa, sat, testOptional);
  if (r === null) {
    return { tool: 'whatFlipsIt', ok: true, status: 'safety', note: 'Already a Safety here — nothing to flip.' };
  }
  const isCeiling = /ceiling/.test(r.txt);
  return { tool: 'whatFlipsIt', ok: true, status: isCeiling ? 'ceiling' : 'flippable', from: r.b, to: r.nextB, display: r.txt };
}
