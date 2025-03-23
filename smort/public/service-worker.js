
const assetsToCache = ["/", "/index.html", "/favicon.ico"];
const CACHE_NAME = "v1";

self.addEventListener("install", (event) => {

    console.log("Service Worker installing...");
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Caching assets...");
            return cache.addAll(assetsToCache);
        })
    );
});

self.addEventListener("push", (event) => {
    const data = event.data ? event.data.json() : {};
    console.log("Push received:", data);
  
    self.registration.showNotification(data.title || "New Notification", {
      body: data.body || "You have a new message!",
      icon: "/favicon.ico",
    });
  });

  self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SHOW_NOTIFICATION") {
      console.log("Service Worker: Showing notification", event.data.message);
  
      self.registration.showNotification("New Notification", {
        body: event.data.message,
        icon: "/favicon.ico",
      });
    }
  });
  

self.addEventListener("activate", (event) => {
    console.log("Service Worker activated");
    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log("Clearing old cache...");
                        return caches.delete(cache);
                    }
                })
            )
        )
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => response || fetch(event.request))
    );
});
