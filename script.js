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
