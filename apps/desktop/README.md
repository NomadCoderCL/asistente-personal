# Asistente Personal - Subsistema Desktop

Este directorio contiene la implementación de la aplicación de escritorio, compuesta por una interfaz Electron/React y un backend FastAPI.

## Estructura del Proyecto

- `app/`: Interfaz de usuario (Frontend). Implementada en Electron, React y Vite.
- `backend/`: Lógica de negocio, integración de IA, y automatización. Implementado en Python/FastAPI.
- `builder/`: Configuraciones de construcción y empaquetado (electron-builder).

## Entorno de Desarrollo

### Frontend (UI)

```bash
cd apps/desktop/app
npm install
npm run dev
```

### Backend (API)

```bash
cd apps/desktop/backend
python -m venv .venv

# Windows
.venv\Scripts\activate
# Linux/macOS
# source .venv/bin/activate

pip install -r requirements.txt
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8765
```

## Configuración de Runtime IA

Los componentes binarios de IA (Ollama) y los modelos de lenguaje no se incluyen en el control de versiones. Deben ser aprovisionados en la siguiente ruta:

`apps/desktop/backend/runtime/ollama/`

Estructura de directorios requerida:

```
backend/runtime/ollama/
├── ollama          # Binario ejecutable (Windows/Linux/macOS)
└── models/         # Directorio de almacenamiento de modelos GGUF
```

Consulte `runtime/ollama/README_RUNTIME.md` para especificaciones detalladas.
