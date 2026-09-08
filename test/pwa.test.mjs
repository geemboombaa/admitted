// Real checks on the PWA wiring — manifest is valid + installable-shaped, and the shell references
// the manifest, service worker, and icon. Catches a broken manifest or an unregistered SW.
// SCOPE: static wiring only. Runtime SW behavior (install/activate/fetch, network-first-vs-cache) is
// verified separately in a real browser at each checkpoint, not here.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const read = p => readFileSync(fileURLToPath(new URL(p, root)), 'utf8');

test('manifest.webmanifest is valid JSON with the required installable fields', () => {
  const m = JSON.parse(read('manifest.webmanifest'));
  assert.equal(m.display, 'standalone');
  assert.ok(m.name && m.short_name);
  assert.ok(m.start_url && m.start_url.includes('admitted.html'));
  assert.ok(Array.isArray(m.icons) && m.icons.length >= 1, 'needs at least one icon');
  assert.ok(m.icons[0].src.endsWith('.svg') || m.icons[0].src.endsWith('.png'));
  assert.equal(m.theme_color, '#0a0e14');
});

test('the app shell wires the manifest, icon, and service worker', () => {
  const html = read('admitted.html');
  assert.match(html, /rel="manifest" href="\.\/manifest\.webmanifest"/);
  assert.match(html, /rel="icon"[^>]*href="\.\/web\/icon\.svg"/);
  assert.match(html, /serviceWorker.*register\('\.\/sw\.js'\)/);
});

test('the service worker caches the real shell assets that exist on disk', () => {
  const sw = read('sw.js');
  for (const a of ['admitted.html', 'core/engine.mjs', 'core/tools.mjs', 'core/agent.mjs', 'web/render.mjs', 'web/schools.generated.mjs']) {
    assert.ok(sw.includes(a), `sw should cache ${a}`);
    read(a); // throws if the referenced asset does not exist
  }
});
