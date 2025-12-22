# Crea un ejecutable portable (self-extracting) usando 7-Zip SFX
# Requisitos: 7z.exe en PATH y 7z.sfx (del paquete 7-Zip). Si instalaste 7-Zip, `7z.sfx` suele estar junto a `7z.exe`.

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$winUnpacked = Join-Path $scriptDir "app\release\win-unpacked"
$distDir = Join-Path $scriptDir "dist"
$archive = Join-Path $distDir "portable.7z"
$outExe = Join-Path $distDir "Asistente_Personal-Portable.exe"
$configFile = Join-Path $scriptDir "portable_config.txt"

if (-not (Test-Path $winUnpacked)) {
    Write-Error "No se encontró la carpeta: $winUnpacked. Ejecuta la build de la app antes."
    exit 1
}

if (-not (Test-Path $configFile)) {
    Write-Error "No se encontró el archivo de configuración SFX: $configFile"
    exit 1
}

$sevenZip = (Get-Command 7z.exe -ErrorAction SilentlyContinue)
if (-not $sevenZip) {
    Write-Error "7z.exe no está en PATH. Instala 7-Zip y añade 7z.exe al PATH."
    exit 1
}

$sevenZipPath = Split-Path $sevenZip.Path
$possibleSfx = @(Join-Path $sevenZipPath '7z.sfx', "C:\\Program Files\\7-Zip\\7z.sfx", "C:\\Program Files (x86)\\7-Zip\\7z.sfx")
$sfxModule = $possibleSfx | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $sfxModule) {
    Write-Error "No se encontró '7z.sfx'. Está normalmente en la instalación de 7-Zip. Instala 7-Zip o copia 7z.sfx en la carpeta de 7z.exe."
    exit 1
}

New-Item -ItemType Directory -Path $distDir -Force | Out-Null

Push-Location $scriptDir
try {
    Write-Host "Creando archivo 7z de la carpeta: $winUnpacked"
    & "$($sevenZip.Path)" a -t7z "$archive" "$winUnpacked\*" -mx9 | Out-Null
} catch {
    Write-Error "Error al crear el archivo 7z: $_"
    Pop-Location
    exit 1
}

Pop-Location

try {
    $sfxBytes = [System.IO.File]::ReadAllBytes($sfxModule)
    $configBytes = [System.Text.Encoding]::UTF8.GetBytes((Get-Content $configFile -Raw))
    $archiveBytes = [System.IO.File]::ReadAllBytes($archive)

    $combined = New-Object System.Byte[] ($sfxBytes.Length + $configBytes.Length + $archiveBytes.Length)
    [Array]::Copy($sfxBytes, 0, $combined, 0, $sfxBytes.Length)
    [Array]::Copy($configBytes, 0, $combined, $sfxBytes.Length, $configBytes.Length)
    [Array]::Copy($archiveBytes, 0, $combined, $sfxBytes.Length + $configBytes.Length, $archiveBytes.Length)

    [System.IO.File]::WriteAllBytes($outExe, $combined)
    Write-Host "Portable creado: $outExe"
} catch {
    Write-Error "Error al construir el ejecutable portable: $_"
    exit 1
}
