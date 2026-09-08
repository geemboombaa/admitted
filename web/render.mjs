// PURE render layer — tool cards -> HTML strings. No DOM, no side effects (testable with node:test).
// Every number rendered comes straight from a card field; badges reflect the card's own honesty state.

export function esc(t) {
  return String(t == null ? '' : t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

const BADGE = {
  verified: { label: 'VERIFIED', cls: 'b-verified' },
  estimated: { label: 'EST', cls: 'b-estimated' },
  reported: { label: 'REPORTED', cls: 'b-reported' },
  unpublished: { label: 'NOT PUBLISHED', cls: 'b-unpublished' },
};

export function badge(kind, source) {
  const b = BADGE[kind];
  if (!b) return '';
  const src = source ? ` title="${esc(source)}"` : '';
  return `<span class="badge ${b.cls}"${src}>${b.label}${source ? ' ⓘ' : ''}</span>`;
}

const BAND_CLASS = { Safety: 'band-safety', Likely: 'band-likely', Target: 'band-target', Reach: 'band-reach' };

function chanceCard(c) {
  if (!c.personalized) {
    return `<div class="card chance">
      <div class="card-h">Admit odds ${badge(c.badge, c.source)}</div>
      <div class="big">${c.value}%<span class="sub"> overall admit rate</span></div>
      <div class="note">${esc(c.note)}</div></div>`;
  }
  const [lo, hi] = c.range;
  return `<div class="card chance">
    <div class="card-h">Your chance ${badge(c.badge)}</div>
    <div class="bandpill ${BAND_CLASS[c.band]}">${c.band} · ~${lo}–${hi}%</div>
    <div class="rangebar"><span class="fill ${BAND_CLASS[c.band]}" style="left:${lo}%;width:${hi - lo}%"></span></div>
    <div class="sub">Overall admit rate: ${c.baseAdmit}% ${badge(c.baseAdmitBadge, c.source)}</div>
    <div class="note">${esc(c.note)}</div></div>`;
}

function costCard(c) {
  if (!c.ok) return `<div class="card cost"><div class="note">${esc(c.note)}</div></div>`;
  let bsmd = '';
  if (c.bsmd) bsmd = `<div class="sub">Affiliated med school (${esc(c.bsmd.medName || 'med')}): $${c.bsmd.medCost.toLocaleString('en-US')} <span class="mini">${esc(c.bsmd.note)}</span></div>`;
  return `<div class="card cost">
    <div class="card-h">Cost ${badge('estimated', c.source)}</div>
    <div class="big">$${c.annualNet.toLocaleString('en-US')}<span class="sub">/yr net</span></div>
    <div class="sub">~$${c.fourYearNet.toLocaleString('en-US')} over 4 years</div>
    ${bsmd}<div class="note">${esc(c.note)}</div></div>`;
}

function eligibilityCard(c) {
  if (!c.applicable) return `<div class="card elig"><div class="card-h">BS/MD eligibility</div><div class="note">${esc(c.note)}</div></div>`;
  if (c.status === 'need-profile') return `<div class="card elig"><div class="card-h">BS/MD eligibility</div><div class="note">${esc(c.note)}</div></div>`;
  const cls = c.meets ? 'ok' : 'no';
  const barTxt = `${c.bar.gpa}${c.gpaType ? ' ' + c.gpaType : ''} GPA${c.bar.sat != null ? ` / ${c.bar.sat} SAT` : ''}`;
  return `<div class="card elig">
    <div class="card-h">Program minimum ${badge('reported', c.source)}</div>
    <div class="status ${cls}">${esc(c.status)}</div>
    <div class="sub">Published bar: ${esc(barTxt)}</div>
    <div class="note">${esc(c.note)}</div></div>`;
}

function programOddsCard(c) {
  if (!c.published) return `<div class="card prog"><div class="card-h">Program admit rate</div><div class="note">${esc(c.note)}</div></div>`;
  const counts = (c.admitCount != null && c.applicantCount != null) ? ` <span class="sub">(${c.admitCount} of ${c.applicantCount})</span>` : '';
  return `<div class="card prog">
    <div class="card-h">Program admit rate ${badge('reported', c.source)}</div>
    <div class="big">${c.value}%${counts}</div>
    <div class="note">${esc(c.note)}</div></div>`;
}

// #15 — attrition (a hard truth) is rendered with a "what's in your control" companion when provided.
function attritionCard(c, locusHtml) {
  const grad = c.grad4 != null ? `<div class="sub">${esc(c.grad4Note)}</div>` : '';
  const locus = locusHtml ? `<div class="locus"><div class="locus-h">What's in your control</div>${locusHtml}</div>` : '';
  return `<div class="card attrition">
    <div class="card-h">Will you finish? ${badge('unpublished')}</div>
    <div class="note">${esc(c.note)}</div>${grad}${locus}</div>`;
}

function whatFlipsItCard(c) {
  if (c.status === 'need-profile') return `<div class="card flip"><div class="note">${esc(c.note)}</div></div>`;
  if (c.status === 'safety') return `<div class="card flip"><div class="card-h">What flips it</div><div class="note">${esc(c.note)}</div></div>`;
  const tone = c.status === 'ceiling' ? 'ceiling' : 'flippable';
  return `<div class="card flip ${tone}">
    <div class="card-h">What flips it</div>
    <div class="flip-txt">${esc(c.display)}</div></div>`;
}

// Inner body of whatFlipsIt (no card chrome) — used inside the attrition locus companion.
function flipInner(c) {
  if (!c || (c.status !== 'flippable' && c.status !== 'ceiling')) return '';
  return `<div class="flip-txt">${esc(c.display)}</div>`;
}

export function renderCard(card, cards) {
  if (!card) return '';
  switch (card.tool) {
    case 'chance': return chanceCard(card);
    case 'cost': return costCard(card);
    case 'eligibility': return eligibilityCard(card);
    case 'programOdds': return programOddsCard(card);
    case 'whatFlipsIt': return whatFlipsItCard(card);
    case 'attrition': {
      const flip = (cards || []).find(x => x && x.tool === 'whatFlipsIt');
      return attritionCard(card, flipInner(flip));
    }
    default: return '';
  }
}

// Render an agent result into a message body. When attrition is present, its whatFlipsIt companion
// is folded INTO the attrition card (#15 pairing) and not repeated as a standalone card.
export function renderCards(cards) {
  const hasAttrition = (cards || []).some(c => c && c.tool === 'attrition');
  const html = [];
  for (const c of cards || []) {
    if (hasAttrition && c && c.tool === 'whatFlipsIt') continue; // folded into attrition
    html.push(renderCard(c, cards));
  }
  return html.join('');
}
