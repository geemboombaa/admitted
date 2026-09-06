// Live progress dashboard for the self-improve loop.
// Reads SELF-IMPROVE-BACKLOG.md + SELF-IMPROVE-LOG.md and serves an auto-refreshing
// visual progress bar at http://localhost:7654 . Read-only, no deps.
//   node scripts/progress-server.js      (Ctrl+C to stop)
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const PORT = 7654;
const rd = f => { try { return fs.readFileSync(path.join(ROOT, f), 'utf8'); } catch { return ''; } };

function state() {
  const backlog = rd('SELF-IMPROVE-BACKLOG.md');
  const done = (backlog.match(/^- \[x\]/gm) || []).length;
  const pending = (backlog.match(/^- \[ \]/gm) || []).length;
  const total = done + pending || 1;

  const log = rd('SELF-IMPROVE-LOG.md').split('\n').filter(Boolean);
  // Slice to the current run: everything after the last "mode:" line.
  let start = 0;
  for (let i = log.length - 1; i >= 0; i--) if (/\] mode:/.test(log[i])) { start = i; break; }
  const run = log.slice(start);
  const runText = run.join('\n');

  const committed = (runText.match(/COMMITTED:/g) || []).length;
  const rejected = (runText.match(/REJECTED/g) || []).length;
  const modeLine = (run.find(l => /\] mode:/.test(l)) || '').replace(/.*\] mode:/, '').trim();
  const iterMatch = runText.match(/iteration (\d+)\/(\d+)/g);
  const lastIter = iterMatch ? iterMatch[iterMatch.length - 1] : '';
  const ii = lastIter ? lastIter.match(/iteration (\d+)\/(\d+)/) : null;
  const cur = ii ? +ii[1] : 0, batchN = ii ? +ii[2] : 0;

  // current item + phase
  let item = '', phase = 'idle';
  for (let i = run.length - 1; i >= 0; i--) {
    const l = run[i];
    if (!item && /picked:/.test(l)) item = l.replace(/.*picked:\s*/, '');
    if (phase === 'idle') {
      if (/batch complete/.test(l)) { phase = 'done'; break; }
      if (/COMMITTED:/.test(l)) { phase = 'committed'; break; }
      if (/REJECTED/.test(l)) { phase = 'rejected'; break; }
      if (/review verdict/.test(l)) { phase = 'reviewed'; break; }
      if (/\] model:/.test(l)) { phase = 'building'; break; }
      if (/picked:/.test(l)) { phase = 'picking'; break; }
    }
  }
  const finished = /batch complete/.test(runText);
  const tail = log.slice(-12);
  return { done, pending, total, committed, rejected, modeLine, cur, batchN, item, phase, finished, tail };
}

function bar(frac, width = 34, color = '#00ff88') {
  const n = Math.max(0, Math.min(width, Math.round(frac * width)));
  return `<span style="color:${color}">${'█'.repeat(n)}</span><span style="color:#1e2d40">${'░'.repeat(width - n)}</span>`;
}

function page() {
  const s = state();
  const overall = s.done / s.total;
  const batchFrac = s.batchN ? s.committed / s.batchN : 0;
  const phaseColor = { building:'#00b4ff', reviewed:'#ffd60a', committed:'#00ff88', rejected:'#ff2d55', picking:'#a0b8d8', done:'#00ff88', idle:'#a0b8d8' }[s.phase] || '#e8f0ff';
  const esc = t => (t || '').replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]));
  return `<!doctype html><html><head><meta charset="utf8"><meta http-equiv="refresh" content="2">
<title>admitted — live progress</title>
<style>
 body{background:#010408;color:#e8f0ff;font:14px/1.5 'Segoe UI',system-ui,sans-serif;margin:0;padding:28px 34px}
 h1{font-size:16px;letter-spacing:.5px;margin:0 0 4px;color:#e8f0ff}
 .sub{color:#a0b8d8;font-size:12px;margin-bottom:22px}
 .bar{font-family:'JetBrains Mono',Consolas,monospace;font-size:20px;letter-spacing:-1px}
 .lbl{color:#ccd8f0;font-size:12px;margin:18px 0 6px;text-transform:uppercase;letter-spacing:1px}
 .big{font-size:26px;font-weight:600}
 .row{display:flex;gap:40px;margin:14px 0 6px}
 .stat{font-size:13px}.stat b{font-size:22px;display:block}
 .g{color:#00ff88}.r{color:#ff2d55}.b{color:#00b4ff}.y{color:#ffd60a}
 .item{background:#080e18;border:1px solid #152030;border-radius:8px;padding:14px 16px;margin:8px 0;color:#ccd8f0;font-size:13px}
 .phase{display:inline-block;padding:3px 12px;border-radius:20px;font-size:12px;font-weight:600;background:#0c1420;border:1px solid #1e2d40}
 pre{background:#080e18;border:1px solid #152030;border-radius:8px;padding:12px 14px;color:#a0b8d8;font-size:11.5px;overflow:auto;max-height:280px;margin-top:8px}
 .dot{animation:blink 1s infinite}@keyframes blink{50%{opacity:.3}}
</style></head><body>
 <h1>admitted · self-improve loop <span class="dot" style="color:${s.finished?'#00ff88':'#00b4ff'}">●</span></h1>
 <div class="sub">${esc(s.modeLine) || 'no active run'} &nbsp;·&nbsp; auto-refresh 2s</div>

 <div class="lbl">Current batch — ${s.committed}/${s.batchN||'?'} committed (iteration ${s.cur||0}/${s.batchN||0})</div>
 <div class="bar">${bar(batchFrac)} ${Math.round(batchFrac*100)}%</div>

 <div class="lbl">Overall Stage backlog — ${s.done}/${s.total} done</div>
 <div class="bar">${bar(overall, 34, '#00b4ff')} ${Math.round(overall*100)}%</div>

 <div class="row">
  <div class="stat"><b class="g">${s.committed}</b>committed</div>
  <div class="stat"><b class="r">${s.rejected}</b>rejected</div>
  <div class="stat"><b class="b">${s.pending}</b>pending</div>
 </div>

 <div class="lbl">Now: <span class="phase" style="color:${phaseColor}">${s.finished?'BATCH COMPLETE':s.phase.toUpperCase()}</span></div>
 <div class="item">${esc(s.item) || '—'}</div>

 <div class="lbl">Recent activity</div>
 <pre>${esc(s.tail.join('\n')) || 'waiting…'}</pre>
</body></html>`;
}

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(page());
}).listen(PORT, () => console.log(`progress dashboard: http://localhost:${PORT}`));
