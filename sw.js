const CACHE_NAME = 'pwa_demo';
const assetsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// Install event: cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Caching assets');
      return Promise.all(
        assetsToCache.map(asset => {
          return fetch(asset).then(response => {
            if (!response.ok) {
              throw new Error(`Failed to fetch ${asset}: ${response.status}`);
            }
            return cache.add(asset); // Cache each asset individually
          }).catch(error => {
            console.error('Failed to cache asset:', error);
          });
        })
      );
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

// Activate event: clear old caches if necessary
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

