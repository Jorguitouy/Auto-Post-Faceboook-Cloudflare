# 🎯 Multi-Proyecto con Fanpages Independientes

## ✅ Implementación Completada

Ahora cada proyecto puede conectar su **propia fanpage de Facebook** de manera independiente.

---

## 📋 ¿Qué cambió?

### **Antes:**
- Todos los proyectos compartían las mismas credenciales de Facebook
- Solo podías publicar en una fanpage global
- Configuración en el tab "Configuración"

### **Ahora:**
- ✅ Cada proyecto tiene su propia fanpage
- ✅ Puedes publicar en múltiples fanpages diferentes
- ✅ Conexión/desconexión por proyecto
- ✅ Estado visible en cada tarjeta de proyecto

---

## 🚀 Cómo Usar

### **1. Crear un Proyecto**

```
Dashboard → Tab "📁 Proyectos" → Crear Proyecto

Nombre: Proyecto A
Dominio: sitio-a.com
URLs: (tus URLs)
```

El proyecto se crea **sin fanpage conectada**.

---

### **2. Conectar una Fanpage al Proyecto**

En la tarjeta del proyecto verás:

```
❌ No conectado a Facebook  [Conectar]
```

**Pasos:**
1. Click en **[Conectar]**
2. Se abre ventana de Facebook OAuth
3. Autoriza permisos
4. Selecciona la fanpage de la lista
5. Click en "Conectar Página Seleccionada"
6. ¡Listo! Verás: `✅ Facebook: Nombre de tu Fanpage`

---

### **3. Crear Múltiples Proyectos con Diferentes Fanpages**

**Ejemplo:**

```
┌─────────────────────────────────────────────┐
│ Proyecto A - sitio-a.com                    │
│ ✅ Facebook: Fanpage Tech                   │
│ [📝 Posts] [🤖 IA Auto] [✏️ Editar]        │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Proyecto B - sitio-b.com                    │
│ ✅ Facebook: Fanpage Negocios               │
│ [📝 Posts] [🤖 IA Auto] [✏️ Editar]        │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Proyecto C - sitio-c.com                    │
│ ❌ No conectado a Facebook [Conectar]       │
│ [📝 Posts] [🤖 IA Auto] [✏️ Editar]        │
└─────────────────────────────────────────────┘
```

---

## 🔄 Publicación Automática

### **Cron Triggers**

El sistema publica automáticamente según los horarios configurados en `wrangler.toml`:

```toml
[triggers]
crons = [
  "0 9 * * *",   # 9:00 AM
  "0 14 * * *",  # 2:00 PM
  "0 19 * * *"   # 7:00 PM
]
```

### **¿Cómo funciona?**

1. El cron se ejecuta (ej: 9:00 AM)
2. Busca el **primer post pendiente** de cualquier proyecto activo
3. **Solo publica** si el proyecto tiene fanpage conectada
4. Usa las credenciales específicas de ese proyecto
5. El siguiente cron publicará el siguiente post (puede ser de otro proyecto)

### **Ejemplo de Publicación:**

```
9:00 AM  → Post del Proyecto A → Fanpage Tech
2:00 PM  → Post del Proyecto B → Fanpage Negocios
7:00 PM  → Post del Proyecto A → Fanpage Tech
9:00 AM  → Post del Proyecto C → (SALTA - no conectado)
9:00 AM  → Post del Proyecto B → Fanpage Negocios
```

---

## 🛠️ Desconectar una Fanpage

Si necesitas cambiar de fanpage o desconectar:

1. Click en **[Desconectar]** en la tarjeta del proyecto
2. Confirma la acción
3. El proyecto queda sin fanpage
4. Puedes reconectar otra fanpage diferente

**Nota:** Los posts pendientes NO se publicarán hasta que reconectes una fanpage.

---

## 📊 Estructura de Datos

### **Proyecto (antes):**
```json
{
  "id": "proj-123",
  "name": "Proyecto A",
  "domain": "sitio-a.com",
  "fbPageId": "123456789"  // ❌ Compartido globalmente
}
```

### **Proyecto (ahora):**
```json
{
  "id": "proj-123",
  "name": "Proyecto A",
  "domain": "sitio-a.com",
  "fbPageId": "123456789",           // ✅ Específico del proyecto
  "fbPageAccessToken": "EAABsb...",  // ✅ Específico del proyecto
  "fbPageName": "Fanpage Tech",      // ✅ Nombre visible
  "fbConnected": true,               // ✅ Estado de conexión
  "fbConnectedAt": "2025-11-06...",  // ✅ Fecha de conexión
  "fbUserId": "987654321",
  "fbUserName": "Usuario Admin"
}
```

---

## 🔐 Seguridad

### **Tokens de Larga Duración**

- Los tokens de Facebook son de **larga duración** (60 días)
- Se renuevan automáticamente si reconectas
- Cada proyecto tiene su propio token aislado

### **Almacenamiento**

- Credenciales guardadas en **Cloudflare KV**
- Cada proyecto en clave separada: `projects`
- No se mezclan credenciales entre proyectos

---

## ⚙️ Configuración Requerida

### **Facebook App (una vez)**

Necesitas una Facebook App con estos permisos:

```
✅ pages_show_list
✅ pages_read_engagement
✅ pages_manage_posts
✅ pages_manage_engagement
```

### **Variables de Entorno**

```bash
# Secrets (configurar con wrangler secret put)
wrangler secret put FACEBOOK_APP_ID
wrangler secret put FACEBOOK_APP_SECRET
wrangler secret put ADMIN_KEY
```

La misma App puede conectar múltiples fanpages a diferentes proyectos.

---

## 🎯 Casos de Uso

### **Caso 1: Agencia Digital**
```
Cliente A → Proyecto A → Fanpage del Cliente A
Cliente B → Proyecto B → Fanpage del Cliente B
Cliente C → Proyecto C → Fanpage del Cliente C
```

### **Caso 2: Emprendedor con Múltiples Negocios**
```
Negocio Tech     → Proyecto 1 → Fanpage Tech
Negocio Gastro   → Proyecto 2 → Fanpage Restaurant
Negocio Fitness  → Proyecto 3 → Fanpage Gym
```

### **Caso 3: Sitios Multilenguaje**
```
Sitio EN → Proyecto 1 → Fanpage English
Sitio ES → Proyecto 2 → Fanpage Español
Sitio PT → Proyecto 3 → Fanpage Português
```

---

## 🧪 Testing

### **Prueba Básica:**

1. Crea 2 proyectos diferentes
2. Conecta cada uno a una fanpage distinta
3. Agrega posts a ambos proyectos
4. Click en "Publicar Ahora" en cada uno
5. Verifica que se publican en las fanpages correctas

### **Prueba de Cron:**

1. Configura posts pendientes en diferentes proyectos
2. Espera al siguiente cron trigger
3. Verifica que se publique en la fanpage correspondiente

---

## 🐛 Troubleshooting

### **Problema: "Este proyecto no tiene una fanpage conectada"**

**Solución:**
- Asegúrate de haber hecho click en [Conectar]
- Verifica que completaste el flujo OAuth
- Recarga la página y verifica el estado

### **Problema: "Error al publicar"**

**Solución:**
1. Verifica que la fanpage siga activa
2. Reconecta la fanpage (desconectar → conectar)
3. Verifica permisos en Facebook App

### **Problema: "No se publican posts"**

**Solución:**
- Verifica que el proyecto tenga `fbConnected: true`
- Verifica que haya posts con `status: 'pending'`
- Revisa los logs del Worker en Cloudflare Dashboard

---

## 📝 Migración de Proyectos Existentes

Si ya tenías proyectos creados antes de esta actualización:

### **Opción 1: Automático (al reconectar)**
1. Ve a cada proyecto
2. Click en [Conectar]
3. Autoriza y selecciona fanpage
4. El proyecto se actualiza automáticamente

### **Opción 2: Manual (KV)**
Si tienes muchos proyectos, puedes actualizar el KV directamente:

```javascript
// En Cloudflare Workers KV
// Clave: "projects"
{
  "projects": [
    {
      "id": "proj-123",
      "name": "Proyecto Existente",
      // Agregar estos campos:
      "fbPageId": "TU_PAGE_ID",
      "fbPageAccessToken": "TU_TOKEN",
      "fbPageName": "Nombre Fanpage",
      "fbConnected": true,
      "fbConnectedAt": "2025-11-06T..."
    }
  ]
}
```

---

## 🎉 ¡Listo!

Ahora tienes un sistema multi-proyecto completamente funcional donde cada proyecto puede publicar en su propia fanpage de Facebook de manera independiente.

**Próximos pasos sugeridos:**
- Crear tus proyectos
- Conectar fanpages
- Agregar URLs y generar contenido con IA
- Dejar que el sistema publique automáticamente

---

## 📚 Archivos Modificados

### **Backend:**
- ✅ `src/index-new.js` - Estructura de proyectos
- ✅ `src/handlers.js` - Publicación con credenciales por proyecto
- ✅ `src/facebook-auth.js` - OAuth y gestión de conexiones

### **Frontend:**
- ✅ `src/dashboard.js` - UI con botones conectar/desconectar
- ✅ `src/dashboard.html` - (sin cambios necesarios)

### **Documentación:**
- ✅ `MULTI-PROYECTO-FACEBOOK.md` - Este archivo

---

**Desarrollado con ❤️ para soportar múltiples proyectos independientes**
