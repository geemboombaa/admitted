// Live progress dashboard + RUNNING-AGENTS monitor for the admitted loops.
// Reads the backlog + SELF-IMPROVE-LOG.md, and queries the OS for any live loop/agent process
// so nothing can run rogue unseen. Read-only (except it can show you what to kill). No deps.
//   node scripts/progress-server.js      ->  http://localhost:7654   (Ctrl+C to stop)
const http = require('http'), fs = require('fs'), path = require('path'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const PORT = 7654;
const rd = f => { try { return fs.readFileSync(path.join(ROOT, f), 'utf8'); } catch { return ''; } };

// --- live process truth: what loops/agents are actually running right now ---
function agents() {
  try {
    const q = 'wmic process where "commandline like \'%-loop.sh%\' or commandline like \'%--model claude-%\'" get ProcessId,CommandLine';
    const raw = cp.execSync(q, { encoding: 'utf8', timeout: 6000, stdio: ['ignore','pipe','ignore'] });
    return raw.split('\n').map(l => l.trim())
      .filter(l => /-loop\.sh|--model claude-/.test(l))
      .map(l => {
        const pid = (l.match(/(\d+)\s*$/) || [])[1] || '?';
        const kind = /-loop\.sh/.test(l) ? 'LOOP' : 'agent (claude -p)';
        const what = (l.match(/(app-improve|innovate|self-improve)-loop\.sh/) || [])[0]
          || (l.match(/--model (claude-[a-z0-9-]+)/) || [])[1] || 'process';
        return { pid, kind, what };
      });
  } catch (e) { return null; }
}

function state() {
  const logFull = rd('SELF-IMPROVE-LOG.md').split('\n').filter(Boolean);
  let start = 0;
  for (let i = logFull.length - 1; i >= 0; i--) if (/\] mode:/.test(logFull[i])) { start = i; break; }
  const run = logFull.slice(start), runText = run.join('\n');
  const isApp = /APP IMPROVE|INNOVATE/.test(runText);
  const backlog = rd(isApp ? 'APP-BACKLOG.md' : 'SELF-IMPROVE-BACKLOG.md');
  const done = (backlog.match(/^- \[x\]/gm) || []).length;
  const pending = (backlog.match(/^- \[ \]/gm) || []).length;
  const total = done + pending || 1;
  const committed = (runText.match(/COMMITTED:/g) || []).length;
  const rejected = (runText.match(/REJECTED/g) || []).length;
  const modeLine = (run.find(l => /\] mode:/.test(l)) || '').replace(/.*\] mode:/, '').trim();
  const iterMatch = runText.match(/iteration (\d+)\/(\d+)/g);
  const ii = iterMatch ? iterMatch[iterMatch.length - 1].match(/iteration (\d+)\/(\d+)/) : null;
  const cur = ii ? +ii[1] : 0, batchN = ii ? +ii[2] : 0;
  let item = '', phase = 'idle';
  for (let i = run.length - 1; i >= 0; i--) {
    const l = run[i];
    if (!item && /picked:|scout idea:/.test(l)) item = l.replace(/.*(picked:|scout idea:)\s*/, '');
    if (phase === 'idle') {
      if (/batch complete|run complete/.test(l)) { phase = 'done'; break; }
      if (/COMMITTED:/.test(l)) { phase = 'committed'; break; }
      if (/REJECTED/.test(l)) { phase = 'rejected'; break; }
      if (/review verdict/.test(l)) { phase = 'reviewed'; break; }
      if (/\] model:|picked:|scout idea:/.test(l)) { phase = 'building'; break; }
    }
  }
  const finished = /batch complete|run complete/.test(runText);
  let elapsed = null;
  const tm = (logFull[logFull.length - 1] || '').match(/\[(\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d)Z\]/);
  if (tm) { const t = Date.parse(tm[1] + 'Z'); if (!isNaN(t)) elapsed = Math.max(0, Math.round((Date.now() - t) / 1000)); }
  return { done, pending, total, committed, rejected, modeLine, cur, batchN, item, phase, finished, tail: logFull.slice(-12), elapsed, live: agents() };
}

const es = s => s == null ? '—' : s < 60 ? s + 's' : Math.floor(s / 60) + 'm ' + (s % 60) + 's';
const bar = (frac, w = 34, c = '#00ff88') => { const n = Math.max(0, Math.min(w, Math.round(frac * w))); return `<span style="color:${c}">${'█'.repeat(n)}</span><span style="color:#1e2d40">${'░'.repeat(w - n)}</span>`; };

function page() {
  const s = state();
  const overall = s.done / s.total, batchFrac = s.batchN ? s.committed / s.batchN : 0;
  const pc = { building:'#00b4ff', reviewed:'#ffd60a', committed:'#00ff88', rejected:'#ff2d55', done:'#00ff88', idle:'#a0b8d8' }[s.phase] || '#e8f0ff';
  const esc = t => (t || '').replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]));
  const working = !s.finished && s.phase !== 'idle';
  // agents panel
  let agentsHtml;
  if (s.live === null) agentsHtml = `<span style="color:#a0b8d8">process check unavailable</span>`;
  else if (s.live.length === 0) agentsHtml = `<span style="color:#00ff88;font-weight:700">● 0 agents running — clean, nothing rogue</span>`;
  else agentsHtml = `<span style="color:#ffd60a;font-weight:700">● ${s.live.length} process(es) live</span>` +
      s.live.map(a => `<div style="font-family:monospace;font-size:12px;color:#ccd8f0;margin-top:4px">PID ${a.pid} · ${a.kind} · ${esc(a.what)}</div>`).join('') +
      `<div style="color:#ff2d55;font-size:11px;margin-top:6px">kill everything: <code>bash scripts/kill-agents.sh</code></div>`;
  return `<!doctype html><html><head><meta charset="utf8"><meta http-equiv="refresh" content="60"><title>admitted — live</title>
<style>
 body{background:#010408;color:#e8f0ff;font:14px/1.5 'Segoe UI',system-ui,sans-serif;margin:0;padding:26px 32px}
 h1{font-size:16px;margin:0 0 4px}.sub{color:#a0b8d8;font-size:12px;margin-bottom:20px}
 .bar{font-family:'JetBrains Mono',Consolas,monospace;font-size:20px;letter-spacing:-1px}
 .lbl{color:#ccd8f0;font-size:12px;margin:16px 0 6px;text-transform:uppercase;letter-spacing:1px}
 .row{display:flex;gap:36px;margin:12px 0 6px}.stat b{font-size:22px;display:block}
 .card{background:#080e18;border:1px solid #152030;border-radius:10px;padding:12px 15px;margin:6px 0}
 .agents{background:#080e18;border:1px solid #152030;border-left:3px solid #00ff88;border-radius:10px;padding:13px 15px}
 .phase{display:inline-block;padding:3px 12px;border-radius:20px;font-size:12px;font-weight:600;background:#0c1420;border:1px solid #1e2d40}
 pre{background:#080e18;border:1px solid #152030;border-radius:8px;padding:11px 13px;color:#a0b8d8;font-size:11px;overflow:auto;max-height:220px}
 .dot{animation:blink 1s infinite}@keyframes blink{50%{opacity:.3}}
</style></head><body>
 <h1>admitted · loops <span class="dot" style="color:${s.finished?'#00ff88':'#00b4ff'}">●</span></h1>
 <div class="sub">${esc(s.modeLine) || 'no active run'} · auto-refresh 60s</div>

 <div class="lbl">Running agents (live OS check)</div>
 <div class="agents">${agentsHtml}</div>

 <div class="lbl">Current batch — ${s.committed}/${s.batchN||'?'} committed (iteration ${s.cur||0}/${s.batchN||0})</div>
 <div class="bar">${bar(batchFrac)} ${Math.round(batchFrac*100)}%</div>
 <div class="lbl">Overall backlog — ${s.done}/${s.total} done</div>
 <div class="bar">${bar(overall,34,'#00b4ff')} ${Math.round(overall*100)}%</div>

 <div class="row">
  <div class="stat"><b style="color:#00ff88">${s.committed}</b>committed</div>
  <div class="stat"><b style="color:#ff2d55">${s.rejected}</b>rejected</div>
  <div class="stat"><b style="color:#00b4ff">${s.pending}</b>pending</div>
 </div>

 <div class="lbl">Now: <span class="phase" style="color:${pc}">${s.finished?'COMPLETE':s.phase.toUpperCase()}</span>
   ${working?`<span style="color:${s.elapsed>1500?'#ffd60a':'#a0b8d8'};font-size:12px;margin-left:8px">⚙ ${es(s.elapsed)} since last event${s.elapsed>1500?' ⚠ may be stuck':''}</span>`:''}</div>
 <div class="card" style="color:#ccd8f0;font-size:13px">${esc(s.item) || '—'}</div>

 <div class="lbl">Recent activity</div>
 <pre>${esc(s.tail.join('\n')) || 'waiting…'}</pre>
</body></html>`;
}

http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(page()); })
  .listen(PORT, () => console.log(`dashboard + agent monitor: http://localhost:${PORT}`));
