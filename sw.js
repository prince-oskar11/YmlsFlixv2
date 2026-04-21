self.addEventListener('install', (event) => {
  // You can cache files here if needed
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  // Cleanup old caches if any
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // For now, just fetch normally
});
