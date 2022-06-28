const CACHE_NAME = "pwa-cache-v2";
const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./favicon.ico",
    "./manifest.json",
    "./Resources/app-icon/icon_48x48.png",
    "./Resources/app-icon/icon_128x128.png",
    "./Resources/app-icon/icon_256x256.png",
    "./Resources/app-icon/icon_512x512.png",
    "./Resources/app-icon/icon_640x640.png",
    "./build/bundle.css",
    "./build/bundle.js",
    "./build/worker.js",
];
// REFERENCE: https://github.com/tretapey/svelte-pwa/blob/master/public/service-worker.js
self.addEventListener('install', (evt) => {
    // console.log('[ServiceWorker] Install');
    evt.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            // console.log('[ServiceWorker] Pre-caching offline page');
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
});
  
self.addEventListener('activate', (evt) => {
    // console.log('[ServiceWorker] Activating...');
    // Remove previous cached data from disk.
    evt.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                // console.log('[ServiceWorker] Removing old cache', key);
                return caches.delete(key);
                }
            }));
        })
    );
  
    self.clients.claim();
});
  
self.addEventListener('fetch', (evt) => {
    // console.log('[ServiceWorker] Fetch', evt.request.url);
    if (evt.request.mode !== 'navigate') return;
    evt.respondWith(
        fetch(evt.request).catch((e) => {
            console.log(e);
            return caches.open(CACHE_NAME).then((cache) => {
                return cache.match(evt.request.url);
            });
        })
    );
});