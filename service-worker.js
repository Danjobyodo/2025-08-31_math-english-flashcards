// キャッシュ名をユニークにし、バージョンを更新
const CACHE_NAME = 'math-english-flashcards-cache-v2';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192x192.png',
  './icon-512x512.png'
];

// インストール時にファイルをキャッシュする
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// fetchイベントでリクエストに介在し、キャッシュがあればそれを返す
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // キャッシュにヒットすれば、それを返す
        if (response) {
          return response;
        }
        // キャッシュになければ、ネットワークから取得する
        return fetch(event.request);
      })
  );
});

// activateイベントで古いキャッシュを削除する
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME]; // このアプリの新しいキャッシュ名のみを許可
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // ホワイトリストに含まれていないキャッシュ（古いキャッシュ）を削除
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

