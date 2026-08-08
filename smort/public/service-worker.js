const CACHE_NAME = "smort-v2";

const APP_SHELL = [
  "/",
  "/index.html",
  "/favicon.ico",
];

self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL);
    })
  );

  // Activate the new service worker immediately
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activated");

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

self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};

  event.waitUntil(
    self.registration.showNotification(
      data.title || "New Notification",
      {
        body: data.body || "You have a new message!",
        icon: "/favicon-192x192.png",
        badge: "/favicon-192x192.png",
      }
    )
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SHOW_NOTIFICATION") {
    event.waitUntil(
      self.registration.showNotification("New Notification", {
        body: event.data.message,
        icon: "/favicon-192x192.png",
        badge: "/favicon-192x192.png",
      })
    );
  }
});