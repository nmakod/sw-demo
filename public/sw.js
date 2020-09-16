var CACHE_VERSION = 2;
var CURRENT_CACHES = {
  site: "my-site-cache-v" + CACHE_VERSION,
  siteJs: "my-site-js-v" + CACHE_VERSION,
};
const OFFLINE_URL = "./offline.html";

var urlsToCache = ["/", OFFLINE_URL];

// Install SW
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CURRENT_CACHES.site).then(function (cache) {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate
self.addEventListener("activate", function (event) {
  var expectedCacheNamesSet = new Set(Object.values(CURRENT_CACHES));

  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (!expectedCacheNamesSet.has(cacheName)) {
            // If this cache name isn't present in the set of "expected" cache names, then delete it.
            console.log("Deleting out of date cache:", cacheName);
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    })
  );
});

self.addEventListener("fetch", function (event) {
  console.log("Handling fetch event for", event.request.url);

  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }

          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          // catch is only triggered if an exception is thrown, which is likely
          // due to a network error.
          // If fetch() returns a valid HTTP response with a response code in
          // the 4xx or 5xx range, the catch() will NOT be called.
          console.log("Fetch failed; returning offline page instead.", error);

          const cache = await caches.open(CURRENT_CACHES.site);
          const cachedResponse = await cache.match(OFFLINE_URL);
          return cachedResponse;
        }
      })()
    );
  }
  event.respondWith(
    caches.open(CURRENT_CACHES.siteJs).then(function (cache) {
      return cache
        .match(event.request)
        .then(function (response) {
          if (response) {
            console.log(" Found response in cache:", response);
            return response;
          }
          console.log(
            `No response for %s found in cache. About to fetch
              from network...`
          );
          return fetch(event.request.clone()).then(function (response) {
            console.log(" Response for %s from network is: %O");
            if (response.status < 400) {
              console.log("Caching the response to", event.request.url);
              cache.put(event.request, response.clone());
            }
            // Return the original response object, which will be used to fulfill the resource request.
            return response;
          });
        })
        .catch(async (error) => {
          console.error("  Read-through caching failed:", error);
          throw error;
        });
    })
  );
});
