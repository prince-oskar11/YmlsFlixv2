const CACHE_NAME = 'ymlanime-v2'; // Update cache version
const urlsToCache = [
  '/', // Root directory
  '/index.html', // Your main HTML file
  '/manifest.json', // Manifest file
  '/icon.png', // Icon
  // Add other static assets like CSS, JS, images if needed
  // Example:
  // '/styles.css',
  // '/app.js',
  // '/offline.html' // Optional offline fallback page
];

// Install event: cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching files on install:', urlsToCache);
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event: cleanup old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            console.log('Removing old cache:', name);
            return caches.delete(name);
          }
        })
      );
    })
  );
});

// Fetch event: serve cached files, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      }
      return fetch(event.request).catch(() => {
        // Optional: serve offline fallback page or image
        // if (event.request.mode === 'navigate') {
        //   return caches.match('/offline.html');
        // }
      });
    })
  );
});
