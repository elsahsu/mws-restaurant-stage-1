const CACHE_NAME = 'rw-cache-v1';

self.addEventListener('install', function(event) {
  // TODO: cache /skeleton rather than the root page
  console.log("Saving static files to cache");
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll([
        '/',
        'js/main.js',
        'css/styles.css',
        'img/'
      ]);
    }).catch(function(error) {
        console.log('Failed to add files to cache');
        console.log(error);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      console.log('Fetching from cache');
      return response || fetch(event.request);
    })
  );
});
