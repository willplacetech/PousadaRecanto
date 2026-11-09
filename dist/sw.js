const CACHE = 'recanto-static-v1';
const STATIC = ['/offline.html', '/icons-recanto.svg', '/manifest.webmanifest'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(STATIC))));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('recanto-static-') && key !== CACHE).map(key => caches.delete(key))))));
self.addEventListener('fetch', event => {
  const request = event.request; const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.startsWith('/api/') || request.headers.has('Authorization')) return;
  if (request.mode === 'navigate') { event.respondWith(fetch(request).catch(() => caches.match('/offline.html'))); return; }
  if (STATIC.includes(url.pathname)) event.respondWith(caches.match(request).then(cached => cached || fetch(request)));
});
