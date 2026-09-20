const CACHE_NAME = "smort-v2";

const APP_SHELL = [
  "/",
  "/index.html",
  "/favicon.ico",
];

self.addEventListener("install", (event) => {

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL);
    })
  );

  // Activate the new service worker immediately
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {

  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
          return Promise.resolve();
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Don't cache bad responses
        if (!response || response.status !== 200) {
          return response;
        }

        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

messaging.onBackgroundMessage(function(payload) {
  const title = (payload.notification && payload.notification.title) || (payload.data && payload.data.title) || 'Background Notification';
  const options = {
    body: (payload.notification && payload.notification.body) || (payload.data && payload.data.body) || '',
    icon: '/favicon-192x192.png',
    badge: '/favicon-192x192.png'
  };
  self.registration.showNotification(title, options);
});

// Fallback: handle raw push events
self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'New Notification';
  const options = {
    body: data.body || '',
    icon: '/favicon-192x192.png',
    badge: '/favicon-192x192.png'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
