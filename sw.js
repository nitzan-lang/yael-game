/* Offline helper: always try the internet first (so updates show up),
   and use the saved copy only when there is no connection. */
const CACHE = 'yael-game-v1';
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok) { const c = r.clone(); caches.open(CACHE).then(cc => cc.put(e.request, c)); }
      return r;
    }).catch(() => caches.match(e.request, {ignoreSearch: true}))
  );
});
