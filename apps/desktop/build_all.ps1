# Orquestador para construir instaladores y portable
# Uso:
# .\build_all.ps1 [-NSIS] [-INNO] [-PORTABLE] [-All]

param(
    [switch]$NSIS,
    [switch]$INNO,
    [switch]$PORTABLE,
    [switch]$All
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Push-Location $scriptDir

if (-not $NSIS -and -not $INNO -and -not $PORTABLE -and -not $All) {
    Write-Host "Ninguna opción pasada; detectando herramientas disponibles y construyendo todo lo posible..."
    & .\check_requirements.ps1
    $All = $true
}

if ($All -or $NSIS) {
    if (Get-Command makensis -ErrorAction SilentlyContinue) {
        Write-Host "Construyendo instalador NSIS..."
        & .\build_installer.ps1
    } else { Write-Host "makensis no disponible — saltando NSIS." }
}

if ($All -or $INNO) {
    if (Get-Command ISCC.exe -ErrorAction SilentlyContinue) {
        Write-Host "Construyendo instalador Inno..."
        & .\build_inno.ps1
    } else { Write-Host "ISCC.exe no disponible — saltando Inno." }
}

if ($All -or $PORTABLE) {
    if (Get-Command 7z.exe -ErrorAction SilentlyContinue) {
        Write-Host "Construyendo ejecutable portable (7-Zip SFX)..."
        & .\build_portable.ps1
    } else { Write-Host "7z.exe no disponible — saltando portable." }
}

Pop-Location
