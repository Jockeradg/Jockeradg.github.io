/* ==========================================
   ADRIEL DIEGO - SERVICE WORKER
   Maneja caching offline y updates inteligentes
   ========================================== */

/**
 * CACHE_NAME: Nombre único para identificar la versión del caché
 * Cambiar la versión aquí fuerza una nueva descarga de todos los archivos
 * Formato: 'nombre-v{major}.{minor}.{patch}'
 */
const CACHE_NAME = 'mi-pagina-v1.0.0';

/**
 * urlsToCache: Lista de URLs a cachear al instalar el Service Worker
 * Incluye todas las páginas HTML, estilos, y scripts necesarios
 * El navegador descargará todas estas URLs durante la instalación
 */
const urlsToCache = [
    '/',                    // Raíz del sitio
    '/index.html',          // Página de inicio
    '/quien-soy.html',      // Página "Sobre mí"
    '/que-hago.html',       // Página de servicios
    '/contacto.html',       // Página de contacto
    '/404.html',            // Página de error
    '/estilo.css?v=1.0.0',  // Hoja de estilos con versión
    '/script.js?v=1.0.0'    // Script principal con versión
];

/* ========================================
   EVENTO INSTALL - Descarga inicial
   ======================================== */

/**
 * El evento 'install' se dispara cuando el Service Worker se registra por primera vez
 * o cuando el archivo sw.js ha cambiado
 * 
 * Responsabilidades:
 * 1. Abre el caché con CACHE_NAME
 * 2. Descarga y cachea todos los URLs en urlsToCache
 * 3. Salta a activación si todo se completó (skipWaiting)
 */
self.addEventListener('install', (event) => {
    event.waitUntil(
        // Abre o crea el caché con el nombre actual
        caches.open(CACHE_NAME)
            .then((cache) => {
                // Añade todos los URLs al caché
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                // skipWaiting: Hace que este Service Worker se active inmediatamente
                // Sin esto, esperaría a que se cierre el cliente anterior
                return self.skipWaiting();
            })
    );
});

/* ========================================
   EVENTO ACTIVATE - Limpieza y activación
   ======================================== */

/**
 * El evento 'activate' se dispara cuando el Service Worker se activa
 * Responsabilidades:
 * 1. Borra cachés antiguos (versiones previas)
 * 2. Reclama todos los clientes (páginas) para usar este Service Worker
 * 
 * Esto es importante para actualizar correctamente cuando el usuario
 * incremente el número de versión en CACHE_NAME
 */
self.addEventListener('activate', (event) => {
    event.waitUntil(
        // Obtiene todos los nombres de cachés existentes
        caches.keys().then((cacheNames) => {
            // Mapea cada caché antiguo a una promesa de eliminación
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // Borra cualquier caché que no sea la versión actual
                    if (cacheName !== CACHE_NAME) {
                        console.log('Borrando caché antigua:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
        // Después de limpiar, reclama todos los clientes
        // Esto hace que todas las pestañas abiertas usen el nuevo Service Worker
        .then(() => self.clients.claim())
    );
});

/* ========================================
   EVENTO FETCH - Estrategia Network First
   ======================================== */

/**
 * El evento 'fetch' se dispara cuando la página intenta cargar un recurso
 * (HTML, CSS, JS, imágenes, etc.)
 * 
 * ESTRATEGIA NETWORK FIRST:
 * 1. Intenta obtener el recurso desde la red (siempre obtiene lo más reciente)
 * 2. Si la red funciona, cachea el resultado y lo devuelve
 * 3. Si la red falla, devuelve el recurso en caché
 * 4. Si el recurso no está en caché, devuelve una fallback (para HTML, index.html)
 * 
 * Esta estrategia es ideal para sitios que se actualizan frecuentemente
 * pero también necesitan funcionar offline
 */
self.addEventListener('fetch', (event) => {
    // Solo manejar solicitudes GET (ignorar POST, PUT, DELETE, etc.)
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        // Intenta obtener desde la red primero
        fetch(event.request)
            .then((response) => {
                // Validar que la respuesta sea válida y tenga éxito (status 200)
                if (response && response.status === 200 && response.type !== 'error') {
                    // Crear una copia de la respuesta para cachear
                    // (la respuesta original solo se puede usar una vez)
                    const responseToCache = response.clone();
                    
                    // Actualizar el caché con esta nueva respuesta
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                }
                
                // Devolver la respuesta original al cliente
                return response;
            })
            // Si la red falla, usar caché como fallback
            .catch(() => {
                return caches.match(event.request)
                    .then((response) => {
                        // Si encontramos el recurso en caché, devolverlo
                        if (response) {
                            return response;
                        }
                        
                        // Fallback especial para documentos HTML
                        // Si un documento no está en caché, devolver index.html
                        // (útil para rutas SPA o cuando la navegación falla)
                        if (event.request.destination === 'document') {
                            return caches.match('/index.html');
                        }
                    });
            })
    );
});

/* ========================================
   NOTAS DE ACTUALIZACIÓN
   ======================================== */

/**
 * Para forzar una actualización cuando cambies archivos:
 * 
 * 1. Incrementa la versión en CACHE_NAME:
 *    De: 'mi-pagina-v1.0.0'
 *    A:  'mi-pagina-v1.0.1'
 * 
 * 2. (Opcional) Incrementa los números de versión en script.js:
 *    <link rel="stylesheet" href="estilo.css?v=1.0.1">
 *    <script src="script.js?v=1.0.1"></script>
 * 
 * 3. Publica los cambios a GitHub Pages
 * 
 * 4. El Service Worker detectará el cambio en sw.js y se actualizará automáticamente
 * 
 * El archivo script.js ya contiene lógica para recargar la página
 * cuando detecta una actualización disponible
 */
