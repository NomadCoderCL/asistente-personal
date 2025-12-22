# Guía de Inicio Rápido - Asistente Personal

Esta guía detalla los pasos para la puesta en marcha de Asistente Personal en entorno local.

---

## Inicio Rápido (Windows)

### 1. Verificar Requisitos de Software

Ejecutar los siguientes comandos en la terminal para verificar las instalaciones previas:

```cmd
# Verificar Node.js (Requerido v16+)
node --version

# Verificar npm
npm --version

# Verificar Python (Requerido 3.8+)
python --version
# Alternativa:
py --version
```

**Nota:** Si Python no está instalado, descargar la última versión estable desde [python.org](https://www.python.org/downloads/) y asegurar marcar la opción "Add Python to PATH" durante la instalación.

---

### 2. Instalación de Dependencias del Frontend

```cmd
cd "apps\desktop\app"
npm install
```

---

### 3. Instalación de Dependencias del Backend

```cmd
cd "..\backend"

# Crear entorno virtual
python -m venv .venv

# Activar entorno virtual
.venv\Scripts\activate.bat

# Actualizar herramientas de instalación
python -m pip install --upgrade pip wheel setuptools

# Instalar dependencias requeridas
pip install -r requirements.txt
```

**Nota:** Las dependencias opcionales como `faiss-cpu` o `chromadb` pueden omitirse si presentan errores de compilación, ya que no son críticas para el funcionamiento básico.

---

### 4. Verificación de Instalación

```cmd
# Ejecutar script de diagnóstico en la carpeta backend (entorno virtual activo)
python check_env.py
```

Este script validará que todos los componentes necesarios estén correctamente configurados.

---

### 5. Ejecución de la Aplicación

Para desarrollo, se requieren dos terminales separadas:

**Terminal 1 - Backend:**
```cmd
cd "apps\desktop\backend"
.venv\Scripts\activate.bat
python -m uvicorn main:app --host 127.0.0.1 --port 8765 --reload
```

**Terminal 2 - Frontend:**
```cmd
cd "apps\desktop\app"
npm run dev
```

La aplicación estará disponible en la dirección local indicada por Vite (usualmente http://localhost:5173).

---

## Verificación de Funcionalidad

### Módulo de Chat
1. Acceder a la sección Chat.
2. Verificar el indicador de estado "Conectado".
3. Realizar una prueba de envío de mensajes.
4. Nota: Si el motor IA no está configurado, el sistema responderá con limitaciones.

### Configuración del Sistema
1. Acceder a Configuración.
2. Utilizar la función de actualización de estado.
3. Verificar la conectividad del Backend FastAPI.

### Automatización de Tareas
1. Acceder a la sección Tareas.
2. Ejecutar una tarea de prueba para validar el motor de automatización.

---

## Instalación de Motor IA (Opcional)

Para habilitar las capacidades de inteligencia artificial local:

### 1. Instalación de Ollama
Descargar e instalar el runtime desde [ollama.ai](https://ollama.ai).

### 2. Descarga del Modelo
Ejecutar en terminal:
```cmd
ollama pull qwen2.5:0.5b
```

### 3. Verificación
```cmd
ollama list
```

### 4. Reinicio de Servicios
Reiniciar el proceso del backend para que detecte el nuevo runtime de IA.

---

## Solución de Problemas Frecuentes

### Comandos no reconocidos
Si el sistema no reconoce `python` o `npm`, verificar las variables de entorno PATH del sistema operativo y reiniciar la terminal.

### Errores de Dependencias
Para problemas durante `pip install`, intentar la instalación sin caché:
```cmd
pip install -r requirements.txt --no-cache-dir
```

### Problemas de Conectividad
Si la aplicación reporta "Backend no disponible":
1. Confirmar que el proceso de Python (`uvicorn`) está activo y sin errores.
2. Verificar acceso a http://127.0.0.1:8765/health en el navegador.
3. Revisar configuración de puertos y firewall.

---

## Generación de Ejecutables

Para compilar la versión de producción:

```cmd
cd "apps\desktop\app"
npm run build
npm run dist
```

Consultar el archivo `DEPLOYMENT.md` para detalles avanzados sobre distribución.

---

## Recursos Adicionales

- `README.md`: Documentación general del proyecto.
- `DEPLOYMENT.md`: Guía detallada de despliegue.
- `ARQUITECTURA-IA.md`: Especificaciones técnicas del subsistema de IA.
