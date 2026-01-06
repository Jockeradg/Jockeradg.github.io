# Sistema de Proyectos - Guía de Uso

## 📁 Estructura de Carpetas

```
Jockeradg.github.io/
├── projects/
│   ├── projects.json          ← Archivo JSON con datos de proyectos
│   └── README.md              ← Este archivo
└── images/
    └── projects/
        ├── proyecto-1.jpg     ← Imágenes de proyectos (ancho: 600px, alto: 400px)
        ├── proyecto-2.jpg
        ├── proyecto-3.jpg
        └── proyecto-4.jpg
```

## 🎨 Cómo Agregar Nuevos Proyectos

### Paso 1: Preparar la Imagen
1. Coloca tu imagen en la carpeta `images/projects/`
2. **Recomendación de tamaño**: 600px × 400px (ratio 3:2)
3. Formato: JPG, PNG o WebP

### Paso 2: Editar el JSON
Abre `projects/projects.json` y agrega un nuevo objeto al array `projects`:

```json
{
  "id": "nombre-unico-proyecto",
  "title": "Título del Proyecto",
  "description": "Descripción breve del proyecto",
  "image": "../images/projects/nombre-imagen.jpg"
}
```

### Ejemplo Completo:
```json
{
  "projects": [
    {
      "id": "mi-app-web",
      "title": "Mi Aplicación Web",
      "description": "Una aplicación web interactiva con React y Node.js",
      "image": "../images/projects/mi-app-web.jpg",
      "published": true
    },
    {
      "id": "diseño-ux",
      "title": "Rediseño de UX",
      "description": "Nuevo diseño de interfaz para aplicación de escritorio",
      "image": "../images/projects/diseño-ux.jpg",
      "published": false
    }
  ]
}
```

## 📝 Campos Requeridos

| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| **id** | Identificador único (sin espacios) | `proyecto-importante` |
| **title** | Título mostrado en la tarjeta | `Mi Proyecto Increíble` |
| **description** | Descripción breve (1-2 líneas) | `Una app moderna y funcional` |
| **image** | Ruta a la imagen desde projects.json | `../images/projects/mi-imagen.jpg` |
| **published** | Mostrar proyecto en web (true/false) | `true` o `false` |

## 📖 Campo "published"

El campo `published` controla si un proyecto se muestra en la web:

- `"published": true` → El proyecto se muestra en que-hago.html
- `"published": false` → El proyecto se oculta (no aparece en la web)

**Uso común:**
- Proyectos en desarrollo: `"published": false`
- Proyectos terminados: `"published": true`
- Proyectos futuros: `"published": false`

## 🎯 Efectos de Interacción

- **Hover**: La tarjeta aumenta tamaño (scale 1.08)
- **Brillo**: La imagen se aclara al pasar el ratón
- **Sombra**: Se aumenta la sombra para efecto de profundidad

## 📱 Responsive

El grid se adapta automáticamente:
- **Desktop**: 3-4 proyectos por fila
- **Tablet (768px)**: 2-3 proyectos por fila
- **Móvil (480px)**: 1 proyecto por fila

## 🔧 Personalización de Estilos

Si quieres modificar los estilos, edita la sección `SECCIÓN DE PROYECTOS` en `estilo.css`:

- Cambiar tamaño: Modifica `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))`
- Cambiar ratio de imagen: Modifica `aspect-ratio: 3 / 2`
- Cambiar efecto hover: Modifica `transform: scale(1.08)`

## 💡 Tips

1. Usa imágenes de calidad pero optimizadas (máx 200KB por imagen)
2. Mantén consistencia en el tamaño y proporción de imágenes
3. Los títulos deben ser cortos y descriptivos
4. Las descripciones deben ser breves (máx 10 palabras)
5. El ID debe ser único para cada proyecto

## 🚀 Próximas Mejoras

- [ ] Agregar enlaces a proyectos individuales
- [ ] Implementar modal de detalles del proyecto
- [ ] Agregar filtros por categoría
- [ ] Integrar galería de imágenes

