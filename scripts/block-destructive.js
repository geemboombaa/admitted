// PreToolUse hook — blocks Claude (main + subagents) from NAIVE destructive Bash-tool commands.
// This is a mistake-preventer, not a security sandbox: a determined agent can still obfuscate
// (char concat, base64, $(...)). The real safety net is commit-early git history + loop-guard +
// kill-agents. Here we close the realistic accidental bypasses (wrappers, env prefixes, abs paths,
// git -C, +refspec) that the first version missed. Loop scripts run git in raw bash (not the Bash
// tool), so their scoped reverts are unaffected.
function peel(seg) {
  let s = seg.trim(), prev;
  do { prev = s;
    s = s.replace(/^\$\(\s*/, '').replace(/\s*\)$/, '');            // $( ... ) substitution
    s = s.replace(/^`\s*/, '').replace(/\s*`$/, '');                // ` ... ` substitution
    s = s.replace(/^(sudo|command|env|nice|nohup|time|eval|stdbuf\s+\S+)\s+/i, '');
    s = s.replace(/^xargs\s+(-\S+\s+)*/i, '');                      // xargs [flags] <cmd>
    s = s.replace(/^\w+=(?:"[^"]*"|'[^']*'|\S*)\s+/, '');           // VAR=val prefix
    const q = s.match(/^(['"])([\s\S]*)\1$/); if (q) s = q[2].trim(); // "git clean" -> git clean
  } while (s !== prev);
  const bc = s.match(/^(?:bash|sh|zsh|dash)\s+-c\s+(['"])([\s\S]*)\1\s*$/); // bash -c "payload"
  if (bc) s = bc[2].trim();
  s = s.replace(/^["']?\S*\/([a-zA-Z0-9_.-]+)(["']?)(\s|$)/, '$1$3'); // /usr/bin/rm -> rm
  s = s.replace(/^git\s+-C\s+\S+\s+/, 'git ');                       // git -C path <sub> -> git <sub>
  return s;
}
let inp = '';
process.stdin.on('data', d => inp += d).on('end', () => {
  let cmd = '';
  try { cmd = (JSON.parse(inp).tool_input || {}).command || ''; } catch {}
  const segs = cmd.split(/&&|\|\||;|\||\n/).map(peel);
  const deny = why => process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'deny',
      permissionDecisionReason: 'BLOCKED by autonomous-safety hook: ' + why }
  }));
  for (const s of segs) {
    if (/^(rm|unlink)\b/.test(s) && /(-[a-z]*r[a-z]*f|-[a-z]*f[a-z]*r|-r\b[\s\S]*-f|-f\b[\s\S]*-r)/i.test(s))
      return deny('rm -rf is banned — delete specific files or use .scratch/.');
    if (/^git\s+reset\s+--hard\b/.test(s))
      return deny('git reset --hard is banned (wiped work repeatedly). Commit first, or git stash / git restore.');
    if (/^git\s+clean\b/.test(s)) {
      const scoped = /(^|\s)\.scratch(\/|\s|$)/.test(s) && !/\.\./.test(s) && !/-[a-z]*x/i.test(s);
      if (!scoped) return deny('git clean must be scoped to a .scratch path (no .., no -x). It wipes untracked work otherwise.');
    }
    if (/^git\s+push\b/.test(s) && (/--force\b|-f\b/.test(s) || /\s\+\S+/.test(s)))
      return deny('force-push (--force / -f / +refspec) is banned.');
    if (/^(rm|mv|cp|cat|tee|truncate)\b[\s\S]*\.git\//.test(s) || /[>]\s*['"]?\.git\//.test(s))
      return deny('writing/deleting inside .git/ is banned.');
  }
});
