const CACHE_NAME = "cache"
const CACHE_VERSION = "v1"

// @TODO inject collected views
const urlsToCache = ["index.html", "index2.html", "404.html"]

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(`${CACHE_NAME}-${CACHE_VERSION}`).then((cache) => cache.addAll(urlsToCache)))
})

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response
      }
      return fetch(event.request)
    }),
  )
})
