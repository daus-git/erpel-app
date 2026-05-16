self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('salon-app-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        '/icons/icon-192x192.png',
        '/icons/icon-512x512.png'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip cache for API requests
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // network-first for navigation and build assets (scripts/styles)
  if (request.mode === 'navigate' || request.destination === 'script' || request.destination === 'style') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // cache a copy for offline fallback
          const responseClone = response.clone();
          caches.open('salon-app-v1').then((cache) => cache.put(request, responseClone));
          return response;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match('/index.html')))
    );
    return;
  }

  // cache-first for other requests
  event.respondWith(
    caches.match(request).then((response) => response || fetch(request))
  );
});

