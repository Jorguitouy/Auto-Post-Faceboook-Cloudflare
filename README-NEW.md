# 📘 Facebook Auto-Publisher - Sistema Multi-Proyecto con IA

Sistema automatizado profesional para publicar contenido en Facebook desde múltiples sitios web, con gestión por proyectos separados y generación de contenido mediante Inteligencia Artificial.

## 🌟 Características Principales

### ✨ Multi-Proyecto
- **Gestión separada** por cada sitio web/dominio
- **Configuración independiente** para cada proyecto
- **Estadísticas individuales** por proyecto
- **Activación/desactivación** selectiva de proyectos

### 🤖 Generación de Contenido con IA
- **OpenAI GPT** integrado para crear contenido automáticamente
- **Análisis de URLs** para generar mensajes relevantes
- **Personalización** basada en el contenido de cada página
- **Generación en lote** para múltiples URLs
- **Mensajes optimizados** con emojis y llamados a la acción

### 📊 Panel de Control Profesional
- **Interfaz gráfica moderna** con HTML/CSS/JS
- **Dashboard interactivo** con estadísticas en tiempo real
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

### 4. Configurar Credenciales de Facebook

1. Ve a [Facebook Developers](https://developers.facebook.com/)
2. Crea una app o selecciona una existente
3. Ve a **Herramientas > Graph API Explorer**
4. Selecciona tu app y tu página
5. Agrega permisos: `pages_manage_posts`, `pages_read_engagement`
6. Genera un token de acceso de página
7. Obtén el ID de tu página

```powershell
# Configurar token de Facebook
npx wrangler secret put FB_PAGE_ACCESS_TOKEN
# Pega tu token cuando te lo pida

# Configurar ID de página
npx wrangler secret put FB_PAGE_ID
# Pega el ID de tu página
```

### 5. Configurar OpenAI (Opcional - Para IA)

Para habilitar la generación automática de contenido:

1. Obtén una API Key en [OpenAI Platform](https://platform.openai.com/api-keys)
2. Configura el secreto:

```powershell
npx wrangler secret put OPENAI_API_KEY
# Pega tu API key cuando te lo pida
```

### 6. Desplegar

```powershell
npm run deploy
```

¡Listo! Tu worker estará disponible en una URL como:
`https://facebook-auto-publisher.tu-cuenta.workers.dev`

## 📖 Guía de Uso

### Crear Proyectos

1. Accede al panel de control en la URL de tu worker
2. Ve a la pestaña **📁 Proyectos**
3. Completa el formulario:
   - **Nombre**: Identificador del proyecto (ej: "Blog Personal")
   - **Dominio**: URL del sitio (ej: "www.miblog.com")
   - **Descripción**: Opcional, describe el proyecto
   - **IA Habilitada**: Permite generar contenido automático
   - **Auto-publicar**: Publica en horarios programados
4. Click en **➕ Crear Proyecto**

### Agregar Posts Manualmente

1. Ve a la pestaña **📝 Posts**
2. Selecciona un proyecto
3. Ingresa la URL y el mensaje
4. Click en **➕ Agregar Post**

### Usar el Generador de IA

#### Individual:
1. Ve a la pestaña **🤖 Generador IA**
2. Selecciona el proyecto
3. Pega la URL del contenido
4. (Opcional) Agrega contexto adicional
5. Click en **✨ Generar Contenido**
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
