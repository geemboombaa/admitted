// AGENT SPINE — intent -> tools -> grounded cards, with the "can't lie" contract enforced in code.
//
// Design: the model is a SEAM (injected). Without a key, a deterministic rule router + template
// renderer runs the whole app (real, not a stub). With a key later, an LLM implements model.route()
// and model.compose() — and the SAME groundingGuard verifies its output. If the model states a
// %/$/GPA/SAT number (or a certainty phrase) that no tool grounds, the guard rejects the text and
// we fall back to the grounded template. The template path is grounded BY CONSTRUCTION; the model
// path is GUARDED — a safety net, not a proof (see the guard's honest-scope note below).
import { chanceTool, costTool, eligibilityTool, programOddsTool, attritionTool, whatFlipsItTool } from './tools.mjs';

export const TOOLS = {
  chance: chanceTool,
  whatFlipsIt: whatFlipsItTool,
  cost: costTool,
  eligibility: eligibilityTool,
  programOdds: programOddsTool,
  attrition: attritionTool,
};

// ---- intent routing (deterministic, key-free default) --------------------------------------
const INTENT_RULES = [
  [/(attrition|retention|wash|drop\s*out|finish|make it through|survive)/i, ['attrition']],
  [/(cost|price|afford|tuition|pay|money|expensive|net)/i, ['cost']],
  [/(eligib|qualif|minimum|cut\s*off|bar|requirement|good enough)/i, ['eligibility']],
  [/(program (odds|rate|admit)|bs\s*\/?\s*md (odds|rate)|plme)/i, ['programOdds']],
  [/(flip|improve|raise|move|boost|what.*(need|takes)|delta)/i, ['whatFlipsIt']],
  [/(chance|odds|get in|admit|my shot|likely)/i, ['chance', 'whatFlipsIt']],
];

export function deterministicRoute(userMsg, ctx = {}) {
  const msg = String(userMsg || '');
  for (const [re, tools] of INTENT_RULES) if (re.test(msg)) return { tools };
  // Default: an honest chance overview for a BS/MD school (adds the program lens where relevant).
  const base = ['chance', 'whatFlipsIt'];
  if (ctx.school && ctx.school.program) base.push('eligibility', 'programOdds');
  return { tools: base };
}

// ---- run the chosen tools into structured cards ---------------------------------------------
export function renderCards(toolNames, school, profile = {}) {
  const cards = [];
  for (const name of toolNames) {
    const fn = TOOLS[name];
    if (!fn) continue;
    cards.push(fn(school, profile));
  }
  return cards;
}

// ---- grounded template renderer (grounded by construction; every number comes from a card) ---
export function composeText(cards) {
  const lines = [];
  for (const c of cards) {
    if (!c || c.ok === false) continue;
    switch (c.tool) {
      case 'chance':
        if (c.personalized) lines.push(`${c.band} · ~${c.range[0]}–${c.range[1]}% (heuristic estimate). Overall admit rate: ${c.baseAdmit}%.`);
        else lines.push(`Published admit rate: ${c.value}%. (No GPA on file — not a personalized chance.)`);
        break;
      case 'whatFlipsIt':
        if (c.status === 'flippable' || c.status === 'ceiling') lines.push(c.display);
        else if (c.status === 'safety') lines.push('Already a Safety here.');
        break;
      case 'cost': {
        let l = `~$${c.annualNet.toLocaleString('en-US')}/yr net, ~$${c.fourYearNet.toLocaleString('en-US')} over 4 years (estimated).`;
        if (c.bsmd) l += ` Affiliated med-school cost: $${c.bsmd.medCost.toLocaleString('en-US')} (shown raw).`;
        lines.push(l);
        break;
      }
      case 'eligibility':
        if (!c.applicable) lines.push(c.note);
        else if (c.status === 'need-profile') lines.push(c.note);
        else lines.push(`${c.status} (bar: ${c.bar.gpa} GPA${c.bar.sat != null ? ` / ${c.bar.sat} SAT` : ''}). ${c.note}`);
        break;
      case 'programOdds':
        if (c.published) lines.push(`Program admit rate: ${c.value}% (${c.admitCount} of ${c.applicantCount}) — reported; see source.`);
        else lines.push(c.note);
        break;
      case 'attrition':
        lines.push(c.note + (c.grad4Note ? ' ' + c.grad4Note : ''));
        break;
    }
  }
  return lines.join(' ');
}

// ---- the grounding guard (the enforcement) --------------------------------------------------
// UNIT-AWARE. Every claimed number is tagged by kind (pct / usd / gpa / sat / count) and matched
// ONLY against grounded numbers of the SAME kind — so a $ cost cannot launder as a % chance.
// It scans: N% and "N percent" (pct), digit ratios "a out of b" / "a/b" (-> pct), $N (usd),
// comma-grouped counts, GPA-scale decimals, SAT-scale ints; PLUS a certainty-phrase blocklist
// ("a lock", "near-certain", "guaranteed", ...) for qualitative overstatement.
//
// HONEST SCOPE — this is a SAFETY NET, not a proof. The deterministic template path is grounded
// by construction; the MODEL path is guarded, not guaranteed. Known gaps it does NOT catch:
// spelled-out word-number ratios ("one in three"); bare integer percentages with NO % sign and NO
// nearby chance/odds/shot word ("your number is 70"); and any novel qualitative phrasing outside the
// blocklist. The intended posture is: the model REFERENCES tool numbers; the template leads on
// anything quantitative. Do not treat a guard pass as "the model told the truth".
const CERTAINTY_RE = /\b(a lock|locks? it up|near-?certain|near-?guaranteed|guaranteed|definitely (?:get|getting|be) (?:in|admitted)|basically in|sure thing|can'?t miss|shoo-?in|slam[- ]?dunk|walk-?in|100%\s*(?:in|admit|chance))\b/i;

/** Extract typed numeric claims {kind, value} from a text. Blanks richer tokens first. */
export function extractTyped(text) {
  let s = String(text || '');
  const out = [];
  const eat = (re, fn) => { for (const m of s.matchAll(re)) fn(m); s = s.replace(re, ' '); };
  eat(/(\d+(?:\.\d+)?)\s*(?:%|(?:percent|pct)\b)/gi, m => out.push({ kind: 'pct', value: parseFloat(m[1]) }));
  eat(/\b(\d+(?:\.\d+)?)\s*(?:out of|in|\/)\s*(\d+(?:\.\d+)?)\b/gi, m => { const a = parseFloat(m[1]), b = parseFloat(m[2]); if (b > 0) out.push({ kind: 'pct', value: Math.round((a / b) * 100) }); });
  eat(/\$\s?([\d,]+(?:\.\d+)?)/g, m => out.push({ kind: 'usd', value: parseFloat(m[1].replace(/,/g, '')) }));
  eat(/\b\d{1,3}(?:,\d{3})+\b/g, m => out.push({ kind: 'count', value: parseFloat(m[0].replace(/,/g, '')) }));
  eat(/\b([0-4]\.\d{1,2})\b/g, m => out.push({ kind: 'gpa', value: parseFloat(m[1]) }));
  for (const m of s.matchAll(/\b(\d{3,4})\b/g)) { const n = parseInt(m[1], 10); if (n >= 400 && n <= 1600) out.push({ kind: 'sat', value: n }); }
  // Bare-integer percentages stated near a chance word ("a 70 chance", "odds are ~85") — the common
  // no-%-sign LLM laundering shape. Only near chance/odds/shot (which the template never emits with a
  // bare int), so it can't false-flag the grounded template.
  for (const m of s.matchAll(/\b(\d{1,3})\b/g)) {
    const n = parseInt(m[1], 10);
    if (n > 100) continue;
    const w = s.slice(Math.max(0, m.index - 18), m.index + m[1].length + 18);
    if (/chance|odds|shot/i.test(w)) out.push({ kind: 'pct', value: n });
  }
  return out;
}

const pushT = (out, kind, v) => { if (typeof v === 'number' && Number.isFinite(v)) out.push({ kind, value: v }); };

/** The grounded, unit-tagged number set derived from the tool cards (+ the user's own profile). */
export function allowedTyped(cards, profile = {}) {
  const out = [];
  pushT(out, 'gpa', profile.gpa);
  pushT(out, 'sat', profile.sat);
  for (const c of cards || []) {
    if (!c) continue;
    if (c.tool === 'chance') { pushT(out, 'pct', c.value); pushT(out, 'pct', c.baseAdmit); if (c.range) { pushT(out, 'pct', c.range[0]); pushT(out, 'pct', c.range[1]); } }
    if (c.tool === 'cost') { pushT(out, 'usd', c.annualNet); pushT(out, 'usd', c.fourYearNet); if (c.bsmd) pushT(out, 'usd', c.bsmd.medCost); }
    if (c.tool === 'eligibility' && c.bar) { pushT(out, 'gpa', c.bar.gpa); pushT(out, 'sat', c.bar.sat); pushT(out, 'gpa', c.avgGpa); pushT(out, 'sat', c.avgSat); pushT(out, 'pct', c.admitRatePct); }
    if (c.tool === 'programOdds' && c.published) { pushT(out, 'pct', c.value); pushT(out, 'count', c.admitCount); pushT(out, 'count', c.applicantCount); }
    if (c.tool === 'attrition' && c.grad4 != null) pushT(out, 'pct', c.grad4);
    // Numbers inside tool-authored strings (e.g. whatFlipsIt engine deltas) are grounded — take them WITH their unit.
    for (const key of ['display', 'note', 'grad4Note']) if (typeof c[key] === 'string') for (const t of extractTyped(c[key])) out.push(t);
  }
  return out;
}

export function groundingGuard(text, cards, profile = {}) {
  const allowed = allowedTyped(cards, profile);
  const ok = (kind, value) => allowed.some(a => a.kind === kind && Math.abs(a.value - value) < 0.001);
  const violations = [];
  for (const { kind, value } of extractTyped(text)) if (!ok(kind, value)) violations.push({ kind, value });
  if (CERTAINTY_RE.test(String(text || ''))) violations.push({ kind: 'certainty', value: null });
  return { ok: violations.length === 0, violations };
}

// ---- the agent ------------------------------------------------------------------------------
// createAgent(model?) — model is optional. With no model, deterministic route + template (fully
// grounded). With a model, it routes/composes, but any ungrounded output is REPLACED by the
// grounded template (guard enforced). Returns {tools, cards, text, grounded, violations}.
export function createAgent(model = null) {
  return {
    handle(userMsg, ctx = {}) {
      const { school, profile = {} } = ctx;
      if (!school) {
        return { tools: [], cards: [], text: 'Pick a school and I’ll show your honest odds, cost, and what moves them.', grounded: true, violations: [], needsSchool: true };
      }
      const route = (model && model.route) ? model.route(userMsg, ctx) : deterministicRoute(userMsg, ctx);
      const cards = renderCards(route.tools, school, profile);
      const template = composeText(cards);
      if (model && model.compose) {
        const candidate = model.compose(userMsg, cards);
        const guard = groundingGuard(candidate, cards, profile);
        // Enforcement: only trust the model's prose if it passes the guard; else use the template.
        if (guard.ok) return { tools: route.tools, cards, text: candidate, grounded: true, violations: [] };
        return { tools: route.tools, cards, text: template, grounded: false, violations: guard.violations };
      }
      // Deterministic path: run the guard on our OWN template too, so a template regression that
      // emits an un-carded number is caught (not silently reported grounded).
      const guard = groundingGuard(template, cards, profile);
      return { tools: route.tools, cards, text: template, grounded: guard.ok, violations: guard.violations };
    },
  };
}
