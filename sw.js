const CACHE_NAME = 'cliquez-v1;
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/sw.js',
  '/asset/192.png',
  '/asset/512.png',
  '/asset/1024.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(k => { if(k !== CACHE_NAME) return caches.delete(k); })
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  if(request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')){
    event.respondWith(
      fetch(request).then(r => {
        const copy = r.clone();
        caches.open(CACHE_NAME).then(c => c.put(request, copy));
        return r;
      }).catch(() => caches.match('/index.html'))
    );
    return;
  }

  if(url.origin === location.origin){
    event.respondWith(
      caches.match(request).then(cached => cached || fetch(request).then(r => { 
        const copy = r.clone();
        caches.open(CACHE_NAME).then(c => c.put(request, copy));
        return r;
      }).catch(() => cached))
    );
    return;
  }

  event.respondWith(
    fetch(request).then(r => r).catch(() => caches.match(request))
  );
});

self.addEventListener('message', event => {
  if(event.data === 'skipWaiting') self.skipWaiting();
});
