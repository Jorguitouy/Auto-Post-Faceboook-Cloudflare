# 📘 Facebook Auto-Publisher - Sistema Multi-Proyecto con IA

Sistema automatizado profesional para publicar contenido en Facebook desde múltiples sitios web, con gestión por proyectos separados y generación de contenido mediante Inteligencia Artificial (OpenAI o Google Gemini).

## 🌟 Características Principales

### ✨ Multi-Proyecto
- **Gestión separada** por cada sitio web/dominio
- **Configuración independiente** para cada proyecto
- **Estadísticas individuales** por proyecto
- **Activación/desactivación** selectiva de proyectos

### 🎨 Open Graph Integration
- **Facebook extrae automáticamente** título, descripción e imagen de tus URLs
- **Tarjetas visuales profesionales** sin esfuerzo adicional
- **Solo implementa Open Graph tags** una vez en cada sitio
- **Publicaciones más atractivas** con imágenes destacadas
- **Ver guía completa:** [OPEN-GRAPH-GUIDE.md](OPEN-GRAPH-GUIDE.md)

### 🤖 Generación de Contenido con IA Multi-Proveedor
- **OpenAI (GPT-3.5/GPT-4)** o **Google Gemini** a tu elección
- **Cambio en caliente** entre proveedores sin redesplegar
- **Análisis de URLs** para generar mensajes relevantes
- **Personalización** basada en el contenido de cada página
- **Generación en lote** para múltiples URLs (hasta 200+)
- **Mensajes optimizados** con emojis y llamados a la acción
- **Gemini GRATIS** hasta 60 requests/min

### ⚙️ Configuración Dinámica desde el Panel
- **Edita credenciales** directamente desde el navegador
- **Cambiar proveedor de IA** sin tocar código
- **Guardar Facebook tokens** en Cloudflare KV
- **Protegido con Admin Key** para seguridad
- **Sin necesidad de redesplegar** al cambiar configuración

### 📊 Panel de Control Profesional
- **Interfaz gráfica moderna** con HTML/CSS/JS separados
- **Dashboard interactivo** con estadísticas en tiempo real
- **5 secciones organizadas**: Dashboard, Proyectos, Posts, IA, Configuración
- **Gestión visual** de proyectos y posts
- **Sistema de tabs** organizado por funcionalidad
- **Responsive design** para móviles y tablets

### 🚀 Publicación Inteligente
- **Automatizada** en horarios programados
- **Manual** cuando lo necesites
- **Por proyecto** o global
- **Round-robin** entre proyectos activos
- **Manejo de errores** automático

### 💾 Almacenamiento
- **Cloudflare KV** para datos persistentes
- **Sin base de datos** que administrar
- **Backups automáticos** por Cloudflare
- **Escalable** y confiable

## 🎯 Casos de Uso

Perfecto para:
- 📰 Bloggers con múltiples sitios
- 🏢 Agencias que manejan varios clientes
- 🛒 E-commerce con diferentes tiendas
- 📚 Content creators con múltiples proyectos
- 🎨 Portfolios y sitios personales

## 🚀 Instalación Rápida

### 1. Clonar el Repositorio

```powershell
git clone https://github.com/Jorguitouy/Facebook-Autopost-Cloudflare.git
cd Facebook-Autopost-Cloudflare
```

### 2. Instalar Dependencias

```powershell
npm install
```

### 3. Configurar Cloudflare

```powershell
# Autenticar
npx wrangler login

# Crear KV namespace
npx wrangler kv:namespace create FB_PUBLISHER_KV
```

Copia el ID que te devuelve y actualiza `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "FB_PUBLISHER_KV"
id = "tu_id_aqui"  # Reemplaza con el ID obtenido
```

### 3. Configurar Cloudflare

```powershell
# Autenticar
npx wrangler login

# Crear KV namespace
npx wrangler kv:namespace create FB_PUBLISHER_KV
```

Copia el ID que te devuelve y actualiza `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "FB_PUBLISHER_KV"
id = "tu_id_aqui"  # Reemplaza con el ID obtenido
```

### 4. Configurar Clave de Administrador

**NUEVO**: Esta clave protege la configuración del panel.

```powershell
npx wrangler secret put ADMIN_KEY
# Ingresa una clave segura (ej: mi-clave-admin-2024)
```

### 5. Desplegar

```powershell
npm run deploy
```

Tu worker estará disponible en: `https://facebook-auto-publisher.tu-cuenta.workers.dev`

### 6. Configurar TODO desde el Panel Web ⭐

**La forma recomendada de configurar el sistema es desde el navegador:**

1. **Abre el dashboard**: `https://facebook-auto-publisher.tu-cuenta.workers.dev`
2. **Ve al tab "⚙️ Configuración"**
3. **Ingresa tu ADMIN_KEY** (la clave configurada en paso 4)
4. **Selecciona proveedor de IA**:
   - **OpenAI (GPT-3.5/GPT-4)**: 
     - API Key desde: https://platform.openai.com/api-keys
     - Formato: `sk-...`
     - Costo: ~$0.002/1K tokens
   - **Google Gemini** (RECOMENDADO): 
     - API Key desde: https://aistudio.google.com/app/api-keys
     - Formato: `AIza...`
     - **GRATIS** hasta 60 req/min ✅
5. **Elige el modelo**:
   - OpenAI: gpt-3.5-turbo, gpt-4, gpt-4o, gpt-4o-mini
   - Gemini: gemini-2.5-flash (recomendado), gemini-2.5-pro, gemini-2.0-flash
6. **Configura Facebook**:
   - Page ID y Page Access Token
   - Ver [GUIA-AUTORIZACION-FACEBOOK.md](GUIA-AUTORIZACION-FACEBOOK.md)
7. **Click "💾 Guardar Configuración"** → ¡Listo!

**✅ Ventajas de configurar desde el panel:**
- Cambios inmediatos sin redesplegar
- Puedes ver/editar valores en Cloudflare Dashboard → KV
- Cambiar modelo o proveedor en segundos
- Todo centralizado en un lugar

---

### 7. (Avanzado) Ver configuración en Cloudflare Dashboard

Para verificar o editar manualmente tu configuración:

1. Ve a: https://dash.cloudflare.com
2. **Workers & Pages** → **KV** 
3. Click en: **FB_PUBLISHER_KV**
4. Verás todas las configuraciones guardadas desde el panel:
   - `AI_PROVIDER` → "gemini" o "openai"
   - `AI_MODEL` → "gemini-2.5-flash", "gpt-4o-mini", etc.
   - `AI_API_KEY` → Tu API Key
   - `FB_PAGE_ID` → ID de tu página
   - `FB_PAGE_ACCESS_TOKEN` → Token de Facebook

---

### 8. Desplegar

```powershell
npm run deploy
```

✅ **¡Tu Worker está listo!** Estará disponible en:
`https://facebook-auto-publisher.tu-cuenta.workers.dev`

**Accede al Panel** y configura todo desde el navegador (sin editar código).

## 📖 Guía de Uso

El panel de control tiene **5 secciones principales**:

### 📊 **Dashboard** (Resumen)
- Vista general del sistema
- Estadísticas de proyectos, posts y publicaciones
- Estado de sincronización
- Enlaces rápidos

### 📁 **Proyectos** (Multi-Sitio)
Gestiona tus sitios web:

1. **Crear un proyecto**: Haz clic en **Crear Proyecto**
   - **Nombre**: Identificador (ej: "Blog Personal")
   - **Dominio**: URL completa (ej: "https://www.miblog.com")
   - **Descripción**: Opcional

2. **Sincronizar URLs**: Importa automáticamente todas las URLs del sitemap
   - El sistema busca `/sitemap.xml` en el dominio
   - Extrae todas las `<loc>` encontradas
   - Guarda las URLs para publicación

3. **Ver/Editar/Eliminar**: Gestiona tus proyectos desde la tabla

**Ejemplo: 7 Sitios con 200 URLs cada uno**
```
Proyecto 1: www.sitio1.com → 200 URLs importadas
Proyecto 2: www.sitio2.com → 200 URLs importadas
...
Proyecto 7: www.sitio7.com → 200 URLs importadas
Total: 1,400 URLs listas para publicar
```


### 📝 **Posts** (Cola de Publicación)
Administra el contenido pendiente:

1. **Ver posts**: Tabla con todos los posts por proyecto
   - Estado: pendiente, publicado, error
   - URL, mensaje, fecha de publicación
   
2. **Agregar manualmente**: 
   - Selecciona proyecto
   - Ingresa URL del contenido
   - Escribe mensaje personalizado
   - **Agregar Post**

3. **Agregar masivamente con IA**:
   - Selecciona proyecto
   - El sistema toma URLs del proyecto (desde sitemap)
   - Genera contenido automático para múltiples URLs
   - **Generar y Agregar Posts** (hasta 50 URLs simultáneas)

4. **Eliminar posts**: Limpia la cola antes de publicar

### 🤖 **IA** (Generador de Contenido)
Genera publicaciones automáticas con OpenAI o Gemini:

**Modo Individual**:
1. Selecciona el proyecto
2. Pega una URL específica
3. (Opcional) Agrega contexto adicional
4. **Generar Contenido** → Obtén un mensaje optimizado para redes sociales

**Modo Masivo**:
1. Selecciona el proyecto
2. Las URLs se toman automáticamente del proyecto
3. **Generar Masivamente** → Crea posts para hasta 50 URLs
4. Los posts se agregan automáticamente a la cola

**¿Cómo funciona?**
- El sistema extrae automáticamente el contenido de la URL (usando Open Graph tags: `og:title`, `og:description`, `og:image`)
- La IA (OpenAI GPT-3.5/GPT-4 o Google Gemini) redacta un mensaje atractivo
- El mensaje incluye emojis, hashtags y texto optimizado para engagement

**Comparación de Proveedores**:
| Característica | OpenAI (GPT-3.5) | Google Gemini |
|---|---|---|
| Costo | ~$0.002 por 1K tokens | **GRATIS** ✅ |
| Límite | Según plan (pago) | 60 req/min |
| Calidad | Excelente | Excelente |
| Recomendación | Producción con presupuesto | **Ideal para empezar** 🎉 |

### ⚙️ **Configuración** (Panel Dinámico)
Configura todo desde el navegador sin editar código:

1. **Clave de Administrador**: Ingresa tu `ADMIN_KEY`
2. **Proveedor de IA**: Selecciona OpenAI o Gemini
   - Se muestra información contextual del proveedor elegido
   - Enlace para obtener API Key
   - Costos y límites
3. **API Key del Proveedor**: Pega tu clave (se ofusca al mostrar)
4. **Facebook**:
   - Page ID: ID de tu página
   - Page Access Token: Token de acceso (ver [GUIA-AUTORIZACION-FACEBOOK.md](GUIA-AUTORIZACION-FACEBOOK.md))
5. **Guardar Configuración** → Los cambios se aplican inmediatamente

**Indicadores de Estado**:
- ✅ **Configurado**: Credencial guardada correctamente
- ⚠️ **No configurado**: Falta completar este campo

**Seguridad**:
- Admin Key protege el endpoint `/api/settings`
- Los tokens se ofuscan al mostrarse (ej: `sk-...ABC123`)
- Todo se almacena en Cloudflare KV (encriptado)
6. Revisa el contenido generado
7. Click en **💾 Guardar Post**

#### En Lote:
1. En la misma pestaña, sección "Generación en Lote"
2. Selecciona el proyecto
3. Pega tus URLs (una por línea)
4. Click en **✨ Generar Todo el Contenido**
5. Espera mientras la IA procesa todas las URLs
6. Los posts se guardarán automáticamente

### Publicar

#### Automático:
Los posts se publican automáticamente según los horarios configurados en `wrangler.toml`

#### Manual:
- **Global**: Click en **▶️ Publicar Ahora** en el header
- **Por Proyecto**: En la lista de posts, click en **▶️ Publicar Siguiente**
- **Post Específico**: Click en **▶️ Publicar** junto al post

## ⏰ Configurar Horarios de Publicación

Edita `wrangler.toml`:

```toml
[triggers]
crons = [
  "0 9 * * *",   # 9:00 AM UTC
  "0 14 * * *",  # 2:00 PM UTC
  "0 19 * * *",  # 7:00 PM UTC
]
```

**Importante:** Los horarios están en UTC. Convierte según tu zona horaria:
- España (CET/CEST): UTC +1/+2 → Las 9 AM UTC = 10/11 AM España
- México (CST): UTC -6 → Las 9 AM UTC = 3 AM México
- Argentina (ART): UTC -3 → Las 9 AM UTC = 6 AM Argentina

### Ejemplos de Cron:

```
"0 8 * * *"     → Cada día a las 8:00 AM
"0 */4 * * *"   → Cada 4 horas
"0 9 * * 1-5"   → Lunes a viernes a las 9:00 AM
"30 14 * * *"   → Cada día a las 2:30 PM
"0 9,14,19 * * *" → A las 9 AM, 2 PM y 7 PM
```

Herramienta: [Crontab Guru](https://crontab.guru/)

## 📊 API Endpoints

### Proyectos
- `GET /api/projects` - Listar todos los proyectos
- `POST /api/projects` - Crear proyecto
- `GET /api/projects/:id` - Obtener proyecto
- `PUT /api/projects/:id` - Actualizar proyecto
- `DELETE /api/projects/:id` - Eliminar proyecto

### Posts
- `GET /api/projects/:id/posts` - Listar posts del proyecto
- `POST /api/projects/:id/posts` - Agregar post
- `POST /api/projects/:id/posts/bulk` - Agregar múltiples posts
- `DELETE /api/projects/:id/posts/:postId` - Eliminar post

### IA
- `POST /api/generate-content` - Generar contenido para una URL
- `POST /api/generate-bulk-content` - Generar contenido para múltiples URLs

### Publicación
- `POST /api/publish` - Publicar siguiente post pendiente
- `POST /api/projects/:id/publish` - Publicar siguiente del proyecto

### Estadísticas
- `GET /api/stats` - Estadísticas globales
- `GET /api/projects/:id/stats` - Estadísticas del proyecto

## 🔍 Monitoreo

Ver logs en tiempo real:

```powershell
npx wrangler tail
```

Ver ejecuciones de cron:
```powershell
npx wrangler tail --format pretty
```

## 💰 Costos

### Cloudflare Workers (Plan Gratuito)
- ✅ 100,000 peticiones/día GRATIS
- ✅ 1GB de almacenamiento KV GRATIS
- ✅ Cron triggers ilimitados GRATIS

Con 3 publicaciones al día × 7 proyectos = 21 publicaciones/día
→ Muy por debajo del límite gratuito

### OpenAI (Si usas IA)
- GPT-3.5-turbo: ~$0.001 por post generado
- 200 posts con IA ≈ $0.20 USD
- GPT-4: ~$0.03 por post (más caro pero mejor calidad)

## 🔐 Seguridad

- ✅ Tokens cifrados como secretos de Cloudflare
- ✅ No se exponen credenciales en el código
- ✅ CORS configurado
- ✅ Autenticación de Facebook OAuth
- ✅ Validación de datos en el backend

## 🎨 Open Graph Tags

Facebook extrae automáticamente información de tus URLs si tienes Open Graph tags en tus páginas:

```html
<meta property="og:title" content="Título del Artículo">
<meta property="og:description" content="Descripción breve">
<meta property="og:image" content="https://tusitio.com/imagen.jpg">
<meta property="og:url" content="https://tusitio.com/articulo">
```

**Resultado:**
- ✅ Tarjeta visual con imagen destacada
- ✅ Título y descripción automáticos
- ✅ Publicaciones más profesionales
- ✅ Mayor engagement (+30% CTR)

**📖 Guía completa:** Ver [OPEN-GRAPH-GUIDE.md](OPEN-GRAPH-GUIDE.md) para implementar en tus sitios.

## 🛠️ Desarrollo Local

```powershell
npm run dev
```

Esto inicia un servidor local en `http://localhost:8787`

## 🐛 Troubleshooting

### "Error: FB_PAGE_ACCESS_TOKEN no configurado"
→ Ejecuta: `npx wrangler secret put FB_PAGE_ACCESS_TOKEN`

### "Error: OPENAI_API_KEY no configurado"
→ La IA no funcionará sin esto. Configura: `npx wrangler secret put OPENAI_API_KEY`

### "Error al publicar: Invalid OAuth token"
→ Tu token de Facebook expiró. Genera uno nuevo desde Graph API Explorer

### "No hay posts pendientes"
→ Agrega posts desde el panel de control

### Los posts no se publican automáticamente
→ Verifica que los cron triggers estén en `wrangler.toml` y haz `npm run deploy`

### La IA genera contenido irrelevante
→ Agrega más contexto en el campo "Contexto adicional" al generar

## 📝 Estructura del Proyecto

```
Facebook-Autopost-Cloudflare/
├── src/
│   ├── index.js          # Worker principal
│   ├── handlers.js       # Handlers de API
│   ├── dashboard.html    # HTML del panel
│   └── dashboard.js      # JavaScript del panel
├── scripts/
│   └── setup.js         # Script de configuración
├── wrangler.toml        # Configuración de Cloudflare
├── package.json         # Dependencias
├── README.md           # Esta documentación
└── example-urls.json   # Ejemplo de URLs

```

## 🎨 Características del Panel

### Dashboard
- Estadísticas globales y por proyecto
- Resumen visual de todos los proyectos
- Acceso rápido a funciones principales

### Proyectos
- Tarjetas visuales con estadísticas
- Crear, editar, eliminar proyectos
- Activar/desactivar proyectos
- Configuración individual

### Posts
- Lista completa de posts por proyecto
- Estados visuales (pendiente, publicado, error)
- Agregar individual o en lote
- Publicación manual selectiva

### Generador IA
- Generación individual con preview
- Generación en lote para múltiples URLs
- Contexto personalizado
- Edición antes de guardar

### Configuración
- Guías de configuración
- Ejemplos de comandos
- Enlaces a documentación
- Tips y mejores prácticas

## 🚀 Mejoras Futuras

Ideas para extender el sistema:

- [ ] Programación de posts individuales
- [ ] Soporte para imágenes y videos
- [ ] Publicación en múltiples fanpages
- [ ] Integración con Twitter, LinkedIn
- [ ] Analytics de rendimiento
- [ ] A/B testing de mensajes
- [ ] Plantillas de mensajes reutilizables
- [ ] Webhook notifications
- [ ] Exportación de reportes

## 📚 Recursos

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Facebook Graph API](https://developers.facebook.com/docs/graph-api/)
- [OpenAI API](https://platform.openai.com/docs)
- [Cron Expression Generator](https://crontab.guru/)

## 🤝 Contribuir

Este es un proyecto de código abierto. Siéntete libre de:

1. Fork el repositorio
2. Crear una rama con tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

MIT License - Usa libremente para tus proyectos personales o comerciales.

## 💬 Soporte

¿Preguntas o problemas?
- Revisa los logs: `npx wrangler tail`
- Consulta la documentación de [Cloudflare](https://developers.cloudflare.com/) y [Facebook](https://developers.facebook.com/)
- Abre un issue en GitHub

---

**Desarrollado con ❤️ usando Cloudflare Workers y OpenAI**

¿Te gusta el proyecto? ⭐ Dale una estrella en GitHub!
