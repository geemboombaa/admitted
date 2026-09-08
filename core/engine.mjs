// ENGINE — frozen constants, do NOT change the math (extracted verbatim from app.html).
// Pure, dual-target (Node + browser). No DOM, no fs, no globals.
// chance() is LINEAR: admit*(0.35 + 1.3*pos), clamped [0.02, 0.96]. Steepness is not
// derivable from public data, so there is no logistic/k term — see RUBRIC #0.

/**
 * Personalized admit probability for a school given a profile.
 * @param {object} s  school record — needs {admit, g25, g75, s25, s75, tb}
 * @param {number} gpa
 * @param {number} sat
 * @param {boolean} to  test-optional for this applicant (drops the SAT track)
 * @returns {number} probability in [0.02, 0.96]
 */
export function chance(s, gpa, sat, to) {
  const pg = Math.max(0, Math.min(1.25, (gpa - s.g25) / Math.max(0.05, (s.g75 - s.g25))));
  let pos = pg;
  if (!s.tb && !to && s.s25 > 0 && sat > 0) {
    const ps = Math.max(0, Math.min(1.25, (sat - s.s25) / Math.max(1, (s.s75 - s.s25))));
    pos = 0.5 * pg + 0.5 * ps;
  }
  return Math.max(0.02, Math.min(0.96, s.admit * (0.35 + 1.3 * pos)));
}

/** Band label from a probability. Thresholds frozen. */
export function band(p) {
  return p >= 0.75 ? 'Safety' : p >= 0.55 ? 'Likely' : p >= 0.30 ? 'Target' : 'Reach';
}

export const BANDS = ['Reach', 'Target', 'Likely', 'Safety'];
export const BANDCOL = { Safety: '#00ff88', Likely: '#00d4ff', Target: '#f5a623', Reach: '#a855f7' };

/** Sub-scores (0-10) used by fit(). */
export function subScores(s) {
  const cost = s.coa != null ? Math.max(0, Math.min(10, 10 - ((s.coa - (s.merit || 0)) - 15000) / 6500)) : 5;
  const prestige = (1 - s.admit) * 10;
  const west = (s.region === 'CA' || s.region === 'West') ? 10 : 3;
  return { cost, premed: s.premed ?? 5, research: s.research ?? 5, social: s.social ?? 5, prestige, west };
}

/** Weighted-average fit over chosen priorities. Returns 0-100. */
export function fit(s, prio) {
  const ss = subScores(s);
  const keys = (prio && prio.length) ? prio : ['premed', 'cost', 'research', 'social', 'prestige'];
  let sum = 0, n = 0;
  keys.forEach(k => { if (ss[k] != null) { sum += ss[k]; n++; } });
  return Math.round((n ? sum / n : 5) * 10);
}

/**
 * Exact GPA/SAT delta to flip up one band, or an honest ceiling message.
 * @returns {null | {b, nextB, txt}}  null when already Safety.
 */
export function flipDelta(s, gpa, sat, to) {
  const p = chance(s, gpa, sat, to);
  const b = band(p);
  if (b === 'Safety') return null;
  const targetP = b === 'Reach' ? 0.30 : b === 'Target' ? 0.55 : 0.75;
  const nextB = b === 'Reach' ? 'Target' : b === 'Target' ? 'Likely' : 'Safety';
  let gNeed = null;
  for (let g = gpa; g <= 5.0; g += 0.01) { if (chance(s, g, sat, to) >= targetP) { gNeed = g; break; } }
  let sNeed = null;
  const usesSat = !s.tb && !to && s.s25 > 0;
  if (usesSat) { for (let x = sat; x <= 1600; x += 10) { if (chance(s, gpa, x, to) >= targetP) { sNeed = x; break; } } }
  const parts = [];
  if (gNeed != null) { const d = (gNeed - gpa); if (d > 0.005) parts.push('+' + d.toFixed(2) + ' GPA'); else parts.push('current GPA'); }
  if (sNeed != null) { const d = Math.round((sNeed - sat) / 10) * 10; if (d > 0) parts.push('+' + d + ' SAT'); }
  if (!parts.length) {
    if (gNeed == null && (!usesSat || sNeed == null)) {
      return { b, nextB, txt: 'Even a perfect profile stays a ' + b + ' here — admit rate (' + Math.round(s.admit * 100) + '%) is the ceiling.' };
    }
  }
  return { b, nextB, txt: parts.join(' or ') + ' → ' + nextB };
}
