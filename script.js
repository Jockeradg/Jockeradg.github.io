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
 * Persiste entre navegaciones usando sessionStorage
 */
function initSnowflakes() {
    // Solo crear si es la temporada adecuada
    if (!shouldShowSnowflakes()) return;
    
    // Verificar si ya se inicializó en esta sesión
    if (sessionStorage.getItem('snowflakes-initialized')) return;
    
    // Crear contenedor de copos si no existe
    if (document.getElementById('snowflakes-container')) return;
    
    const snowContainer = document.createElement('div');
    snowContainer.id = 'snowflakes-container';
    document.body.appendChild(snowContainer);
    
    // Marcar como inicializado en esta sesión
    sessionStorage.setItem('snowflakes-initialized', 'true');
    
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
    document.addEventListener('DOMContentLoaded', () => {
        initSnowflakes();
        addChristmasHatToModal();
    });
} else {
    initSnowflakes();
    addChristmasHatToModal();
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
    hat.textContent = '🎅';
    
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
 * Cierra el modal al hacer clic en el botón rojo (close-btn)
 * Anima de regreso hacia el botón de origen
 */
closeBtn?.addEventListener('click', () => {
    macosWindow.style.transformOrigin = `${originButtonPosition.x}px ${originButtonPosition.y}px`;
    macosWindow.style.animation = 'popFromOrigin 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) reverse';
    setTimeout(() => {
        quienSoyModal.classList.remove('active');
        macosWindow.style.animation = 'popFromOrigin 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }, 300);
});

/**
 * Cierra el modal al hacer clic en el overlay (área oscura detrás)
 * Anima de regreso hacia el botón de origen
 */
quienSoyModal?.addEventListener('click', (e) => {
    if (e.target === quienSoyModal) {
        macosWindow.style.transformOrigin = `${originButtonPosition.x}px ${originButtonPosition.y}px`;
        macosWindow.style.animation = 'popFromOrigin 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) reverse';
        setTimeout(() => {
            quienSoyModal.classList.remove('active');
            macosWindow.style.animation = 'popFromOrigin 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
        }, 300);
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
                // Obtener posición del botón para animación de origen
                const rect = e.target.getBoundingClientRect();
                const originX = rect.left + rect.width / 2;
                const originY = rect.top;
                // Guardar la posición del botón de origen
                originButtonPosition = { x: originX, y: originY };
                macosWindow.style.transformOrigin = `${originX}px ${originY}px`;
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
        const rect = e.target.getBoundingClientRect();
        const originX = rect.left + rect.width / 2;
        const originY = rect.top;
        // Guardar la posición del botón de origen
        originButtonPosition = { x: originX, y: originY };
        macosWindow.style.transformOrigin = `${originX}px ${originY}px`;
        quienSoyModal.classList.add('active');
    });
    
    // Abrir modal desde enlace de navbar específico
    navbarQuienSoy?.addEventListener('click', (e) => {
        e.preventDefault();
        const rect = e.target.getBoundingClientRect();
        const originX = rect.left + rect.width / 2;
        const originY = rect.top;
        // Guardar la posición del botón de origen
        originButtonPosition = { x: originX, y: originY };
        macosWindow.style.transformOrigin = `${originX}px ${originY}px`;
        quienSoyModal.classList.add('active');
    });
    
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
