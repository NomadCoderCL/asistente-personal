# Añade rutas típicas de instalación al PATH para la sesión actual y ejecuta build_all.ps1
$add = @(
    'C:\Program Files (x86)\NSIS',
    'C:\Program Files\NSIS',
    'C:\Program Files\\Inno Setup 6',
    'C:\Program Files (x86)\\Inno Setup 6',
    'C:\Program Files\\7-Zip',
    'C:\Program Files (x86)\\7-Zip'
)

$existing = $add | Where-Object { Test-Path $_ }
if ($existing.Count -eq 0) {
    Write-Host "No se encontraron rutas típicas instaladas. Aún así continuaré; si fallan los comandos, añade las rutas al PATH." -ForegroundColor Yellow
} else {
    $env:PATH += ';' + ($existing -join ';')
    Write-Host "Rutas añadidas temporalmente al PATH: " ($existing -join ', ')
}

Push-Location $PSScriptRoot
try {
    & .\build_all.ps1 -All
} finally {
    Pop-Location
}
