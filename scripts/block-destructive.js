// PreToolUse hook — blocks Claude (main + subagents) from running destructive commands via the
// Bash tool. Structural fix for the recurring git-clean/reset file-wipe disasters.
// Matches only at COMMAND position (start of each &&/||/;/| segment) so it does NOT false-trip on
// commands that merely mention the phrase (e.g. `grep 'git clean' ...`). Loop scripts run their git
// internally in raw bash (not via the Bash tool), so their scoped reverts are unaffected.
let s = '';
process.stdin.on('data', d => s += d).on('end', () => {
  let cmd = '';
  try { cmd = (JSON.parse(s).tool_input || {}).command || ''; } catch {}
  // split into command segments; a destructive command is only dangerous when it's the one RUNNING
  const segs = cmd.split(/&&|\|\||;|\||\n/).map(x => x.trim().replace(/^sudo\s+/, ''));
  const block = why => {
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: 'BLOCKED by autonomous-safety hook: ' + why,
      }
    }));
  };
  for (const seg of segs) {
    if (/^rm\b/.test(seg) && /(-[a-z]*r[a-z]*f|-[a-z]*f[a-z]*r|-r\b.*-f|-f\b.*-r)/i.test(seg))
      return block('rm -rf is banned — delete specific files or use .scratch/.');
    if (/^git\s+reset\s+--hard\b/.test(seg))
      return block('git reset --hard is banned (it wiped work repeatedly). Commit first, or git stash / git restore.');
    if (/^git\s+clean\b/.test(seg) && !/\.scratch/.test(seg))
      return block('git clean without a .scratch path is banned — it wipes untracked work. Scope it: git clean -fdq .scratch');
    if (/^git\s+clean\b/.test(seg) && /-[a-z]*x/i.test(seg))
      return block('git clean -x is banned (removes gitignored files too).');
    if (/^git\s+push\b/.test(seg) && /(--force|-f)\b/.test(seg))
      return block('force-push is banned.');
    if (/^(rm|mv|cp|cat)\b.*\.git\//.test(seg) || /[>]\s*\.git\//.test(seg))
      return block('writing inside .git/ is banned.');
  }
});
