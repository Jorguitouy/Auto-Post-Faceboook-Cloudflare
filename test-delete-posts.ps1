# Script de prueba automatizada para eliminación de posts
# Uso: .\test-delete-posts.ps1

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "PRUEBA DE ELIMINACIÓN DE POSTS" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "https://facebook-auto-publisher.jorgeferreirauy.workers.dev"

# Obtener proyectos
Write-Host "[1/5] Obteniendo proyectos..." -ForegroundColor Yellow
$projects = (Invoke-RestMethod -Uri "$baseUrl/api/projects").projects
Write-Host "      ✓ $($projects.Count) proyectos encontrados" -ForegroundColor Green

if ($projects.Count -eq 0) {
    Write-Host "      ✗ No hay proyectos para probar" -ForegroundColor Red
    exit
}

$project = $projects[0]
Write-Host "      Proyecto seleccionado: $($project.name) (ID: $($project.id))" -ForegroundColor Gray

# Obtener posts del proyecto
Write-Host ""
Write-Host "[2/5] Obteniendo posts del proyecto..." -ForegroundColor Yellow
$timestamp = Get-Date -Format 'yyyyMMddHHmmss'
$postsBefore = (Invoke-RestMethod -Uri "$baseUrl/api/projects/$($project.id)/posts?_=$timestamp").posts
Write-Host "      ✓ $($postsBefore.Count) posts encontrados" -ForegroundColor Green

if ($postsBefore.Count -eq 0) {
    Write-Host "      ✗ No hay posts para probar" -ForegroundColor Red
    exit
}

$testPost = $postsBefore[0]
Write-Host "      Post seleccionado: $($testPost.id)" -ForegroundColor Gray
Write-Host "      URL: $($testPost.url)" -ForegroundColor Gray

# Eliminar el post
Write-Host ""
Write-Host "[3/5] Eliminando post..." -ForegroundColor Yellow
try {
    $deleteResult = Invoke-RestMethod -Uri "$baseUrl/api/projects/$($project.id)/posts/$($testPost.id)" -Method Delete
    if ($deleteResult.success -and $deleteResult.deleted) {
        Write-Host "      ✓ API respondió: success=$($deleteResult.success), deleted=$($deleteResult.deleted)" -ForegroundColor Green
    } else {
        Write-Host "      ✗ API respondió pero no se eliminó: $($deleteResult | ConvertTo-Json)" -ForegroundColor Red
        exit
    }
} catch {
    Write-Host "      ✗ Error al llamar a la API: $_" -ForegroundColor Red
    exit
}

# Esperar un momento para que se propague en KV
Write-Host ""
Write-Host "[4/5] Esperando propagación en Cloudflare KV (2 segundos)..." -ForegroundColor Yellow
Start-Sleep -Seconds 2
Write-Host "      ✓ Listo" -ForegroundColor Green

# Verificar que se eliminó
Write-Host ""
Write-Host "[5/5] Verificando eliminación..." -ForegroundColor Yellow
$timestamp = Get-Date -Format 'yyyyMMddHHmmss'
$postsAfter = (Invoke-RestMethod -Uri "$baseUrl/api/projects/$($project.id)/posts?_=$timestamp").posts
Write-Host "      Posts después: $($postsAfter.Count)" -ForegroundColor Gray

$stillExists = $postsAfter | Where-Object { $_.id -eq $testPost.id }

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "RESULTADO DE LA PRUEBA" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Posts antes:    $($postsBefore.Count)" -ForegroundColor White
Write-Host "Posts después:  $($postsAfter.Count)" -ForegroundColor White
Write-Host "Diferencia:     $($postsBefore.Count - $postsAfter.Count)" -ForegroundColor White
Write-Host ""

if ($stillExists) {
    Write-Host "❌ ERROR: El post AUN EXISTE después de eliminarlo!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Detalles del post que no se eliminó:" -ForegroundColor Yellow
    Write-Host "  ID: $($testPost.id)" -ForegroundColor Gray
    Write-Host "  URL: $($testPost.url)" -ForegroundColor Gray
    exit 1
} else {
    Write-Host "✅ ÉXITO: El post fue eliminado correctamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "La eliminación funciona perfectamente desde la API." -ForegroundColor Green
    Write-Host "Si no funciona desde el panel web, prueba:" -ForegroundColor Yellow
    Write-Host "  1. Recargar la página (Ctrl+R)" -ForegroundColor Gray
    Write-Host "  2. Limpiar caché del navegador (Ctrl+Shift+R)" -ForegroundColor Gray
    Write-Host "  3. Abrir en modo incógnito" -ForegroundColor Gray
    exit 0
}
