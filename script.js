/* ==========================================
   ADRIEL DIEGO - JAVASCRIPT PRINCIPAL
   ========================================== */

/* ========================================
   SERVICE WORKER REGISTRATION & UPDATES
   ======================================== */

/**
 * Registra el Service Worker para habilitar caching offline
 * y actualiza automáticamente el contenido cuando hay cambios
 */
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js?v=1.0.0').then((registration) => {
        // Verificar actualizaciones cada vez que se carga la página
        registration.update();
        
        // Listener para cuando se detecta una nueva versión
        registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
                // Si hay un nuevo Service Worker instalado y ya hay uno activo
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // Recargar la página para obtener la nueva versión
                    console.log('Nueva versión disponible. Actualizando...');
                    window.location.reload();
                }
            });
        });
    }).catch(() => {
        // Fallar silenciosamente si no se puede registrar
    });
}

/* ========================================
   ELEMENTOS DEL DOM - CACHE GLOBAL
   ======================================== */

// Enlaces y modal
const quienSoyLink = document.getElementById('quien-soy-link');
const quienSoyModal = document.getElementById('quien-soy-modal');
const closeBtn = document.getElementById('close-btn');
const windowTitlebar = document.querySelector('.window-titlebar');
const macosWindow = document.getElementById('quien-soy-window');
const banner = document.querySelector('.banner');

// Variables de arrastre para la ventana modal
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

/* ========================================
   MODAL - ABRIR/CERRAR
   ======================================== */

/**
 * Abre el modal al hacer clic en el enlace de "Quién soy"
 */
quienSoyLink?.addEventListener('click', (e) => {
    e.preventDefault();
    quienSoyModal.classList.add('active');
});

/**
 * Abre el modal al hacer clic en el banner (imagen/área principal)
 */
banner?.addEventListener('click', () => {
    quienSoyModal.classList.add('active');
});

/**
 * Cierra el modal al hacer clic en el botón rojo (close-btn)
 */
closeBtn?.addEventListener('click', () => {
    quienSoyModal.classList.remove('active');
});

/**
 * Cierra el modal al hacer clic en el overlay (área oscura detrás)
 * Solo se cierra si se hace clic directamente en el overlay
 */
quienSoyModal?.addEventListener('click', (e) => {
    if (e.target === quienSoyModal) {
        quienSoyModal.classList.remove('active');
    }
});

/* ========================================
   MODAL - ARRASTRE (DRAG) CON MOUSE & TOUCH
   ======================================== */

/**
 * Inicia el arrastre al presionar el mouse en la barra de título
 */
windowTitlebar?.addEventListener('mousedown', (e) => {
    isDragging = true;
    // Calcular offset: posición del mouse - posición actual de la ventana
    dragOffsetX = e.clientX - macosWindow.offsetLeft;
    dragOffsetY = e.clientY - macosWindow.offsetTop;
});

/**
 * Inicia el arrastre al tocar la barra de título en dispositivos táctiles
 */
windowTitlebar?.addEventListener('touchstart', (e) => {
    isDragging = true;
    const touch = e.touches[0];
    // Mismo cálculo que con mouse, pero usando coordenadas táctiles
    dragOffsetX = touch.clientX - macosWindow.offsetLeft;
    dragOffsetY = touch.clientY - macosWindow.offsetTop;
});

/**
 * Mueve la ventana mientras se arrastra con el mouse
 */
document.addEventListener('mousemove', (e) => {
    if (isDragging && macosWindow) {
        // Cambiar a posición fixed para permitir movimiento libre
        macosWindow.style.position = 'fixed';
        // Calcular nueva posición: posición actual del mouse - offset inicial
        macosWindow.style.left = (e.clientX - dragOffsetX) + 'px';
        macosWindow.style.top = (e.clientY - dragOffsetY) + 'px';
    }
});

/**
 * Mueve la ventana mientras se arrastra con los dedos
 * Usa { passive: false } para poder llamar preventDefault en el evento
 */
document.addEventListener('touchmove', (e) => {
    if (isDragging && macosWindow) {
        const touch = e.touches[0];
        // Mismo cálculo que mousemove, pero con coordenadas táctiles
        macosWindow.style.position = 'fixed';
        macosWindow.style.left = (touch.clientX - dragOffsetX) + 'px';
        macosWindow.style.top = (touch.clientY - dragOffsetY) + 'px';
    }
}, { passive: false });

/**
 * Detiene el arrastre al soltar el mouse
 */
document.addEventListener('mouseup', () => {
    isDragging = false;
});

/**
 * Detiene el arrastre al soltar los dedos
 */
document.addEventListener('touchend', () => {
    isDragging = false;
});

/* ========================================
   NAVBAR ACTIVO Y NAVEGACIÓN
   ======================================== */

/**
 * Se ejecuta cuando el DOM está completamente cargado
 * Marca el enlace actual como activo y configura listeners
 */
document.addEventListener('DOMContentLoaded', () => {
    // Obtener la página actual del pathname
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Marcar el enlace de navegación actual como activo
    document.querySelectorAll('.nav-item').forEach(link => {
        const href = link.getAttribute('href');
        
        // Comparar con la página actual
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
        
        // Configurar "Quién soy" en navbar para abrir modal en lugar de navegar
        if (href === 'quien-soy.html') {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                quienSoyModal.classList.add('active');
            });
        }
    });
    
    // Configurar botones especiales en página 404
    const errorQuienSoyLink = document.getElementById('error-quien-soy');
    const navbarQuienSoy = document.getElementById('navbar-quien-soy');
    
    // Abrir modal desde botón de "Quién soy" en error 404
    errorQuienSoyLink?.addEventListener('click', (e) => {
        e.preventDefault();
        quienSoyModal.classList.add('active');
    });
    
    // Abrir modal desde enlace de navbar específico
    navbarQuienSoy?.addEventListener('click', (e) => {
        e.preventDefault();
        quienSoyModal.classList.add('active');
    });
    
    // Remover la clase de fade-out cuando la página carga completamente
    document.body.classList.remove('fade-out');
    
    /* ========================================
       NAVEGACIÓN DE PÁGINAS CON TRANSICIONES
       ======================================== */
    
    /**
     * Intercepta clics en enlaces .html internos
     * Añade animación de transición suave antes de cambiar de página
     */
    document.querySelectorAll('a[href$=".html"]').forEach(link => {
        const href = link.getAttribute('href');
        
        // No interceptar el enlace "Quién soy" si está en el navbar
        // (porque abre el modal, no navega)
        if (href === 'quien-soy.html' && link.classList.contains('nav-item')) {
            return;
        }
        
        link.addEventListener('click', (e) => {
            // Solo interceptar enlaces internos sin atributos especiales
            if (!href.startsWith('#') && !link.target) {
                e.preventDefault();
                
                // Añadir clase para iniciar animación de desvanecimiento
                document.body.classList.add('fade-out');
                
                // Esperar 600ms (duración de la animación) antes de navegar
                setTimeout(() => {
                    window.location.href = href;
                }, 600);
            }
        });
    });
});

/* ========================================
   SEGURIDAD (Opcional - Deshabilitar DevTools)
   ======================================== */

/**
 * Desabilitar clic derecho (menú contextual)
 * Útil para proteger contenido pero puede afectar UX
 */
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
});

/**
 * Detectar y deshabilitar teclas de DevTools
 * F12, Ctrl+Shift+I, Ctrl+Shift+J, etc.
 */
document.addEventListener('keydown', (e) => {
    // F12 - DevTools
    if (e.key === 'F12') {
        e.preventDefault();
        return false;
    }
    // Ctrl+Shift+I - Inspector
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
    }
    // Ctrl+Shift+J - Consola
    if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        return false;
    }
    // Ctrl+Shift+C - Selector
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        return false;
    }
});
