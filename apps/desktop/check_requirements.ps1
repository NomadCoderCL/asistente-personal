# Comprueba si las herramientas necesarias para construir instaladores están disponibles
# Salidas:
# - Código 0: comprobación OK (no hay errores críticos)
# - Código >0: faltan herramientas

$missing = @()

function Check-Command($name) {
    return (Get-Command $name -ErrorAction SilentlyContinue) -ne $null
}

Write-Host "Comprobando herramientas para build..."

if (-not (Check-Command makensis)) { $missing += 'NSIS (makensis)'; } else { Write-Host "- makensis: OK" }
if (-not (Check-Command ISCC.exe)) { $missing += 'Inno Setup (ISCC.exe)'; } else { Write-Host "- ISCC.exe: OK" }
if (-not (Check-Command 7z.exe)) { $missing += '7-Zip (7z.exe)'; } else { Write-Host "- 7z.exe: OK" }

# buscar 7z.sfx en ubicaciones probables
$sfxFound = $false
$possibleSfxPaths = @()
if (Get-Command 7z.exe -ErrorAction SilentlyContinue) {
    $seven = Get-Command 7z.exe
    $possibleSfxPaths += (Join-Path (Split-Path $seven.Path) '7z.sfx')
}
$possibleSfxPaths += 'C:\Program Files\7-Zip\7z.sfx', 'C:\Program Files (x86)\7-Zip\7z.sfx'
foreach ($p in $possibleSfxPaths) { if (Test-Path $p) { $sfxFound = $true; break } }
if (-not $sfxFound) { $missing += '7z.sfx (módulo SFX de 7-Zip)'; } else { Write-Host "- 7z.sfx: OK (ejemplo: $p)" }

if ($missing.Count -gt 0) {
    Write-Host "\nFaltan las siguientes herramientas/software:" -ForegroundColor Yellow
    $missing | ForEach-Object { Write-Host " - $_" }
    Write-Host "\nInstrucciones rápidas:" -ForegroundColor Cyan
    Write-Host " - NSIS: https://nsis.sourceforge.io/ (añade makensis al PATH)"
    Write-Host " - Inno Setup: https://jrsoftware.org/isinfo.php (añade ISCC.exe al PATH)"
    Write-Host " - 7-Zip: https://www.7-zip.org/ (añade 7z.exe al PATH)"
    Write-Host " - Si falta '7z.sfx', copia '7z.sfx' desde la instalación de 7-Zip a la carpeta de 7z.exe o al directorio del script."
    exit 2
} else {
    Write-Host "Todas las herramientas encontradas. Puedes ejecutar los scripts de build." -ForegroundColor Green
    exit 0
}
