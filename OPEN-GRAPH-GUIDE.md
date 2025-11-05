# 📘 Guía de Open Graph para Facebook

## 🎯 ¿Qué es Open Graph?

Open Graph es un protocolo que permite que Facebook (y otras redes sociales) **extraigan automáticamente** información de tus páginas web cuando compartes un enlace.

## ✨ Resultado Visual

### ❌ Sin Open Graph:
```
[Tu mensaje aquí]
https://tusitio.com/articulo-largo-url-fea
```

### ✅ Con Open Graph:
```
[Tu mensaje aquí]

┌─────────────────────────────────────────┐
│  [IMAGEN GRANDE DESTACADA]              │
├─────────────────────────────────────────┤
│  TÍTULO DEL ARTÍCULO                    │
│  Descripción breve del contenido...     │
│  tusitio.com                            │
└─────────────────────────────────────────┘
```

## 🔧 Implementación en tus Sitios Web

### 1. Tags Básicos (REQUERIDOS)

Agrega estos tags en el `<head>` de cada página:

```html
<!DOCTYPE html>
<html>
<head>
    <!-- Open Graph Básico -->
    <meta property="og:title" content="Título de tu Artículo">
    <meta property="og:description" content="Descripción breve y atractiva del contenido (máximo 200 caracteres)">
    <meta property="og:image" content="https://tusitio.com/images/articulo-imagen.jpg">
    <meta property="og:url" content="https://tusitio.com/articulo">
    <meta property="og:type" content="article">
    
    <!-- Opcional pero recomendado -->
    <meta property="og:site_name" content="Nombre de tu Sitio">
    <meta property="og:locale" content="es_ES">
</head>
<body>
    <!-- Tu contenido -->
</body>
</html>
```

### 2. Tags Avanzados (RECOMENDADOS)

```html
<head>
    <!-- Open Graph Avanzado -->
    
    <!-- Dimensiones de imagen (recomendado: 1200x630px) -->
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:type" content="image/jpeg">
    <meta property="og:image:alt" content="Descripción de la imagen">
    
    <!-- Para artículos -->
    <meta property="article:published_time" content="2025-11-05T10:00:00Z">
    <meta property="article:author" content="Nombre del Autor">
    <meta property="article:section" content="Tecnología">
    <meta property="article:tag" content="tutorial">
    <meta property="article:tag" content="programación">
    
    <!-- Twitter Cards (bonus) -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Título de tu Artículo">
    <meta name="twitter:description" content="Descripción breve">
    <meta name="twitter:image" content="https://tusitio.com/images/articulo-imagen.jpg">
</head>
```

## 📐 Especificaciones de Imagen

### Tamaños Recomendados:

```
┌─────────────────────────────────────────┐
│  FORMATO              TAMAÑO            │
├─────────────────────────────────────────┤
│  Óptimo               1200 x 630 px     │
│  Mínimo               600 x 315 px      │
│  Cuadrado             1080 x 1080 px    │
│  Vertical             1080 x 1350 px    │
├─────────────────────────────────────────┤
│  PESO                 Máx. 8 MB         │
│  FORMATOS             JPG, PNG, GIF     │
│  RATIO                1.91:1 (ideal)    │
└─────────────────────────────────────────┘
```

### Mejores Prácticas:

✅ **Usa imágenes de alta calidad** (1200x630px)
✅ **Texto legible** en la imagen (fuente grande)
✅ **Colores contrastantes** para mejor visibilidad
✅ **Formato JPG optimizado** (máx. 100KB para carga rápida)
✅ **Sin bordes** que corten la imagen
❌ **Evita texto pequeño** que no se lea en móviles
❌ **No uses imágenes genéricas** (usa específicas del contenido)

## 🛠️ Implementación por Plataforma

### WordPress

```php
<!-- En tu tema o con plugin Yoast SEO -->
<?php
if (have_posts()) : while (have_posts()) : the_post();
?>
<meta property="og:title" content="<?php the_title(); ?>">
<meta property="og:description" content="<?php echo get_the_excerpt(); ?>">
<meta property="og:image" content="<?php echo get_the_post_thumbnail_url(get_the_ID(), 'full'); ?>">
<meta property="og:url" content="<?php the_permalink(); ?>">
<meta property="og:type" content="article">
<?php endwhile; endif; ?>
```

**Plugins Recomendados:**
- Yoast SEO (gratuito)
- RankMath (gratuito)
- All in One SEO Pack

### Next.js / React

```jsx
import Head from 'next/head';

export default function ArticlePage({ article }) {
  return (
    <>
      <Head>
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.description} />
        <meta property="og:image" content={article.image} />
        <meta property="og:url" content={`https://tusitio.com/${article.slug}`} />
        <meta property="og:type" content="article" />
      </Head>
      {/* Tu contenido */}
    </>
  );
}
```

### HTML Estático

```html
<!-- Plantilla base -->
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>{{TITULO}}</title>
    
    <!-- Open Graph -->
    <meta property="og:title" content="{{TITULO}}">
    <meta property="og:description" content="{{DESCRIPCION}}">
    <meta property="og:image" content="{{URL_IMAGEN}}">
    <meta property="og:url" content="{{URL_PAGINA}}">
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="{{NOMBRE_SITIO}}">
</head>
<body>
    <!-- Tu contenido -->
</body>
</html>
```

### Cloudflare Pages

Si usas Cloudflare Pages (tu caso), agrega los tags en:

```html
<!-- En tu archivo index.html o template -->
<head>
    <meta property="og:title" content="Título dinámico">
    <meta property="og:description" content="Descripción dinámica">
    <meta property="og:image" content="https://tu-dominio.pages.dev/images/og-image.jpg">
    <meta property="og:url" content="https://tu-dominio.pages.dev">
</head>
```

## 🧪 Herramientas de Prueba

### 1. Facebook Sharing Debugger (PRINCIPAL)

**URL:** https://developers.facebook.com/tools/debug/

**Cómo usar:**
1. Pega tu URL
2. Click en "Debug"
3. Verás cómo Facebook ve tu página
4. Click en "Scrape Again" si hiciste cambios

```
Ejemplo de uso:
1. https://developers.facebook.com/tools/debug/
2. Pegar: https://tusitio.com/articulo
3. Ver preview
4. Si cambias los tags, click "Scrape Again"
```

### 2. OpenGraph.xyz

**URL:** https://www.opengraph.xyz/

- Preview visual inmediato
- Muestra cómo se verá en Facebook, Twitter, LinkedIn
- No requiere cuenta

### 3. Meta Tags

**URL:** https://metatags.io/

- Editor visual
- Genera el código automáticamente
- Preview en tiempo real

## 🔍 Debugging Común

### Problema 1: Facebook no muestra la imagen

**Causas:**
- Imagen muy pequeña (< 200x200px)
- URL de imagen no accesible
- Imagen muy pesada (> 8MB)
- HTTPS requerido

**Solución:**
```html
<!-- Asegúrate de: -->
<meta property="og:image" content="https://tusitio.com/image.jpg">
<!-- ✓ HTTPS (no HTTP) -->
<!-- ✓ URL completa (no relativa) -->
<!-- ✓ Imagen accesible públicamente -->
<!-- ✓ Tamaño: 1200x630px -->
<!-- ✓ Peso: < 1MB -->
```

### Problema 2: Facebook muestra información vieja

**Solución:**
1. Ve a https://developers.facebook.com/tools/debug/
2. Pega tu URL
3. Click en "Scrape Again"
4. Facebook actualizará la caché

### Problema 3: No aparece ninguna información

**Checklist:**
```bash
□ ¿Los tags están en el <head>?
□ ¿La URL es accesible públicamente?
□ ¿Los tags tienen comillas correctas?
□ ¿El HTML es válido?
□ ¿No hay errores de sintaxis?
```

## 🎨 Plantilla Completa

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- SEO Básico -->
    <title>Título SEO de la Página</title>
    <meta name="description" content="Descripción SEO de la página">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:title" content="Título Atractivo para Redes Sociales">
    <meta property="og:description" content="Descripción atractiva que invite a hacer clic">
    <meta property="og:image" content="https://tusitio.com/images/og-image-1200x630.jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="Descripción de la imagen">
    <meta property="og:url" content="https://tusitio.com/articulo">
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="Nombre de tu Sitio">
    <meta property="og:locale" content="es_ES">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Título Atractivo">
    <meta name="twitter:description" content="Descripción atractiva">
    <meta name="twitter:image" content="https://tusitio.com/images/og-image-1200x630.jpg">
    <meta name="twitter:site" content="@tuusuario">
    
    <!-- Article (para blogs) -->
    <meta property="article:published_time" content="2025-11-05T10:00:00Z">
    <meta property="article:modified_time" content="2025-11-05T14:30:00Z">
    <meta property="article:author" content="Nombre del Autor">
    <meta property="article:section" content="Categoría">
    <meta property="article:tag" content="tag1">
    <meta property="article:tag" content="tag2">
    
    <!-- Favicon -->
    <link rel="icon" href="/favicon.ico">
    <link rel="canonical" href="https://tusitio.com/articulo">
</head>
<body>
    <!-- Tu contenido aquí -->
</body>
</html>
```

## 🚀 Checklist de Implementación

### Para cada uno de tus 7 sitios web:

```
□ Agregar og:title en todas las páginas
□ Agregar og:description en todas las páginas
□ Crear imágenes 1200x630px para cada artículo
□ Agregar og:image con URL completa (HTTPS)
□ Agregar og:url (URL canónica)
□ Agregar og:type (article para blogs)
□ Probar con Facebook Debugger
□ Verificar preview en móvil
□ Optimizar peso de imágenes (< 100KB)
□ Agregar Twitter Cards (bonus)
```

## 💡 Tips Pro

### 1. Imágenes Dinámicas

Genera imágenes OG automáticamente con tu logo y título:

```javascript
// Ejemplo con Canvas API
function generateOGImage(title) {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext('2d');
  
  // Fondo
  ctx.fillStyle = '#1877f2';
  ctx.fillRect(0, 0, 1200, 630);
  
  // Título
  ctx.fillStyle = 'white';
  ctx.font = 'bold 60px Arial';
  ctx.fillText(title, 100, 315);
  
  return canvas.toDataURL();
}
```

### 2. Variables Dinámicas

```html
<!-- Con template engine -->
<meta property="og:title" content="{{ post.title }}">
<meta property="og:description" content="{{ post.excerpt }}">
<meta property="og:image" content="{{ post.featured_image }}">
<meta property="og:url" content="{{ post.permalink }}">
```

### 3. Testing Automatizado

```bash
# Script para verificar Open Graph
curl -s "https://tusitio.com/articulo" | grep -o '<meta property="og:[^"]*" content="[^"]*"'
```

## 📊 Impacto en Engagement

Con Open Graph bien implementado:

```
┌─────────────────────────────────────────┐
│  MÉTRICA              MEJORA            │
├─────────────────────────────────────────┤
│  Click-Through Rate   +30% a 50%        │
│  Shares               +2x a 3x          │
│  Engagement           +40%              │
│  Tiempo en página     +25%              │
└─────────────────────────────────────────┘
```

## 🔗 Recursos Útiles

- **Facebook Debugger:** https://developers.facebook.com/tools/debug/
- **OpenGraph.xyz:** https://www.opengraph.xyz/
- **Meta Tags Generator:** https://metatags.io/
- **Documentación oficial:** https://ogp.me/
- **Image Optimizer:** https://tinypng.com/

## 🎯 Integración con tu Sistema

Tu sistema ya está configurado para aprovechar Open Graph:

1. **Facebook extrae automáticamente** los datos de tus URLs
2. **Tu mensaje personalizado** aparece arriba
3. **La tarjeta de Facebook** muestra:
   - Imagen destacada (og:image)
   - Título (og:title)
   - Descripción (og:description)
   - Dominio (og:url)

**Resultado:**
```
[Tu mensaje generado por IA] 🚀

┌─────────────────────────────────────┐
│  [IMAGEN ATRACTIVA]                 │
│  Título del Artículo                │
│  Descripción breve...               │
│  tusitio.com                        │
└─────────────────────────────────────┘
```

---

## 🎉 Resumen

✅ **Facebook extrae automáticamente** los datos de tu URL
✅ **No necesitas pegar título/descripción** en cada post
✅ **Solo implementa Open Graph** una vez en cada sitio
✅ **Tus publicaciones se ven profesionales** automáticamente
✅ **Mayor engagement** y clicks

**¿Siguiente paso?**
Implementa Open Graph en tus 7 sitios web y verás la diferencia inmediatamente en tus publicaciones de Facebook.
