# 🔒 Medidas de Seguridad Implementadas

## Descripción General
Este documento describe las medidas de seguridad implementadas en el sitio web para proteger contra acceso no autorizado a las herramientas de desarrollador y otros ataques comunes.

---

## 🛡️ Medidas de Protección Implementadas

### 1. **Bloqueo de Herramientas de Desarrollador**

#### Atajos de Teclado Bloqueados:
- `F12` - Abre DevTools (todos los navegadores)
- `Ctrl+Shift+I` - Abre Inspector (Chrome, Edge)
- `Ctrl+Shift+J` - Abre Consola (Chrome, Edge)
- `Ctrl+Shift+C` - Abre Inspector de Elemento (Chrome, Edge)
- `Ctrl+Shift+K` - Abre Consola (Firefox)
- `Ctrl+Shift+M` - DevTools en algunos navegadores
- `Cmd+Option+I` - DevTools (Safari/Mac)
- `Cmd+Option+U` - Ver fuente (Mac)

**Ubicación:** [script.js](script.js#L1) - Líneas 1-50

---

### 2. **Bloqueo de Menú Contextual**

Se desactiva el menú contextual (clic derecho) para evitar el acceso a "Inspeccionar elemento":

```javascript
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
});
```

**Ubicación:** [script.js](script.js#L50-L53)

---

### 3. **Detección de DevTools Abierto**

Sistema de monitoreo que detecta si DevTools está abierto comparando tamaños de ventana:

```javascript
setInterval(() => {
    const widthThreshold = window.outerWidth - window.innerWidth > 160;
    const heightThreshold = window.outerHeight - window.innerHeight > 160;
    
    if ((widthThreshold || heightThreshold) && !isDevToolsOpen) {
        isDevToolsOpen = true;
        console.clear();
        // Acción preventiva
    }
}, 500);
```

**Ubicación:** [script.js](script.js#L59-L70)

---

### 4. **Protección de Consola**

Se bloquean métodos de console para evitar debugging:

- `console.log` - Filtrado de mensajes sensibles
- `console.warn` - Bloqueado
- `console.error` - Bloqueado
- `console.info` - Bloqueado
- `console.debug` - Bloqueado
- `console.table` - Bloqueado
- `console.group` - Bloqueado

**Ubicación:** [script.js](script.js#L75-L95)

---

### 5. **Bloqueo de Function Constructor**

Previene el uso de `eval()` y `Function()` para ejecución de código dinámico:

```javascript
window.eval = undefined;
Function.prototype.constructor = function() {
    if (arguments[0] === 'return this') {
        return undefined;
    }
    return fn.apply(this, arguments);
};
```

**Ubicación:** [script.js](script.js#L97-L105)

---

### 6. **Bloqueo de Drag & Drop**

Previene copiar elementos HTML mediante arrastrar:

```javascript
document.addEventListener('dragstart', (e) => {
    e.preventDefault();
    return false;
});
```

**Ubicación:** [script.js](script.js#L118-L122)

---

### 7. **Headers de Seguridad HTTP**

Implementados en todas las páginas HTML mediante meta tags:

#### **Content-Security-Policy (CSP)**
- Restringe recursos a origen (`'self'`)
- Solo scripts internos
- Protección contra inyección de código

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; ...">
```

#### **X-Frame-Options**
- Previene clickjacking
- Impide embeber la página en iframes

```html
<meta http-equiv="X-Frame-Options" content="DENY">
```

#### **X-Content-Type-Options**
- Protección contra MIME-type sniffing
- Previene ejecución de scripts

```html
<meta http-equiv="X-Content-Type-Options" content="nosniff">
```

#### **Referrer-Policy**
- No envía referrer a otros sitios
- Protege privacidad

```html
<meta name="referrer" content="no-referrer">
```

#### **Permissions-Policy**
- Deshabilita características potencialmente peligrosas:
  - Acelerómetro
  - Cámara
  - Geolocalización
  - Giroscopio
  - Magnetómetro
  - Micrófono
  - Pagos
  - USB

```html
<meta name="permissions-policy" content="accelerometer=(), camera=(), ...">
```

**Ubicación:** Todas las páginas HTML

---

## 📄 Archivos Modificados

### JavaScript
- **[script.js](script.js)** - Lógica de seguridad (líneas 1-130)

### HTML
Todas las páginas con meta tags de seguridad:
- **[index.html](index.html)**
- **[quien-soy.html](quien-soy.html)**
- **[que-hago.html](que-hago.html)**
- **[contacto.html](contacto.html)**
- **[404.html](404.html)**

---

## ⚠️ Limitaciones Conocidas

1. **No es a prueba de expertos:** Un usuario con suficiente conocimiento puede eludir estas medidas
2. **Dependencia del JavaScript:** Si JavaScript está deshabilitado, estas protecciones no funcionan
3. **Acceso al código fuente:** El HTML/CSS/JS sigue siendo accesible (esto es normal en web)
4. **Métodos alternativos:** Existen herramientas especializadas que pueden eludir estas protecciones

---

## 🎯 Objetivo

Estas medidas están diseñadas para:
- **Disuadir** a usuarios casuales de inspeccionar el código
- **Proteger** información sensible del sitio
- **Aumentar** la seguridad general del sitio
- **Prevenir** ataques comunes (XSS, Clickjacking, etc.)

---

## 📋 Buenas Prácticas Adicionales

Para mayor seguridad en producción:

1. **HTTPS obligatorio** - Encriptar en tránsito
2. **HSTS headers** - Forzar HTTPS
3. **Validación servidor** - Nunca confiar solo en cliente
4. **Rate limiting** - Limitar intentos de acceso
5. **WAF** - Firewall de aplicación web
6. **Monitoreo** - Detectar intentos de ataque
7. **Actualizaciones** - Mantener dependencias actualizadas

---

## 🔧 Mantenimiento

Revisar periódicamente:
- ✅ Nuevas técnicas de evasión
- ✅ Actualizaciones de navegadores
- ✅ Nuevas vulnerabilidades
- ✅ Logs de acceso

---

**Última actualización:** 22 de enero de 2026
