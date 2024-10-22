const CACHE_NAME = 'pwa_demo';
const assetsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/offline.html' // Add an offline page if you have one
];

// Install event: cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Caching assets');
      return cache.addAll(assetsToCache); // Cache all assets directly
    })
  );
});

// Fetch event: serve cached assets if offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request).catch(() => {
        // If the network request fails, serve the offline page
        return caches.match('/offline.html'); // Return your offline page if it exists
      });
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

