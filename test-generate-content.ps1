# Script de prueba automatizada para generación de contenido con IA
# Uso: .\test-generate-content.ps1

param(
    [string]$ApiKey = "",
    [string]$Provider = "gemini",
    [string]$Model = "models/gemini-2.5-flash"
)

if ([string]::IsNullOrEmpty($ApiKey)) {
    Write-Host "ERROR: Debes proporcionar la API Key" -ForegroundColor Red
    Write-Host "Uso: .\test-generate-content.ps1 -ApiKey 'TU_API_KEY'" -ForegroundColor Yellow
    exit 1
}

$baseUrl = "https://facebook-auto-publisher.jorgeferreirauy.workers.dev"
$adminKey = "Leg3nd123"

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "PRUEBA DE GENERACIÓN DE CONTENIDO IA" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# URLs a probar
$testUrls = @(
    "https://calefon.uy/instalacion-fagor",
    "https://calefon.uy/instalacion-ganim",
    "https://calefon.uy/instalacion-geloso",
    "https://calefon.uy/instalacion-hyundai"
)

Write-Host "[1/4] Configurando API de IA..." -ForegroundColor Yellow
$settingsBody = @{
    aiProvider = $Provider
    aiModel = $Model
    aiApiKey = $ApiKey
} | ConvertTo-Json

try {
    $headers = @{
        'x-admin-key' = $adminKey
        'Content-Type' = 'application/json'
    }
    $result = Invoke-RestMethod -Uri "$baseUrl/api/settings" -Method Post -Headers $headers -Body $settingsBody
    Write-Host "      ✓ Configuración guardada" -ForegroundColor Green
    Write-Host "        Provider: $Provider" -ForegroundColor Gray
    Write-Host "        Model: $Model" -ForegroundColor Gray
} catch {
    Write-Host "      ✗ Error configurando: $_" -ForegroundColor Red
    exit 1
}

# Obtener proyectos
Write-Host ""
Write-Host "[2/4] Obteniendo proyectos..." -ForegroundColor Yellow
$projects = (Invoke-RestMethod -Uri "$baseUrl/api/projects").projects
$project = $projects | Where-Object { $_.domain -like "*calefon.uy*" } | Select-Object -First 1

if (-not $project) {
    Write-Host "      ✗ No se encontró proyecto de calefon.uy" -ForegroundColor Red
    exit 1
}

Write-Host "      ✓ Proyecto encontrado: $($project.name)" -ForegroundColor Green
Write-Host "        ID: $($project.id)" -ForegroundColor Gray

# Generar contenido para cada URL
Write-Host ""
Write-Host "[3/4] Generando contenido con IA..." -ForegroundColor Yellow
$results = @()

foreach ($url in $testUrls) {
    Write-Host ""
    Write-Host "  Procesando: $url" -ForegroundColor White
    
    # Extraer el nombre del producto de la URL
    $productName = ($url -split '/')[-1] -replace 'instalacion-', ''
    $context = "Contenido sobre instalación de calefones marca $productName en Uruguay. Sitio web: calefon.uy"
    
    $generateBody = @{
        url = $url
        context = $context
    } | ConvertTo-Json
    
    try {
        $startTime = Get-Date
        $response = Invoke-RestMethod -Uri "$baseUrl/api/generate-content" -Method Post -Body $generateBody -ContentType "application/json"
        $endTime = Get-Date
        $duration = ($endTime - $startTime).TotalSeconds
        
        if ($response.success) {
            Write-Host "    ✓ Generado en $([math]::Round($duration, 2))s" -ForegroundColor Green
            Write-Host "      Título: $($response.title)" -ForegroundColor Gray
            Write-Host "      Mensaje: $($response.message.Substring(0, [Math]::Min(100, $response.message.Length)))..." -ForegroundColor Gray
            
            $results += [PSCustomObject]@{
                URL = $url
                Success = $true
                Title = $response.title
                Message = $response.message
                Duration = $duration
            }
        } else {
            Write-Host "    ✗ Error: $($response.error)" -ForegroundColor Red
            $results += [PSCustomObject]@{
                URL = $url
                Success = $false
                Error = $response.error
            }
        }
    } catch {
        Write-Host "    ✗ Excepción: $_" -ForegroundColor Red
        $results += [PSCustomObject]@{
            URL = $url
            Success = $false
            Error = $_.Exception.Message
        }
    }
    
    Start-Sleep -Milliseconds 500
}

# Crear posts con el contenido generado
Write-Host ""
Write-Host "[4/4] Creando posts en el proyecto..." -ForegroundColor Yellow

foreach ($result in $results | Where-Object { $_.Success }) {
    try {
        $postBody = @{
            url = $result.URL
            message = $result.Message
            title = $result.Title
        } | ConvertTo-Json
        
        $postResult = Invoke-RestMethod -Uri "$baseUrl/api/projects/$($project.id)/posts" -Method Post -Body $postBody -ContentType "application/json"
        
        if ($postResult.success) {
            Write-Host "  ✓ Post creado: $($result.URL)" -ForegroundColor Green
        } else {
            Write-Host "  ✗ Error creando post: $($result.URL)" -ForegroundColor Red
        }
    } catch {
        Write-Host "  ✗ Excepción creando post: $_" -ForegroundColor Red
    }
}

# Resumen
Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "RESUMEN DE RESULTADOS" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$successful = ($results | Where-Object { $_.Success }).Count
$failed = ($results | Where-Object { -not $_.Success }).Count
$avgDuration = ($results | Where-Object { $_.Success } | Measure-Object -Property Duration -Average).Average

Write-Host "URLs procesadas:    $($testUrls.Count)" -ForegroundColor White
Write-Host "Exitosas:           $successful" -ForegroundColor Green
Write-Host "Fallidas:           $failed" -ForegroundColor $(if ($failed -gt 0) { "Red" } else { "Green" })
if ($avgDuration) {
    Write-Host "Tiempo promedio:    $([math]::Round($avgDuration, 2))s" -ForegroundColor White
}

Write-Host ""
Write-Host "Detalles:" -ForegroundColor Yellow
$results | Format-Table URL, Success, @{Label="Título"; Expression={$_.Title}}, @{Label="Duración (s)"; Expression={[math]::Round($_.Duration, 2)}} -AutoSize

if ($successful -eq $testUrls.Count) {
    Write-Host ""
    Write-Host "✅ TODAS las URLs fueron procesadas exitosamente!" -ForegroundColor Green
    exit 0
} else {
    Write-Host ""
    Write-Host "⚠️ Algunas URLs fallaron. Revisa los errores arriba." -ForegroundColor Yellow
    exit 1
}
