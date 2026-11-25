/* Offline helper: always ask the internet first (so updates show up at once),
   and use the saved copy only when there is no connection.
   25.11.2026: 'no-cache' makes the phone check GitHub every time, instead of
   using the phone's own 10-minute copy (GitHub Pages sends max-age=600). */
const CACHE = 'yael-game-v2';
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())
));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request, {cache: 'no-cache'}).then(r => {
      if (r.ok) { const c = r.clone(); caches.open(CACHE).then(cc => cc.put(e.request, c)); }
      return r;
    }).catch(() => caches.match(e.request, {ignoreSearch: true}))
  );
});
