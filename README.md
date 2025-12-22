# Asistente Personal

**Asistente inteligente con procesamiento local y privado**

Asistente Personal es una aplicación de escritorio multiplataforma que combina inteligencia artificial local con automatización de tareas. Todo el procesamiento se ejecuta localmente sin necesidad de conexión a internet, garantizando privacidad total.

**NOTA**: Este es un proyecto privado de uso interno. La documentación está dirigida a personal de confianza con acceso autorizado.

## Características Principales

- **Chat con IA Local**: Conversación con modelos de lenguaje ejecutados completamente en la máquina local
- **Tareas Automatizadas**: Ejecución de flujos de trabajo predefinidos para automatización
- **Privacidad Total**: Todos los datos permanecen en el equipo local
- **Interfaz Moderna**: Diseño profesional con React y Electron
- **Alto Rendimiento**: Optimizado para respuestas rápidas
- **Multiidioma**: Soporte para Español, Inglés y Portugués

## Arquitectura del Proyecto

```
personal-assistant/
├── apps/
│   ├── desktop/
│   │   ├── app/              # Frontend (Electron + React + Vite)
│   │   │   ├── src/
│   │   │   │   ├── main/     # Proceso principal de Electron
│   │   │   │   └── renderer/ # Interfaz React
│   │   │   └── package.json
│   │   ├── backend/          # Backend (FastAPI + Python)
│   │   │   ├── main.py       # Servidor principal
│   │   │   ├── llm/          # Integración con Ollama
│   │   │   ├── tasks/        # Tareas automatizadas (YAML)
│   │   │   └── requirements.txt
│   │   └── builder/          # Configuración de electron-builder
│   └── android/              # App móvil Android (Kotlin + Compose)
└── docs/                     # Documentación adicional
```

## Requisitos del Sistema

### Software Requerido

- **Node.js** 16+ y npm
- **Python** 3.8+ (se recomienda 3.11)
- **Git** para control de versiones

### Software Opcional (para funciones de IA)

- **Ollama** - Motor de IA local (https://ollama.ai)
- **Tesseract OCR** - Para funciones de reconocimiento óptico de caracteres

### Requisitos de Hardware

- **CPU**: 2 cores mínimo (4 cores recomendado)
- **RAM**: 4GB mínimo (8GB recomendado)
- **Disco**: 2GB de espacio libre
- **OS**: Windows 10+, macOS 11+, Linux (Ubuntu 20.04+)

## Instalación

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd personal-assistant
```

### 2. Instalar Dependencias del Frontend

```bash
cd apps/desktop/app
npm install
```

### 3. Instalar Dependencias del Backend

#### Windows (CMD):

```cmd
cd ..\backend
python -m venv .venv
.venv\Scripts\activate.bat
python -m pip install --upgrade pip wheel setuptools
pip install -r requirements.txt
```

#### Linux/macOS:

```bash
cd ../backend
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip wheel setuptools
pip install -r requirements.txt
```

### 4. Verificar Instalación

```bash
python check_env.py
```

Este script verificará que todas las dependencias estén correctamente instaladas.

## Uso en Desarrollo

### Iniciar el Backend

```bash
cd apps/desktop/backend
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # Linux/macOS

python -m uvicorn main:app --host 127.0.0.1 --port 8765 --reload
```

### Iniciar el Frontend

En otra terminal:

```bash
cd apps/desktop/app
npm run dev
```

La aplicación se abrirá automáticamente en modo desarrollo.

## Compilar para Producción

### 1. Compilar Frontend

```bash
cd apps/desktop/app
npm run build
```

### 2. Crear Instalador

```bash
npm run dist
```

Esto generará instaladores para la plataforma actual en `apps/desktop/app/dist/`.

## Configuración

### Variables de Entorno

Copia `.env.example` a `.env` y ajusta las variables según sea necesario:

```bash
cp apps/desktop/.env.example apps/desktop/.env
```

### Variables Principales

- `DESKTOP_BACKEND_PORT`: Puerto del backend (default: 8765)
- `DESKTOP_UI_PORT`: Puerto del frontend en desarrollo (default: 5173)
- `APP_ENV`: Modo de la aplicación (`development` | `production`)
- `OLLAMA_DEFAULT_MODEL`: Modelo de IA a usar (default: `qwen2.5:0.5b`)
- `OLLAMA_URL`: URL del servidor Ollama (default: `http://127.0.0.1:11434`)

## Configuración de Ollama (Opcional)

Para habilitar las funciones de IA, es necesario instalar y configurar Ollama:

### 1. Descargar e Instalar Ollama

- Windows: https://ollama.ai/download
- Linux: `curl -fsSL https://ollama.ai/install.sh | sh`
- macOS: `brew install ollama`

### 2. Descargar el Modelo

```bash
ollama pull qwen2.5:0.5b
```

### 3. Verificar Instalación

```bash
ollama list
```

### 4. Reiniciar el Backend

Detén el backend (Ctrl+C) y vuelve a iniciarlo. El sistema detectará automáticamente Ollama y cargará el modelo.

## Tareas Automatizadas

Las tareas se definen en archivos YAML ubicados en `apps/desktop/backend/tasks/`.

### Ejemplo de Tarea

Archivo: `crear_cotizacion_excel.yaml`

```yaml
name: Crear Cotización Excel
description: Genera una cotización profesional en formato Excel
steps:
  - name: Cargar plantilla
    action: load_template
    params:
      template: cotizacion.xlsx
  - name: Rellenar datos
    action: fill_data
    params:
      cliente: ${cliente}
  - name: Guardar archivo
    action: save_file
```

### Ejecutar Tareas

Las tareas se ejecutan desde la interfaz de usuario en la sección "Tareas Automatizadas".

## Solución de Problemas

### El Backend no Inicia

1. Verificar versión de Python: `python --version`
2. Activar el entorno virtual
3. Reinstalar dependencias: `pip install -r requirements.txt`
4. Ejecutar script de verificación: `python check_env.py`
5. Revisar logs en la consola

### Ollama no se Conecta

1. Verificar que Ollama esté ejecutándose: `ollama list`
2. Comprobar que el puerto 11434 esté disponible
3. Verificar la configuración en Settings
4. Revisar logs del backend para mensajes de error

### Error al Compilar en Windows

Si `faiss-cpu` o `chromadb` fallan durante la instalación:

```bash
# Opción 1: Usar conda
conda install -c conda-forge faiss-cpu chromadb

# Opción 2: Omitir dependencias opcionales
# Estas dependencias son opcionales y no afectan las funciones principales
```

### Frontend no se Conecta al Backend

1. Verificar que el backend esté ejecutándose en el puerto 8765
2. Comprobar que no haya firewall bloqueando la conexión
3. Verificar la configuración de CORS en `main.py`
4. Revisar la consola del navegador para errores

## Seguridad y Privacidad

- **Procesamiento Local**: Todos los datos se procesan localmente
- **Sin Conexiones Externas**: No se envía información a servidores externos
- **Modelos Locales**: Los modelos de IA se ejecutan en la máquina local
- **Sin Telemetría**: No hay tracking ni recopilación de datos de uso
- **Datos Encriptados**: Los datos sensibles se almacenan de forma segura

## Estructura de Datos

Los datos de la aplicación se almacenan en:

- **Windows**: `%APPDATA%/personal-assistant/`
- **Linux**: `~/.config/personal-assistant/`
- **macOS**: `~/Library/Application Support/personal-assistant/`

## Documentación Adicional

- [INICIO-RAPIDO.md](INICIO-RAPIDO.md) - Guía de inicio rápido
- [ARQUITECTURA-IA.md](ARQUITECTURA-IA.md) - Detalles de la arquitectura de IA
- [DEPLOYMENT.md](DEPLOYMENT.md) - Guía de despliegue
- [CHANGELOG.md](CHANGELOG.md) - Registro de cambios

## Licencia

Este es un proyecto privado de uso interno. Todos los derechos reservados.

El uso, distribución o modificación de este software está restringido a personal autorizado.

## Contacto y Soporte

Para soporte técnico o consultas:

1. Revisar la sección de Solución de Problemas
2. Ejecutar `python check_env.py` para diagnóstico automático
3. Contactar al equipo de desarrollo con los detalles del problema

---

**Versión**: 0.1.0  
**Última actualización**: Diciembre 2025  
**Estado**: En desarrollo activo
