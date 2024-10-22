const cacheName = 'pwa_demo';
const assetsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// Install event: cache all the assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('Caching assets');
      return cache.addAll(assetsToCache);
    })
  );
});

// Fetch event: serve cached assets if offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});

