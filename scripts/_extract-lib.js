// Shared helper: pull the top-level `const NAME=...;` statements out of the
// app's inline <script> block using bracket-matching (safe for huge nested
// literals), then eval each one to get the real JS value.
const fs = require('fs');

function extractScriptBlock(html) {
  const start = html.indexOf('<script>');
  const end = html.lastIndexOf('</script>');
  if (start === -1 || end === -1) throw new Error('no <script> block found');
  return html.slice(start + '<script>'.length, end);
}

// Finds `const NAME=` and walks forward respecting (), [], {}, '' , "" , ``
// nesting to find the statement-ending top-level semicolon.
function grabConst(src, name) {
  const marker = `const ${name}=`;
  const at = src.indexOf(marker);
  if (at === -1) return null;
  let i = at + marker.length;
  let depth = 0;
  let inStr = null; // ', ", `
  let literalStart = i;
  for (; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (c === '\\') { i++; continue; }
      if (c === inStr) inStr = null;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') { inStr = c; continue; }
    if (c === '(' || c === '[' || c === '{') depth++;
    else if (c === ')' || c === ']' || c === '}') depth--;
    else if (c === ';' && depth === 0) break;
  }
  const literal = src.slice(literalStart, i);
  const value = new Function(`return (${literal});`)();
  return { name, literal, value };
}

module.exports = { extractScriptBlock, grabConst };
