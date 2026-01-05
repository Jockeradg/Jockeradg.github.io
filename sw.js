const CACHE_NAME = 'mi-pagina-v1.0.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/quien-soy.html',
    '/que-hago.html',
    '/contacto.html',
    '/404.html',
    '/estilo.css',
    '/script.js'
];

// Instalar el Service Worker y cachear archivos
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
            .then(() => self.skipWaiting())
    );
});

// Activar el Service Worker y borrar cachés antiguos
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // Borrar cualquier caché que no sea la versión actual
                    if (cacheName !== CACHE_NAME) {
                        console.log('Borrando caché antigua:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Interceptar peticiones con estrategia Network First
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        // Estrategia: Intentar red primero, caché como fallback
        fetch(event.request)
            .then((response) => {
                // Si la respuesta es válida, actualizar caché
                if (response && response.status === 200 && response.type !== 'error') {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then((cache) => cache.put(event.request, responseToCache));
                }
                return response;
            })
            .catch(() => {
                // Si falla la red, usar caché
                return caches.match(event.request)
                    .then((response) => {
                        if (response) {
                            return response;
                        }
                        // Fallback para archivos HTML
                        if (event.request.destination === 'document') {
                            return caches.match('/index.html');
                        }
                    });
            })
    );
});
