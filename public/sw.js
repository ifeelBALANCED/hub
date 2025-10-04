self.addEventListener('install', (event) => {
  event.waitUntil(caches.open('static-v1').then((cache) => cache.addAll(['/', '/index.html'])))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => !['static-v1', 'api-v1'].includes(k)).map((k) => caches.delete(k)),
        ),
      ),
  )
  self.clients.claim()
})

const cacheFirst = async (request) => {
  const cache = await caches.open('static-v1')
  const cached = await cache.match(request)
  if (cached) return cached
  const response = await fetch(request)
  if (response.ok) cache.put(request, response.clone())
  return response
}

const staleWhileRevalidate = async (request) => {
  const cache = await caches.open('api-v1')
  const cached = await cache.match(request)
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone())
      return response
    })
    .catch(() => cached || Response.error())
  return cached || fetchPromise
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  if (request.method !== 'GET') return

  if (url.origin === self.location.origin) {
    if (
      url.pathname.startsWith('/assets/') ||
      url.pathname.endsWith('.css') ||
      url.pathname.endsWith('.js')
    ) {
      event.respondWith(cacheFirst(request))
      return
    }
  }

  if (url.pathname.startsWith('/v1/') || url.pathname.startsWith('/api/')) {
    event.respondWith(staleWhileRevalidate(request))
    return
  }
})
