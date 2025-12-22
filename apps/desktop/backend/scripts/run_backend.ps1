param()

$here = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location (Join-Path $here '..')

if (-not (Test-Path .venv)) {
  python -m venv .venv
}
. .venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
# En Windows no usar uvloop (no compatible). Seleccionar puerto con fallback a 8765 si no está definido.
$port = $env:DESKTOP_BACKEND_PORT
if (-not $port) { $port = 8765 }
python -m uvicorn main:app --host 127.0.0.1 --port $port
