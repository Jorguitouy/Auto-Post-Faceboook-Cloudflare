# 📋 Guía Rápida: Cargar URLs desde el Panel

## 🎯 Flujo Completo para tus 8 Sitios con 200 URLs cada uno

### **1. Acceder al Panel**
```
https://facebook-auto-publisher.jorgeferreirauy.workers.dev
```

### **2. Configurar IA (Solo una vez)**

1. Ve a la pestaña **⚙️ Configuración**
2. Completa:
   - **Clave de Administrador**: La que configuraste con `wrangler secret put ADMIN_KEY`
   - **Proveedor de IA**: Selecciona **Gemini** (GRATIS ✅) o OpenAI
   - **Modelo**: 
     - Para Gemini: `Gemini 1.5 Flash` (recomendado - 15 req/min gratis)
     - Para OpenAI: `GPT-4o Mini` (más económico - $0.00015/1K tokens)
   - **API Key**: 
     - Gemini: https://makersuite.google.com/app/apikey
     - OpenAI: https://platform.openai.com/api-keys
   - **Facebook** (opcional ahora, requerido para publicar):
     - Page ID
     - Page Access Token
3. Click **💾 Guardar Configuración**

### **3. Crear Proyecto con URLs**

Por cada uno de tus 8 sitios:

1. Ve a la pestaña **📁 Proyectos**
2. En "➕ Crear Nuevo Proyecto":
   - **Nombre**: `Sitio 1` (ej: "Blog Personal")
   - **Dominio**: `www.sitio1.com`
   - **Descripción**: Opcional
   - **URLs del Proyecto**: 
     ```
     Pega tus 200 URLs aquí, una por línea:
     https://www.sitio1.com/articulo-1
     https://www.sitio1.com/articulo-2
     https://www.sitio1.com/articulo-3
     ...
     https://www.sitio1.com/articulo-200
     ```
   - ✅ **Habilitar generación de contenido con IA** (checked)
   - ✅ **Publicar automáticamente...** (checked)
3. Click **➕ Crear Proyecto**

**Resultado**: Proyecto creado con 200 URLs listas para procesar

### **4. Generar Contenido con IA**

Después de crear cada proyecto:

1. En la tarjeta del proyecto verás:
   ```
   📦 Sitio 1
   🌐 www.sitio1.com
   
   Total: 0    Pendiente: 0    Publicado: 0    URLs: 200
   
   [📝 Posts] [🤖 IA Auto] [✏️ Editar] [🗑️]
   ```

2. Click en el botón **🤖 IA Auto**

3. Aparecerá un diálogo:
   ```
   Generar contenido con IA para "Sitio 1"?
   
   📊 URLs totales: 200
   ✅ Ya procesadas: 0
   ⏳ Por procesar: 200
   
   Se procesarán hasta 50 URLs por vez.
   Esto puede tardar varios minutos.
   ```

4. Click **Aceptar**

5. Espera ~5 minutos mientras genera contenido

6. Verás el resultado:
   ```
   ✅ Generación completada!
   
   ✨ Procesadas: 50
   ❌ Errores: 0
   ⏳ Restantes: 150
   
   Ejecuta nuevamente para procesar las restantes.
   ```

7. Repite 3 veces más (total 4 clicks) hasta completar las 200 URLs

### **5. Repetir para los 8 Sitios**

Repite los pasos 3 y 4 para cada uno de tus sitios.

**Tiempo estimado total**:
- Crear 8 proyectos: ~10 minutos
- Generar contenido (8 × 200 URLs):
  - Con Gemini: ~3-4 horas (gratis)
  - Con OpenAI GPT-4o Mini: ~2 horas (~$3-4 USD)

## 📊 Ejemplo Práctico

### **Caso: 8 Sitios, 200 URLs cada uno = 1,600 URLs**

```
Sitio 1 (Blog):
  ✅ Proyecto creado con 200 URLs
  🤖 Click "IA Auto" × 4 veces
  ⏱ 20 minutos
  ✅ 200 posts generados

Sitio 2 (Tienda):
  ✅ Proyecto creado con 200 URLs
  🤖 Click "IA Auto" × 4 veces
  ⏱ 20 minutos
  ✅ 200 posts generados

...repetir para sitios 3-8...

Total:
  ✅ 8 proyectos creados
  ✅ 1,600 URLs cargadas manualmente
  ✅ 1,600 posts generados con IA
  ⏱ Tiempo: 3-4 horas
  💰 Costo: $0 (con Gemini)
```

## 🔧 Agregar o Editar URLs Después

Si necesitas agregar más URLs a un proyecto existente:

1. Ve a **📁 Proyectos**
2. Click en **✏️ Editar** del proyecto
3. En el modal, verás el campo **URLs del Proyecto**
4. Agrega, edita o elimina URLs (una por línea)
5. Click **💾 Guardar Cambios**
6. Las nuevas URLs están listas para procesar con **🤖 IA Auto**

## ⚡ Tips para Cargar URLs

### **Desde Excel/Google Sheets**
Si tienes tus URLs en una hoja de cálculo:

1. Selecciona la columna de URLs
2. Copia (Ctrl+C)
3. Pega en el campo "URLs del Proyecto"
4. ¡Listo!

### **Desde un archivo .txt**
1. Abre el archivo con todas las URLs
2. Ctrl+A (seleccionar todo)
3. Ctrl+C (copiar)
4. Pega en el campo "URLs del Proyecto"

### **Límites**
- ✅ Máximo 500 URLs por proyecto
- ✅ Si tienes más, crea múltiples proyectos
- ✅ Ejemplo: "Sitio 1 - Parte 1" (500 URLs), "Sitio 1 - Parte 2" (200 URLs)

## 🎯 Siguientes Pasos

Una vez generado todo el contenido:

### **Revisar Posts**
1. Ve a **📝 Posts**
2. Selecciona un proyecto
3. Verás todos los posts generados con su contenido
4. Puedes editar o eliminar posts individuales

### **Publicar en Facebook**
Los posts se publicarán automáticamente en los horarios configurados:
- 9:00 AM
- 2:00 PM
- 7:00 PM

O puedes publicarlos manualmente haciendo click en **📤 Publicar**

### **Ver Estadísticas**
1. Ve a **📊 Dashboard**
2. Verás:
   - Total de proyectos
   - Total de posts
   - Posts publicados
   - Posts pendientes

## 🛠 Solución de Problemas

### **"No se encontraron URLs válidas"**
- Asegúrate de que cada URL empiece con `http://` o `https://`
- Una URL por línea
- Sin espacios al inicio o final

### **"Máximo 500 URLs por proyecto"**
- Divide tu sitio en múltiples proyectos
- Ejemplo: 
  - "Mi Blog - Parte 1" (500 URLs)
  - "Mi Blog - Parte 2" (200 URLs)

### **Botón "🤖 IA Auto" no aparece**
- Refresca la página (F5)
- Verifica que el proyecto tenga URLs cargadas
- Verifica que hayas configurado la API Key de IA

### **"Error: API Key no configurada"**
- Ve a **⚙️ Configuración**
- Configura tu API Key (Gemini u OpenAI)
- Guarda los cambios

## 🎉 ¡Listo!

Con este flujo puedes:
- ✅ Cargar manualmente todas tus URLs desde el panel
- ✅ Generar contenido optimizado con IA para todas ellas
- ✅ Publicar automáticamente en Facebook
- ✅ Todo sin tocar código ni línea de comandos

**¡Empieza ahora!**
👉 https://facebook-auto-publisher.jorgeferreirauy.workers.dev
