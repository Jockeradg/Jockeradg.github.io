// Registro del Service Worker para caching
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
}

// Modal Quién Soy - Funcionalidad
const quienSoyLink = document.getElementById('quien-soy-link');
const quienSoyModal = document.getElementById('quien-soy-modal');
const closeBtn = document.getElementById('close-btn');
const windowTitlebar = document.querySelector('.window-titlebar');
const macosWindow = document.getElementById('quien-soy-window');
const banner = document.querySelector('.banner');

let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

// Abrir modal al hacer clic en el enlace
quienSoyLink?.addEventListener('click', (e) => {
    e.preventDefault();
    quienSoyModal.classList.add('active');
});

// Abrir modal al hacer clic en el banner
banner?.addEventListener('click', () => {
    quienSoyModal.classList.add('active');
});

// Cerrar modal con botón rojo
closeBtn?.addEventListener('click', () => {
    quienSoyModal.classList.remove('active');
});

// Cerrar modal al hacer clic fuera
quienSoyModal?.addEventListener('click', (e) => {
    if (e.target === quienSoyModal) {
        quienSoyModal.classList.remove('active');
    }
});

// Arrastre de ventana
windowTitlebar?.addEventListener('mousedown', (e) => {
    isDragging = true;
    dragOffsetX = e.clientX - macosWindow.offsetLeft;
    dragOffsetY = e.clientY - macosWindow.offsetTop;
});

document.addEventListener('mousemove', (e) => {
    if (isDragging && macosWindow) {
        macosWindow.style.position = 'fixed';
        macosWindow.style.left = (e.clientX - dragOffsetX) + 'px';
        macosWindow.style.top = (e.clientY - dragOffsetY) + 'px';
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

// Marcar el enlace activo en el navbar
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    document.querySelectorAll('.nav-item').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
        
        // Si es el enlace de "Quién soy", añadir listener para abrir modal
        if (href === 'quien-soy.html') {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                quienSoyModal.classList.add('active');
            });
        }
    });
    
    document.body.classList.remove('fade-out');
    
    // Interceptar clics en enlaces internos
    document.querySelectorAll('a[href$=".html"]').forEach(link => {
        const href = link.getAttribute('href');
        
        // No interceptar el enlace de "Quién soy" si está en navbar
        if (href === 'quien-soy.html' && link.classList.contains('nav-item')) {
            return;
        }
        
        link.addEventListener('click', (e) => {
            // Excluir enlaces externos o con atributos especiales
            if (!href.startsWith('#') && !link.target) {
                e.preventDefault();
                
                document.body.classList.add('fade-out');
                
                setTimeout(() => {
                    window.location.href = href;
                }, 500);
            }
        });
    });
});

// Deshabilitar clic derecho
document.addEventListener('contextmenu', (e) => e.preventDefault());

// Deshabilitar F12, F11, Ctrl+Shift+I, Ctrl+Shift+C, Ctrl+U
document.addEventListener('keydown', (e) => {
    if (e.key === 'F12' || e.key === 'F11' || 
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'u')) {
        e.preventDefault();
    }
});

// Detectar apertura de herramientas de desarrollo
const devtools = { open: false, orientation: null };

const threshold = 160;
setInterval(() => {
    if (window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold) {
        if (!devtools.open) {
            devtools.open = true;
            console.clear();
            console.log('%c¡Alto ahí!', 'color: red; font-size: 20px; font-weight: bold;');
            console.log('%cNo intentes inspeccionar el código.', 'color: red; font-size: 14px;');
        }
    } else {
        devtools.open = false;
    }
}, 500);
