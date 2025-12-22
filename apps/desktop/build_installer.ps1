# Build script for the NSIS installer
# Requirements: NSIS installed and `makensis` available in PATH

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$winUnpacked = Join-Path $scriptDir "app\release\win-unpacked"
$nsisScript = Join-Path $scriptDir "installer_script.nsi"
$distDir = Join-Path $scriptDir "dist"

if (-not (Test-Path $winUnpacked)) {
    Write-Error "No se encontró la carpeta: $winUnpacked. Ejecuta la build de la app antes."
    exit 1
}

if (-not (Test-Path $nsisScript)) {
    Write-Error "No se encontró el script NSIS: $nsisScript"
    exit 1
}

if (-not (Get-Command makensis -ErrorAction SilentlyContinue)) {
    Write-Error "makensis no está en PATH. Instala NSIS (https://nsis.sourceforge.io/) y añade makensis al PATH."
    exit 1
}

New-Item -ItemType Directory -Path $distDir -Force | Out-Null

Push-Location $scriptDir
try {
    Write-Host "Ejecutando makensis sobre: $nsisScript"
    & makensis $nsisScript
} catch {
    Write-Error "Error al ejecutar makensis: $_"
    Pop-Location
    exit 1
}
Pop-Location

$expected = Join-Path $distDir "Asistente Personal-Setup-0.1.0.exe"
if (Test-Path $expected) {
    Write-Host "Instalador creado correctamente: $expected"
    exit 0
} else {
    Write-Error "No se generó el instalador, comprueba la salida de makensis."
    exit 2
}
