# 📘 Auto-Publisher para Facebook

Sistema automatizado para publicar URLs de tus sitios web en tu fanpage de Facebook con mensajes personalizados y en horarios específicos, usando Cloudflare Workers.

## 🌟 Características

- ✅ **Multi-Proyecto**: Gestiona múltiples sitios web con configuraciones separadas
- ✅ **IA Generativa**: Contenido automático con OpenAI (GPT) o Google Gemini
- ✅ **Publicación Programada**: Horarios automáticos configurables (cron triggers)
- ✅ **Panel de Configuración**: Edita credenciales y API keys directamente desde el dashboard
- ✅ **Dashboard Profesional**: Interfaz web completa para gestión de proyectos y posts
- ✅ **Open Graph**: Extracción automática de metadatos de URLs
- ✅ **Estadísticas**: Monitoreo en tiempo real de publicaciones
- ✅ **100% Serverless**: Sin servidor que mantener (Cloudflare Workers)
- ✅ **Gratis**: Hasta 100,000 peticiones/día con Cloudflare

## 🚀 Instalación Rápida

### 1. Clonar e Instalar

```powershell
cd C:\auto-facebook-publisher
npm install
```

### 2. Configurar Cloudflare

```powershell
# Autenticar
npx wrangler login

# Crear KV namespace para almacenar datos
npx wrangler kv:namespace create FB_PUBLISHER_KV
```

Copia el ID que te devuelve y actualiza `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "FB_PUBLISHER_KV"
id = "tu_id_aqui"  # Reemplaza con el ID obtenido
```

### 3. Configurar Clave de Administrador

**Importante**: Esta clave protege la configuración del panel.

```powershell
npx wrangler secret put ADMIN_KEY
# Ingresa una clave segura (ej: mi-clave-admin-2024)
```

### 4. Desplegar

```powershell
npm run deploy
```

Tu worker estará disponible en: `https://facebook-auto-publisher.tu-cuenta.workers.dev`

### 5. Configurar desde el Panel

Ahora puedes configurar todo desde el navegador:

1. **Abre el dashboard** (URL del worker)
2. **Ve al tab "⚙️ Configuración"**
3. **Ingresa tu clave de administrador**
4. **Selecciona proveedor de IA**:
   - **OpenAI (GPT)**: 
     - Obtén API key en https://platform.openai.com/api-keys
     - Modelos: GPT-3.5 Turbo o GPT-4
     - Costo: ~$0.002 por 1K tokens
   - **Google Gemini**: 
     - Obtén API key en https://makersuite.google.com/app/apikey
     - Modelo: Gemini Pro
     - **GRATIS** hasta 60 requests/min
5. **Ingresa credenciales de Facebook**:
   - Page ID: ID de tu fanpage
   - Page Access Token: Token desde Graph API Explorer
   - 📖 Ver [GUIA-AUTORIZACION-FACEBOOK.md](GUIA-AUTORIZACION-FACEBOOK.md) para obtenerlos
6. **Guardar** ✅

### 6. (Alternativa) Configurar con Secrets

También puedes configurar credenciales con Wrangler secrets:

```powershell
# Facebook
npx wrangler secret put FB_PAGE_ACCESS_TOKEN
npx wrangler secret put FB_PAGE_ID

# IA (opcional si usas el panel)
npx wrangler secret put OPENAI_API_KEY
# O para Gemini
npx wrangler secret put AI_API_KEY
```

## 📖 Uso

### Dashboard Web

Accede a la URL de tu worker para ver el dashboard con 5 secciones:

1. **📊 Dashboard**: Estadísticas generales y resumen de proyectos
2. **� Proyectos**: Crear y gestionar múltiples sitios web
3. **📝 Posts**: Agregar URLs individuales o en lote por proyecto
4. **🤖 Generador IA**: Crear contenido automático con OpenAI o Gemini
5. **⚙️ Configuración**: Editar credenciales y cambiar proveedor de IA

### Crear un Proyecto

1. Ve al tab **"📁 Proyectos"**
2. Completa el formulario:
   - Nombre: "Mi Blog Personal"
   - Dominio: "miblog.com"
   - Descripción: Opcional
3. Clic en **"➕ Crear Proyecto"**

### Agregar Posts con IA

1. Ve al tab **"🤖 Generador IA"**
2. Selecciona el proyecto
3. Pega una URL
4. Clic en **"✨ Generar Contenido"**
5. La IA creará un mensaje optimizado automáticamente
6. Clic en **"💾 Guardar Post"**

### Agregar Posts en Lote

**Con IA (recomendado):**
1. Ve al tab **"🤖 Generador IA"** → **"📦 Generación en Lote"**
2. Pega múltiples URLs (una por línea)
3. Clic en **"✨ Generar Todo el Contenido"**
4. La IA generará mensajes únicos para cada URL

**Manual:**
1. Ve al tab **"📝 Posts"**
2. Selecciona el proyecto
3. Clic en **"📦 Agregar en Lote"**
4. Pega las URLs y mensajes

### API Endpoints (Avanzado)

Si prefieres usar la API directamente:

**Agregar Post Individual:**
```javascript
POST /api/projects/{projectId}/posts
{
  "url": "https://tusitio.com/articulo",
  "message": "¡Mira este increíble artículo! 🚀"
}
```

**Generar Contenido con IA:**
```javascript
POST /api/generate-content
{
  "url": "https://tusitio.com/articulo",
  "context": "Enfócate en los beneficios principales"
}
```

**Agregar Posts en Lote con IA:**
```javascript
POST /api/projects/{projectId}/posts/bulk
{
  "posts": [
    {"url": "https://sitio1.com/pagina1"},
    {"url": "https://sitio2.com/pagina2"}
  ],
  "generateContent": true
}
```

## ⏰ Configurar Horarios de Publicación

Edita `wrangler.toml`:

```toml
[triggers]
crons = [
  "0 9 * * *",   # 9:00 AM UTC todos los días
  "0 14 * * *",  # 2:00 PM UTC todos los días
  "0 19 * * *",  # 7:00 PM UTC todos los días
]
```

**Importante:** Los horarios están en UTC. Ajusta según tu zona horaria:
- España (CET/CEST): UTC +1/+2
- México (CST): UTC -6
- Argentina (ART): UTC -3

### Ejemplos de Cron:

```
"0 8 * * *"     -> Cada día a las 8:00 AM
"0 */4 * * *"   -> Cada 4 horas
"0 9 * * 1-5"   -> Lunes a viernes a las 9:00 AM
"30 14 * * *"   -> Cada día a las 2:30 PM
"0 9,14,19 * * *" -> A las 9 AM, 2 PM y 7 PM
```

## 📊 API Endpoints Completos

### Proyectos
- `GET /api/projects` - Listar todos los proyectos
- `POST /api/projects` - Crear proyecto
- `GET /api/projects/:id` - Obtener proyecto específico
- `PUT /api/projects/:id` - Actualizar proyecto
- `DELETE /api/projects/:id` - Eliminar proyecto

### Posts
- `GET /api/projects/:id/posts` - Listar posts de un proyecto
- `POST /api/projects/:id/posts` - Agregar post individual
- `POST /api/projects/:id/posts/bulk` - Agregar múltiples posts
- `DELETE /api/projects/:id/posts/:postId` - Eliminar post
- `POST /api/projects/:id/publish` - Publicar siguiente post del proyecto

### IA y Generación de Contenido
- `POST /api/generate-content` - Generar contenido para una URL
- `POST /api/generate-bulk-content` - Generar contenido para múltiples URLs

### Publicación
- `POST /api/publish` - Publicar siguiente post pendiente

### Estadísticas
- `GET /api/stats` - Estadísticas globales
- `GET /api/projects/:id/stats` - Estadísticas de un proyecto

### Configuración
- `GET /api/settings` - Obtener configuración actual
- `POST /api/settings` - Guardar configuración (requiere `x-admin-key` header)

### Archivos
- `GET /` - Dashboard HTML
- `GET /dashboard.css` - Estilos del dashboard
- `GET /dashboard.js` - JavaScript del dashboard

## 🔍 Monitoreo

Ver logs en tiempo real:

```powershell
npx wrangler tail
```

## 🤖 Proveedores de IA

### OpenAI (GPT)
- **Modelos**: GPT-3.5 Turbo, GPT-4
- **API Key**: Obtén en https://platform.openai.com/api-keys
- **Formato**: Empieza con `sk-`
- **Costo**: ~$0.002 por 1K tokens (GPT-3.5)
- **Ventaja**: Respuestas más creativas y naturales

### Google Gemini
- **Modelo**: Gemini Pro
- **API Key**: Obtén en https://makersuite.google.com/app/apikey
- **Formato**: Empieza con `AIza`
- **Costo**: **GRATIS** hasta 60 requests/minuto
- **Ventaja**: Gratuito y rápido para prototipos

### Cambiar de Proveedor
1. Ve al tab **"⚙️ Configuración"**
2. Selecciona el proveedor deseado
3. Ingresa la nueva API Key
4. Guarda los cambios
5. ¡La IA cambiará automáticamente!

## 🏷️ Open Graph y Metadatos

El sistema extrae automáticamente metadatos de tus URLs usando Open Graph:
- `og:title` - Título del contenido
- `og:description` - Descripción
- `og:image` - Imagen destacada
- `og:url` - URL canónica

**Para mejores resultados**, implementa Open Graph en tus sitios web:

```html
<meta property="og:title" content="Título del Artículo" />
<meta property="og:description" content="Descripción atractiva..." />
<meta property="og:image" content="https://tusitio.com/imagen.jpg" />
<meta property="og:url" content="https://tusitio.com/articulo" />
```

📖 Ver guía completa: [OPEN-GRAPH-GUIDE.md](OPEN-GRAPH-GUIDE.md)

## 💰 Costos

**Cloudflare Workers** (Plan Gratuito):
- ✅ 100,000 peticiones/día GRATIS
- ✅ 1GB de almacenamiento KV GRATIS
- ✅ Sin tarjeta de crédito requerida

**OpenAI** (Opcional):
- GPT-3.5 Turbo: ~$0.002 por 1K tokens
- 100 posts generados ≈ $0.20
- Pago por uso

**Google Gemini** (Opcional):
- ✅ **GRATIS** hasta 60 requests/min
- Ideal para empezar sin costos

**Estimación Total**:
- Con 200 URLs + 3 publicaciones/día
- Cloudflare: **$0/mes** (dentro del plan gratuito)
- IA: $0 (Gemini) o ~$0.40/mes (OpenAI GPT-3.5)

## 🔐 Seguridad

- ✅ **Admin Key** protege el panel de configuración
- ✅ **Tokens ofuscados** en respuestas API (solo primeros/últimos 4 caracteres)
- ✅ **Secrets cifrados** en Cloudflare Workers
- ✅ **KV Storage seguro** para credenciales
- ✅ **CORS configurado** para tu dominio
- ✅ **No se guardan credenciales en código** fuente

## 🛠️ Desarrollo Local

```powershell
npm run dev
```

Esto inicia un servidor local en `http://localhost:8787`

## 🐛 Troubleshooting

### "ADMIN_KEY no configurada"
→ Ejecuta: `npx wrangler secret put ADMIN_KEY`

### "API Key de IA no configurada"
→ Ve al tab Configuración y añade tu API key de OpenAI o Gemini

### "Clave de administrador inválida"
→ Verifica que estés usando la misma clave que configuraste con `wrangler secret put ADMIN_KEY`

### "Error: FB_PAGE_ACCESS_TOKEN no configurado"
→ Configúralo desde el panel (tab Configuración) o con `npx wrangler secret put FB_PAGE_ACCESS_TOKEN`

### "Error al publicar: Invalid OAuth token"
→ Tu token de Facebook expiró. Genera uno nuevo desde Graph API Explorer (ver [GUIA-AUTORIZACION-FACEBOOK.md](GUIA-AUTORIZACION-FACEBOOK.md))

### "No hay posts pendientes"
→ Agrega posts desde el dashboard o la API.

### Los posts no se publican automáticamente
→ Verifica que los cron triggers estén configurados en `wrangler.toml` y que hayas desplegado con `npm run deploy`.

### Error al generar contenido con IA
→ Verifica:
- API key correcta para el proveedor seleccionado
- OpenAI key empieza con `sk-`
- Gemini key empieza con `AIza`
- Tienes créditos/quota disponible en el proveedor

## 📝 Notas Importantes

1. **Token de Facebook**: 
   - Usa **Page Access Token** (nunca expira)
   - No uses User Access Token (expira en 1-2 horas)
   - Ver [GUIA-AUTORIZACION-FACEBOOK.md](GUIA-AUTORIZACION-FACEBOOK.md) para obtenerlo correctamente

2. **Límites de Facebook**: 
   - La API tiene rate limits
   - Con 3 publicaciones/día no hay problemas
   - Evita spam con mensajes únicos por URL

3. **IA Generativa**:
   - OpenAI: Mejor calidad, pago por uso
   - Gemini: Gratis, excelente para empezar
   - Cambia de proveedor cuando quieras

4. **Open Graph**: 
   - Implementa tags OG en tus sitios para mejores previsualizaciones
   - Facebook extrae automáticamente metadatos
   - Ver [OPEN-GRAPH-GUIDE.md](OPEN-GRAPH-GUIDE.md)

5. **Multi-Proyecto**:
   - Crea un proyecto por sitio web
   - Cada proyecto tiene su propia cola de publicación
   - Estadísticas separadas por proyecto

## 🎯 Flujo de Trabajo Recomendado

### Para 7 Sitios con 200 URLs cada uno:

1. **Desplegar el sistema** (`npm run deploy`)
2. **Configurar credenciales** (Panel → Configuración):
   - Clave de administrador
   - Proveedor de IA (Gemini recomendado para empezar gratis)
   - API Key de IA
   - Facebook Page ID y Token
3. **Crear 7 proyectos** (uno por sitio web)
4. **Para cada proyecto**:
   - Ve al Generador IA → Generación en Lote
   - Pega las 200 URLs (una por línea)
   - Genera contenido automáticamente
5. **El sistema publicará automáticamente** según el cron (3x/día por defecto)
6. **Monitorea el Dashboard** para ver progreso
7. **Agrega más URLs** cuando quieras

### Ejemplo de Uso Diario:
- **9:00 AM**: Sistema publica post automáticamente
- **2:00 PM**: Sistema publica otro post
- **7:00 PM**: Sistema publica último post del día
- **Total**: ~1,400 posts publicados en 466 días (7 sitios × 200 URLs)

## 📚 Recursos y Documentación

### Guías del Proyecto
- 📖 [README.md](README.md) - Este archivo (guía principal)
- 🔑 [GUIA-AUTORIZACION-FACEBOOK.md](GUIA-AUTORIZACION-FACEBOOK.md) - Cómo obtener Page Access Token
- 🏷️ [OPEN-GRAPH-GUIDE.md](OPEN-GRAPH-GUIDE.md) - Implementar Open Graph en tus sitios
- 🎨 [RESUMEN.md](RESUMEN.md) - Resumen visual del proyecto
- 📋 [INSTRUCCIONES-FINALES.md](INSTRUCCIONES-FINALES.md) - Instrucciones de despliegue

### Enlaces Externos
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Facebook Graph API](https://developers.facebook.com/docs/graph-api/)
- [OpenAI Platform](https://platform.openai.com/)
- [Google AI Studio (Gemini)](https://makersuite.google.com/)
- [Cron Expression Generator](https://crontab.guru/)

## 🤝 Contribuciones y Mejoras Futuras

Ideas para extender el sistema:

- ✅ ~~Multi-proyecto~~ (Implementado)
- ✅ ~~Generación de contenido con IA~~ (Implementado)
- ✅ ~~Panel de configuración dinámico~~ (Implementado)
- ✅ ~~Soporte para múltiples proveedores de IA~~ (Implementado)
- ⬜ Programación de posts a horarios específicos
- ⬜ Variaciones aleatorias de mensajes
- ⬜ Soporte para publicar imágenes/videos
- ⬜ Integración con Twitter, LinkedIn, Instagram
- ⬜ Analytics avanzados y reportes
- ⬜ A/B testing de mensajes
- ⬜ Webhooks para notificaciones
- ⬜ API REST documentada con Swagger

## 🌟 Características Destacadas

### 🎨 Dashboard Profesional
- Interfaz moderna y responsive
- 5 secciones organizadas con tabs
- Estadísticas en tiempo real
- Gestión visual de proyectos

### 🤖 IA Potente y Flexible
- 2 proveedores soportados (OpenAI + Gemini)
- Cambio en caliente sin redesplegar
- Generación individual o masiva
- Contexto personalizable

### 🔧 Configuración Sin Código
- Todo desde el navegador
- No necesitas editar archivos
- Cambios aplicados instantáneamente
- Interfaz intuitiva

### 📊 Multi-Proyecto Inteligente
- Gestiona 7+ sitios simultáneamente
- Estadísticas separadas
- Colas de publicación independientes
- Configuración por proyecto

## 📄 Licencia

MIT - Úsalo libremente para tus proyectos.

## 🛠️ Stack Tecnológico

- **Backend**: Cloudflare Workers (JavaScript/Node.js)
- **Storage**: Cloudflare KV (Key-Value)
- **Scheduling**: Cloudflare Cron Triggers
- **Frontend**: HTML5, CSS3, JavaScript Vanilla
- **APIs**: 
  - Facebook Graph API v18.0
  - OpenAI API (GPT-3.5/GPT-4)
  - Google Generative AI API (Gemini)
- **Deployment**: Wrangler CLI

## 📞 Soporte

¿Preguntas? 
1. Revisa los logs: `npx wrangler tail`
2. Consulta las guías en el repositorio
3. Verifica la documentación de:
   - [Cloudflare Workers](https://developers.cloudflare.com/workers/)
   - [Facebook Graph API](https://developers.facebook.com/docs/graph-api/)
   - [OpenAI](https://platform.openai.com/docs)
   - [Gemini](https://ai.google.dev/docs)

---

**Hecho con ❤️ para automatizar tu presencia en redes sociales**

🚀 ¡Empieza ahora y deja que la IA maneje tus publicaciones!
