# Build script for Inno Setup installer
# Requirements: Inno Setup installed (ISCC.exe) and `ISCC.exe` available in PATH

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$innoScript = Join-Path $scriptDir "installer_inno.iss"
$distDir = Join-Path $scriptDir "dist"

if (-not (Test-Path $innoScript)) {
    Write-Error "No se encontró el script Inno Setup: $innoScript"
    exit 1
}

if (-not (Get-Command ISCC.exe -ErrorAction SilentlyContinue)) {
    Write-Error "ISCC.exe no está en PATH. Instala Inno Setup (https://jrsoftware.org/isinfo.php) y añade ISCC.exe al PATH."
    exit 1
}

New-Item -ItemType Directory -Path $distDir -Force | Out-Null

Push-Location $scriptDir
try {
    Write-Host "Ejecutando ISCC sobre: $innoScript"
    & ISCC.exe $innoScript
} catch {
    Write-Error "Error al ejecutar ISCC: $_"
    Pop-Location
    exit 1
}
Pop-Location

$expected = Join-Path $distDir "Asistente_Personal-Setup-0.1.0.exe"
if (Test-Path $expected) {
    Write-Host "Instalador Inno creado correctamente: $expected"
    exit 0
} else {
    Write-Error "No se generó el instalador Inno, comprueba la salida de ISCC."
    exit 2
}
