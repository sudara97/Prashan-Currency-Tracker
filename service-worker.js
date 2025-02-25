const CACHE_NAME = "currency-tracker-v1";
const urlsToCache = [
    "/",
    "/index.html",
    "/manifest.json",
    "/service-worker.js",
    "/icon-192x192.png",
    "/icon-512x512.png"
];

// Install Service Worker and cache assets
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
            .then(self.skipWaiting())
    );
});

// Activate Service Worker and clean up old caches
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch data from cache or network with offline fallback
self.addEventListener("fetch", event => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request).then(response => {
                return response || new Response("<h1>You are offline</h1><p>Please check your internet connection.</p>", {
                    headers: { "Content-Type": "text/html" }
                });
            });
        })
    );
});
