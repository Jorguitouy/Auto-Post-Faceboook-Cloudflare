# 🔐 Guía de Seguridad - Gestión de API Keys

## ⚠️ NUNCA compartas tus API Keys públicamente

### 🚫 Lo que NO debes hacer:
- ❌ Subir API Keys a GitHub
- ❌ Compartir claves en chats públicos
- ❌ Incluir credenciales en código fuente
- ❌ Usar la misma clave para múltiples proyectos sin restricciones

### ✅ Buenas prácticas:

#### 1. **Usar variables de entorno**
```bash
# Archivo .env (NUNCA subir a Git)
GEMINI_API_KEY=AIzaSy...
OPENAI_API_KEY=sk-...
```

#### 2. **Usar Wrangler Secrets para Cloudflare**
```bash
# Configurar secretos de forma segura
npx wrangler secret put ADMIN_KEY
npx wrangler secret put GEMINI_API_KEY
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put FB_PAGE_ACCESS_TOKEN
```

#### 3. **Configurar restricciones de API**

##### Google Gemini:
1. Ve a: https://console.cloud.google.com/apis/credentials
2. Click en tu API Key
3. **Application restrictions:**
   - Tipo: "HTTP referrers (web sites)"
   - Agregar: `https://tu-worker.workers.dev/*`
4. **API restrictions:**
   - Seleccionar: "Restrict key"
   - Marcar solo: "Generative Language API"

##### OpenAI:
1. Ve a: https://platform.openai.com/api-keys
2. Click en tu API Key → "Edit"
3. Configurar límites de uso mensuales
4. Activar alertas de gasto

##### Facebook:
1. Usar Page Access Tokens de larga duración
2. Configurar permisos mínimos necesarios
3. Revisar Apps & Websites en configuración de página

#### 4. **Monitorear uso**
- ✅ Revisa regularmente el consumo de APIs
- ✅ Configura alertas de gasto/cuota
- ✅ Revoca claves comprometidas inmediatamente

#### 5. **Archivos seguros**
Estos archivos ya están en `.gitignore`:
```
.env
.env.local
.dev.vars
test-*.ps1
*-test.ps1
config.json
secrets.json
credentials.json
```

---

## 🆘 ¿Tu API Key fue expuesta?

### Pasos inmediatos:

1. **Revoca la clave comprometida:**
   - Google Gemini: https://makersuite.google.com/app/apikey
   - OpenAI: https://platform.openai.com/api-keys
   - Facebook: https://developers.facebook.com/apps

2. **Crea una nueva clave:**
   - Genera una nueva API Key
   - Configura restricciones ANTES de usarla

3. **Actualiza tus secretos:**
   ```bash
   npx wrangler secret put GEMINI_API_KEY
   # Pega la nueva clave cuando te lo pida
   ```

4. **Verifica el historial de Git:**
   ```bash
   # Ver si hay claves en commits anteriores
   git log -S "AIzaSy" --all
   
   # Para limpiar historial (CUIDADO: reescribe historial)
   # Consulta: https://docs.github.com/es/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository
   ```

5. **Habilita 2FA:**
   - GitHub: https://github.com/settings/security
   - Google Cloud: https://myaccount.google.com/security
   - OpenAI: https://platform.openai.com/account/user-security

---

## 📋 Checklist de seguridad

- [ ] Todas las API Keys están en Wrangler Secrets (no en código)
- [ ] Archivo `.gitignore` incluye `.env` y `.dev.vars`
- [ ] APIs configuradas con restricciones (dominio/IP)
- [ ] Límites de gasto configurados
- [ ] Alertas de uso activadas
- [ ] 2FA habilitado en todas las cuentas
- [ ] Revisión mensual de accesos y uso

---

## 🔗 Enlaces útiles

- **Cloudflare Workers Secrets**: https://developers.cloudflare.com/workers/configuration/secrets/
- **Google Cloud Security**: https://console.cloud.google.com/apis/credentials
- **OpenAI Best Practices**: https://platform.openai.com/docs/guides/safety-best-practices
- **Facebook App Security**: https://developers.facebook.com/docs/development/release/security-best-practices
- **GitHub Security**: https://docs.github.com/es/code-security

---

**Última actualización:** 5 de noviembre de 2025
