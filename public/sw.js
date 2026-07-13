const CACHE_NAME = "matteolullo-it-v6";
const PRECACHE_URLS = [
  "/",
  "/200.html",
  "/404.html",
  "/favicon.ico",
  "/img/bg-r.jpg",
  "/img/io-def.png",
  "/img/io-corporate.jpeg",
  "/img/beyblade-silhouette.png",
  "/doc/Matteo_Lullo_CV.pdf",
  "/doc/ENG_Matteo_Lullo_CV.pdf",
  "/prj/",
];

const isHttpRequest = (request) =>
  request.url.startsWith("http://") || request.url.startsWith("https://");

const isRuntimeAsset = (request) => {
  const url = new URL(request.url);

  return (
    url.pathname.startsWith("/_nuxt/") ||
    url.pathname.startsWith("/__nuxt") ||
    url.pathname.startsWith("/@vite") ||
    url.pathname.includes("/@fs/")
  );
};

const putInCache = async (request, response) => {
  if (!response || response.status >= 400) {
    return;
  }

  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response.clone());
};

const networkFirstNavigation = async (request) => {
  try {
    const response = await fetch(request);
    await putInCache(request, response);
    return response;
  } catch {
    const cache = await caches.open(CACHE_NAME);
    return (
      (await cache.match(request)) ||
      (await cache.match("/")) ||
      (await cache.match("/200.html"))
    );
  }
};

const staleWhileRevalidate = async (request) => {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  const networkResponsePromise = fetch(request)
    .then((response) => {
      if (request.method === "GET") {
        cache.put(request, response.clone());
      }

      return response;
    })
    .catch(
      () =>
        new Response("", {
          status: 503,
          statusText: "Offline",
        }),
    );

  return cachedResponse || networkResponsePromise;
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.allSettled(
        PRECACHE_URLS.map((url) =>
          fetch(url)
            .then((response) => {
              if (response.ok) {
                return cache.put(url, response);
              }

              return undefined;
            })
            .catch(() => undefined),
        ),
      );

      return self.skipWaiting();
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET" || !isHttpRequest(request)) {
    return;
  }

  if (isRuntimeAsset(request)) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  event.respondWith(staleWhileRevalidate(request));
});
