/**
 * Script para extraer CSS y JS inline de archivos HTML
 * y crear archivos separados en /assets
 */

const fs = require('fs');
const path = require('path');

const HTML_DIR = path.join(__dirname, '..', 'src');
const CSS_DIR = path.join(__dirname, '..', 'src', 'assets', 'css');
const JS_DIR = path.join(__dirname, '..', 'src', 'assets', 'js');

// Crear directorios si no existen
if (!fs.existsSync(CSS_DIR)) {
  fs.mkdirSync(CSS_DIR, { recursive: true });
}
if (!fs.existsSync(JS_DIR)) {
  fs.mkdirSync(JS_DIR, { recursive: true });
}

/**
 * Extrae CSS de un archivo HTML
 */
function extractCSS(htmlContent, filename) {
  const cssMatch = htmlContent.match(/<style>([\s\S]*?)<\/style>/);
  if (cssMatch) {
    const css = cssMatch[1].trim();
    const cssFilename = filename.replace('.html', '.css');
    const cssPath = path.join(CSS_DIR, cssFilename);
    fs.writeFileSync(cssPath, css);
    console.log(`✅ Extraído CSS: ${cssFilename}`);
    return cssFilename;
  }
  return null;
}

/**
 * Extrae JS de un archivo HTML
 */
function extractJS(htmlContent, filename) {
  const jsMatch = htmlContent.match(/<script>([\s\S]*?)<\/script>/);
  if (jsMatch) {
    const js = jsMatch[1].trim();
    const jsFilename = filename.replace('.html', '.js');
    const jsPath = path.join(JS_DIR, jsFilename);
    fs.writeFileSync(jsPath, js);
    console.log(`✅ Extraído JS: ${jsFilename}`);
    return jsFilename;
  }
  return null;
}

/**
 * Actualiza HTML para usar archivos externos
 */
function updateHTML(htmlContent, cssFilename, jsFilename) {
  let updated = htmlContent;
  
  // Reemplazar <style> con <link>
  if (cssFilename) {
    updated = updated.replace(
      /<style>[\s\S]*?<\/style>/,
      `<link rel="stylesheet" href="/assets/css/${cssFilename}">`
    );
  }
  
  // Reemplazar <script> inline con <script src>
  if (jsFilename) {
    updated = updated.replace(
      /<script>[\s\S]*?<\/script>/,
      `<script src="/assets/js/${jsFilename}"></script>`
    );
  }
  
  return updated;
}

/**
 * Procesa todos los archivos HTML
 */
function processAllHTML() {
  const htmlFiles = fs.readdirSync(HTML_DIR).filter(f => f.endsWith('.html'));
  
  // Excluir dashboard.html (ya tiene archivos separados)
  const filesToProcess = htmlFiles.filter(f => f !== 'dashboard.html');
  
  console.log(`\n📦 Procesando ${filesToProcess.length} archivos HTML...\n`);
  
  filesToProcess.forEach(filename => {
    console.log(`\n🔧 Procesando: ${filename}`);
    
    const htmlPath = path.join(HTML_DIR, filename);
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    // Extraer CSS y JS
    const cssFilename = extractCSS(htmlContent, filename);
    const jsFilename = extractJS(htmlContent, filename);
    
    // Actualizar HTML
    if (cssFilename || jsFilename) {
      const updatedHTML = updateHTML(htmlContent, cssFilename, jsFilename);
      fs.writeFileSync(htmlPath, updatedHTML);
      console.log(`✅ Actualizado HTML: ${filename}`);
    }
  });
  
  console.log(`\n✅ Proceso completado!\n`);
}

// Ejecutar
processAllHTML();
