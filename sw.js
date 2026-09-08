// Service worker — network-first (fresh data when online), cache fallback (works offline + installable).
const CACHE = 'admitted-v1';
const ASSETS = [
  './admitted.html', './manifest.webmanifest', './web/icon.svg',
  './web/render.mjs', './web/schools.generated.mjs',
  './core/engine.mjs', './core/tools.mjs', './core/agent.mjs',
];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(() => {})); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp).catch(() => {})); return r; })
      .catch(() => caches.match(e.request))
  );
});
