/* ==========================================
   ADRIEL DIEGO - JAVASCRIPT PRINCIPAL
   ========================================== */

/* ========================================
   PROTECCIÓN Y SEGURIDAD
   ======================================== */

/**
 * BLOQUEO DE HERRAMIENTAS DE DESARROLLADOR
 * Previene el acceso a DevTools mediante atajos de teclado
 */
document.addEventListener('keydown', (e) => {
    // F12 - Abre DevTools
    if (e.key === 'F12') {
        e.preventDefault();
        return false;
    }
    
    // Ctrl+Shift+I - Abre Inspector (Chrome, Edge)
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
    }
    
    // Ctrl+Shift+J - Abre Consola (Chrome, Edge)
    if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        return false;
    }
    
    // Ctrl+Shift+C - Abre Elemento Inspector (Chrome, Edge)
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        return false;
    }
    
    // Ctrl+Shift+K - Abre Consola (Firefox)
    if (e.ctrlKey && e.shiftKey && e.key === 'K') {
        e.preventDefault();
        return false;
    }
    
    // Ctrl+Shift+M - Abre DevTools en algunos navegadores
    if (e.ctrlKey && e.shiftKey && e.key === 'M') {
        e.preventDefault();
        return false;
    }
    
    // Cmd+Option+I - Abre DevTools (Safari/Mac)
    if (e.metaKey && e.altKey && e.key === 'i') {
        e.preventDefault();
        return false;
    }
    
    // Cmd+Option+U - Ver fuente (Mac)
    if (e.metaKey && e.altKey && e.key === 'u') {
        e.preventDefault();
        return false;
    }
    
    // Ctrl+U - Ver fuente de página (Windows/Linux)
    if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        return false;
    }
    
    // Ctrl+Shift+U - Ver fuente de página (Firefox)
    if (e.ctrlKey && e.shiftKey && e.key === 'u') {
        e.preventDefault();
        return false;
    }
    
    // Cmd+U - Ver fuente (Mac)
    if (e.metaKey && e.key === 'u') {
        e.preventDefault();
        return false;
    }
    
    // Cmd+Option+J - Abre Consola (Mac)
    if (e.metaKey && e.altKey && e.key === 'j') {
        e.preventDefault();
        return false;
    }
    
    // Ctrl+Alt+U - Ver fuente (alternativo)
    if (e.ctrlKey && e.altKey && e.key === 'u') {
        e.preventDefault();
        return false;
    }
}, true); // Usar captura para interceptar antes
});

/**
 * Bloquear clic derecho (Menú contextual)
 * Previene el acceso al menú de inspeccionar elemento
 */
// Bloquear en documento entero
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
}, true); // Usar captura para interceptar antes

// Bloquear también en window
window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
}, true);

// Bloquear en todos los elementos
document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }, true);
});

/**
 * Detectar si DevTools está abierto por diferencia de tamaño
 * Se ejecuta periódicamente para monitorear
 */
let isDevToolsOpen = false;
setInterval(() => {
    const widthThreshold = window.outerWidth - window.innerWidth > 160;
    const heightThreshold = window.outerHeight - window.innerHeight > 160;
    
    if ((widthThreshold || heightThreshold) && !isDevToolsOpen) {
        isDevToolsOpen = true;
        console.clear();
        // Redirigir a página de error o blank
        // window.location.href = 'about:blank';
    } else if (!widthThreshold && !heightThreshold && isDevToolsOpen) {
        isDevToolsOpen = false;
    }
}, 500);

/**
 * Protección contra herramientas de debugging avanzadas
 * Bloquea console methods para dificultar el debugging
 */
const blockConsole = () => {
    // Mantener console.log para propósitos de desarrollo, pero advertir
    const originalLog = console.log;
    console.log = function(...args) {
        if (args[0]?.includes?.('DEBUG') || args[0]?.includes?.('TEST')) {
            return;
        }
        // Permitir algunos logs pero advertir
    };
    
    // Bloquear acceso a propiedades sensibles
    console.warn = () => {};
    console.error = () => {};
    console.info = () => {};
    console.debug = () => {};
};

blockConsole();

/**
 * Prevenir acceso directo a métodos peligrosos
 */
window.eval = undefined;
(function() {
    const fn = Function.prototype.constructor;
    Function.prototype.constructor = function() {
        if (arguments[0] === 'return this') {
            return undefined;
        }
        return fn.apply(this, arguments);
    };
})();

/**
 * Protección contra inspección de código fuente
 * Monitorea intentos de acceso al DOM
 */
Object.defineProperty(window, 'devtools', {
    get() {
        throw new Error('No puedes acceder a esto');
    }
});

/**
 * Bloquear acceso a propiedades de depuración
 */
Object.defineProperty(window, 'chrome', {
    get() {
        if (window.outerHeight - window.innerHeight > 160) {
            return undefined;
        }
        return window.chrome;
    }
});

/**
 * Desactivar eventos de arrastrar elementos (para copiar HTML)
 */
document.addEventListener('dragstart', (e) => {
    e.preventDefault();
    return false;
});

/**
 * Desactivar selección de texto en elementos críticos
 */
document.addEventListener('selectstart', (e) => {
    // Permitir selección normal pero bloquear en caso de DevTools detectado
    if (isDevToolsOpen) {
        e.preventDefault();
        return false;
    }
});

/**
 * Protección contra console hijacking
 * Intenta usar console devuelve una función nula
 */
const noop = () => {};
console.table = noop;
console.group = noop;
console.groupEnd = noop;
console.clear = noop;

/**
 * Ofuscación de datos sensibles del sitio
 * Inyecta marcas en el HTML para advertencia
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Agregar atributo de seguridad al documento
        document.documentElement.setAttribute('data-secured', 'true');
    });
} else {
    document.documentElement.setAttribute('data-secured', 'true');
}

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
   EFECTO COPOS DE NIEVE - NAVIDAD
   ======================================== */

/**
 * Función para verificar si debe mostrar copos de nieve
 * Se activa automáticamente el 1 de diciembre y se desactiva el 15 de enero
 * @returns {boolean} true si debe mostrar copos de nieve
 */
function shouldShowSnowflakes() {
    const today = new Date();
    const month = today.getMonth(); // 0-11 (0 = enero, 11 = diciembre)
    const day = today.getDate(); // 1-31
    
    // Mostrar desde 1 de diciembre hasta 14 de enero (inclusive)
    // Diciembre es mes 11, Enero es mes 0
    const isDecember = month === 11 && day >= 1;
    const isJanuary = month === 0 && day < 15;
    
    return isDecember || isJanuary;
}

/**
 * Crea un contenedor de copos de nieve y los anima cayendo
 * Se recrea en cada página y evita duplicados en la misma carga
 */
function initSnowflakes() {
    // Solo crear si es la temporada adecuada
    if (!shouldShowSnowflakes()) return;
    
    // Crear contenedor de copos si no existe
    if (document.getElementById('snowflakes-container')) return;
    
    const snowContainer = document.createElement('div');
    snowContainer.id = 'snowflakes-container';
    document.body.appendChild(snowContainer);
    
    /**
     * Crea un copo de nieve individual
     */
    function createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.textContent = '❄';
        
        // Posición horizontal aleatoria
        const randomX = Math.random() * window.innerWidth;
        snowflake.style.left = randomX + 'px';
        
        // Tamaño aleatorio para efecto de profundidad
        const randomSize = Math.random() * 1 + 0.5; // 0.5 a 1.5
        snowflake.style.fontSize = randomSize + 'rem';
        snowflake.style.opacity = randomSize * 0.8;
        
        // Duración aleatoria de la caída (5-15 segundos)
        const randomDuration = Math.random() * 10 + 5;
        snowflake.style.animationDuration = randomDuration + 's';
        
        // Velocidad de oscilación horizontal aleatoria
        const randomDelay = Math.random() * 5;
        snowflake.style.animationDelay = randomDelay + 's';
        
        snowContainer.appendChild(snowflake);
        
        // Remover copo después de que termine la animación
        setTimeout(() => {
            snowflake.remove();
        }, (randomDuration + randomDelay) * 1000);
    }
    
    // Crear copos inicialmente
    for (let i = 0; i < 50; i++) {
        setTimeout(() => createSnowflake(), i * 100);
    }
    
    // Crear nuevos copos continuamente
    setInterval(createSnowflake, 500);
}

// Inicializar copos de nieve cuando cargue el DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSnowflakes);
} else {
    initSnowflakes();
}

/* ========================================
   GORRO DE NAVIDAD - MODAL
   ======================================== */

/**
 * Función para verificar si debe mostrar el gorro de Navidad
 * Se activa el 1 de diciembre y se desactiva el 14 de enero
 * @returns {boolean} true si debe mostrar gorro
 */
function shouldShowChristmasHat() {
    const today = new Date();
    const month = today.getMonth(); // 0-11
    const day = today.getDate(); // 1-31
    
    // Mostrar desde 1 de diciembre hasta 14 de enero (inclusive)
    const isDecember = month === 11 && day >= 1;
    const isJanuary = month === 0 && day < 15;
    
    return isDecember || isJanuary;
}

/**
 * Agrega un gorro de Navidad en la esquina superior izquierda del modal
 */
function addChristmasHatToModal() {
    if (!shouldShowChristmasHat()) return;
    
    const macosWindow = document.getElementById('quien-soy-window');
    if (!macosWindow) return;
    
    // Verificar si ya existe el gorro
    if (document.getElementById('christmas-hat')) return;
    
    const hat = document.createElement('div');
    hat.id = 'christmas-hat';
    hat.className = 'christmas-hat';
    
    macosWindow.appendChild(hat);
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

// Variables de arrastre para la ventana modal
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

// Variable para guardar la posición del botón que abre el modal
let originButtonPosition = { x: 0, y: 0 };

/* ========================================
   MODAL - ABRIR/CERRAR
   ======================================== */

/**
 * Abre el modal al hacer clic en el enlace de "Quién soy"
 * Calcula la posición del botón para animar desde ahí
 */
quienSoyLink?.addEventListener('click', (e) => {
    e.preventDefault();
    // Obtener posición del botón para animación de origen
    const rect = e.target.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top;
    // Guardar la posición del botón para cerrar hacia él
    originButtonPosition = { x: originX, y: originY };
    // Establecer transform-origin en la ventana modal
    macosWindow.style.transformOrigin = `${originX}px ${originY}px`;
    quienSoyModal.classList.add('active');
});


/**
 * Función auxiliar para cerrar el modal con animación
 */
function closeModal() {
    if (!macosWindow || !quienSoyModal) return;
    macosWindow.style.transformOrigin = `${originButtonPosition.x}px ${originButtonPosition.y}px`;
    macosWindow.style.animation = 'popFromOrigin 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) reverse';
    setTimeout(() => {
        quienSoyModal.classList.remove('active');
        macosWindow.style.animation = 'popFromOrigin 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }, 300);
}

closeBtn?.addEventListener('click', closeModal);
quienSoyModal?.addEventListener('click', (e) => {
    if (e.target === quienSoyModal) closeModal();
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
    
    // Función auxiliar para abrir modal desde cualquier enlace
    function openModal(e) {
        e.preventDefault();
        if (!macosWindow || !quienSoyModal) return;
        const rect = e.target.getBoundingClientRect();
        const originX = rect.left + rect.width / 2;
        const originY = rect.top;
        originButtonPosition = { x: originX, y: originY };
        macosWindow.style.transformOrigin = `${originX}px ${originY}px`;
        quienSoyModal.classList.add('active');
    }
    
    // Marcar enlace activo y configurar modal
    document.querySelectorAll('.nav-item').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
        if (href === 'quien-soy.html') {
            link.addEventListener('click', openModal);
        }
    });
    
    // Botones especiales 404
    document.getElementById('error-quien-soy')?.addEventListener('click', openModal);
    document.getElementById('navbar-quien-soy')?.addEventListener('click', openModal);
    
    /* ========================================
       NAVEGACIÓN DE PÁGINAS
       ======================================== */
    
    /**
     * Navegación nativa sin interceptación ni animaciones
     * El navegador maneja el cambio de página de forma natural
     */
    // Los enlaces .html navegan directamente
    // Sin animaciones de transición
});



/* ========================================
   CAPTCHA MATEMÁTICO
   ======================================== */

/**
 * Sistema de CAPTCHA matemático simple
 * Genera preguntas de suma básicas para verificar que es un humano
 */

let captchaCorrectAnswer = 0;

/**
 * Genera una pregunta matemática aleatoria
 */
function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 10); // 0-9
    const num2 = Math.floor(Math.random() * 10); // 0-9
    captchaCorrectAnswer = num1 + num2;
    
    const questionElement = document.getElementById('captcha-question');
    const answerInput = document.getElementById('captcha-answer');
    
    if (questionElement && answerInput) {
        questionElement.textContent = `Resuelve: ${num1} + ${num2} = ?`;
        answerInput.value = '';
        answerInput.focus();
    }
}

// Generar CAPTCHA al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    generateCaptcha();
});

// Botón para generar nuevo CAPTCHA
const captchaRefresh = document.getElementById('captcha-refresh');
if (captchaRefresh) {
    captchaRefresh.addEventListener('click', (e) => {
        e.preventDefault();
        generateCaptcha();
    });
}

/* ========================================
   FORMULARIO DE CONTACTO
   ======================================== */

/**
 * Maneja el envío del formulario de contacto
 * Usa Formspree como servicio backend para recibir emails
 */
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const formMessage = document.getElementById('form-message');
const captchaInput = document.getElementById('captcha-answer');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Verificar que el CAPTCHA esté correcto
        const userAnswer = parseInt(captchaInput.value);
        if (userAnswer !== captchaCorrectAnswer) {
            formMessage.style.display = 'block';
            formMessage.style.color = '#ff3b30';
            formMessage.textContent = 'La respuesta del CAPTCHA es incorrecta. Por favor intenta de nuevo.';
            generateCaptcha(); // Generar nuevo CAPTCHA
            return;
        }
        
        // Deshabilitar botón mientras se envía
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.5';
        submitBtn.textContent = 'Enviando...';
        
        // Obtener valores del formulario
        const nombre = contactForm.nombre.value;
        const email = contactForm.email.value;
        const mensaje = contactForm.mensaje.value;
        
        // Crear JSON con los datos (Formspree soporta JSON)
        const formData = {
            nombre: nombre,
            email: email,
            mensaje: mensaje
        };
        
        try {
            // Enviar a Formspree con JSON
            const response = await fetch(contactForm.action, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                // Mensaje de éxito
                formMessage.style.display = 'block';
                formMessage.style.color = '#27c93f';
                formMessage.textContent = '¡Mensaje enviado correctamente! Te responderé pronto.';
                
                // Limpiar formulario
                contactForm.reset();
                
                // Generar nuevo CAPTCHA
                generateCaptcha();
                
                // Remover mensaje después de 5 segundos
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            } else {
                // Intentar leer mensaje de error de Formspree
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Error al enviar');
            }
        } catch (error) {
            // Mensaje de error
            formMessage.style.display = 'block';
            formMessage.style.color = '#ff3b30';
            formMessage.textContent = 'Hubo un error al enviar el mensaje. Por favor intenta de nuevo.';
            console.error('Error de formulario:', error);
            
            // Generar nuevo CAPTCHA en caso de error
            generateCaptcha();
        } finally {
            // Restaurar botón
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.textContent = 'Enviar mensaje';
        }
    });
}
/* ========================================
   CARGA DE PROYECTOS - SECCIÓN QUÉ HAGO
   ======================================== */

/**
 * Carga los proyectos desde projects.json y los renderiza en la página
 * Solo se ejecuta si existe el contenedor de proyectos
 * Si no hay proyectos publicados, oculta la sección
 */
async function loadProjects() {
    const projectsContainer = document.getElementById('projects-container');
    
    // Si no existe el contenedor, no hay proyectos en esta página
    if (!projectsContainer) return;
    
    try {
        // Cargar el archivo JSON de proyectos
        const response = await fetch('projects/projects.json?v=1.0.0');
        
        if (!response.ok) {
            console.error('Error al cargar proyectos:', response.statusText);
            return;
        }
        
        const data = await response.json();
        const projects = data.projects;
        
        // Limpiar contenedor
        projectsContainer.innerHTML = '';
        
        // Filtrar solo proyectos publicados (published === true)
        const publishedProjects = projects.filter(project => project.published !== false);
        
        // Si no hay proyectos publicados, ocultar la sección completa
        const proyectosSection = document.getElementById('proyectos');
        if (publishedProjects.length === 0) {
            if (proyectosSection) {
                proyectosSection.style.display = 'none';
            }
            return;
        }
        
        // Si hay proyectos, asegurar que la sección esté visible
        if (proyectosSection) {
            proyectosSection.style.display = 'block';
        }
        
        // Crear una tarjeta para cada proyecto publicado
        publishedProjects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.style.setProperty('--bg-image', `url('${project.image}')`);
            
            projectCard.innerHTML = `
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                </div>
            `;
            
            // Navegar a la página de detalle al hacer clic
            projectCard.addEventListener('click', () => {
                window.location.href = `projects/detalle.html?id=${encodeURIComponent(project.id)}`;
            });
            
            projectsContainer.appendChild(projectCard);
        });
    } catch (error) {
        console.error('Error al cargar proyectos:', error);
        projectsContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #999;">Error al cargar proyectos</p>';
    }
}

/**
 * Ejecutar carga de proyectos cuando esté listo el DOM
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadProjects);
} else {
    loadProjects();
}

/* ========================================
   DETALLE DE PROYECTO - PÁGINA INDIVIDUAL
   ======================================== */

/**
 * Carga el detalle de un proyecto usando el parámetro ?id=
 * Rellena título, descripción e imagen de portada
 */
async function loadProjectDetail() {
    const titleEl = document.getElementById('project-title');
    const descEl = document.getElementById('project-description');
    const heroEl = document.getElementById('project-hero');
    const bodyEl = document.getElementById('project-body-content');
    
    // Si no estamos en una página de detalle, salir
    if (!titleEl || !descEl || !heroEl) return;
    
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('id');
    if (!projectId) {
        titleEl.textContent = 'Proyecto no especificado';
        descEl.textContent = 'No se ha proporcionado un identificador de proyecto.';
        return;
    }
    
    try {
        const response = await fetch('../projects/projects.json?v=1.0.0');
        if (!response.ok) throw new Error('No se pudo cargar el listado de proyectos');
        const data = await response.json();
        const project = (data.projects || []).find(p => p.id === projectId);
        
        if (!project || project.published === false) {
            titleEl.textContent = 'Proyecto no encontrado';
            descEl.textContent = 'El proyecto solicitado no existe o no está publicado.';
            return;
        }
        
        // Rellenar contenido principal
        titleEl.textContent = project.title;
        descEl.textContent = project.description;
        heroEl.style.backgroundImage = `url('${project.image}')`;

        // Cargar contenido rico (HTML) si existe
        if (bodyEl) {
            const contentPath = project.content || `/projects/content/${project.id}.html`;
            try {
                const contentResp = await fetch(contentPath + `?v=1.0.0`);
                if (contentResp.ok) {
                    const html = await contentResp.text();
                    bodyEl.innerHTML = html;
                } else {
                    bodyEl.textContent = '';
                }
            } catch (e) {
                bodyEl.textContent = '';
            }
        }
    } catch (err) {
        titleEl.textContent = 'Error al cargar el proyecto';
        descEl.textContent = 'Intenta recargar la página más tarde.';
        console.error('Detalle de proyecto:', err);
    }
}

// Ejecutar carga de detalle si aplica
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadProjectDetail);
} else {
    loadProjectDetail();
}