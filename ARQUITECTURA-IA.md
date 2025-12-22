# Arquitectura de Subsistema de IA

## Resumen Ejecutivo

El sistema implementa una arquitectura de inferencia local utilizando modelos de lenguaje masivos (LLM) optimizados para ejecutarse en hardware de consumo moderado. Se ha seleccionado la familia de modelos **Qwen** por su eficiencia y capacidad de rendimiento en entornos con recursos limitados, garantizando la privacidad de los datos al eliminar la dependencia de servicios en la nube.

---

## Subsistema Desktop (Electron + Python Backend)

### Configuración del Modelo
- **Modelo:** `qwen2.5:0.5b`
- **Tamaño aproximado:** 500MB
- **Motor de Inferencia:** Ollama (modo portable)
- **Ubicación del Runtime:** `apps/desktop/backend/runtime/ollama/`

### Flujo de Operación

1. **Inicialización de Servicios:**
   - El backend supervisa el proceso de Ollama durante el inicio.
   - Intenta ejecutar el binario localizado en `runtime/ollama/ollama` (o `.exe`).
   - El sistema opera en modo degradado (sin IA) si el runtime no está disponible.

2. **Gestión de Modelos:**
   - **Entorno de Desarrollo:** Intentos automáticos de descarga del modelo basándose en variables de entorno.
   - **Entorno de Producción:** Se asume la pre-existencia del modelo o se requiere instalación manual.
   - Comando de aprovisionamiento: `ollama pull qwen2.5:0.5b`

3. **Configuración de Entorno:**
   - `OLLAMA_DEFAULT_MODEL`: Identificador del modelo (defecto: `qwen2.5:0.5b`).
   - `OLLAMA_URL`: Endpoint de la API de inferencia (defecto: `http://127.0.0.1:11434`).
   - `OLLAMA_MODELS`: Ruta de almacenamiento de pesos (defecto: `runtime/ollama/models`).

### Componentes de Software

```
apps/desktop/backend/
├── llm/
│   ├── ollama_client.py    # Cliente HTTP para API de Ollama
│   └── startup.py          # Gestor de ciclo de vida del proceso Ollama
├── runtime/
│   └── ollama/
│       ├── README_RUNTIME.md
│       ├── ollama          # Binario del motor
│       └── models/         # Almacenamiento de modelos GGUF/Blob
└── main.py                 # Orquestador del Backend
```

---

## Subsistema Android (Kotlin + Jetpack Compose)

### Configuración del Modelo
- **Modelo:** `qwen2.5-1.5b-instruct-int4.gguf`
- **Formato:** GGUF Cuantizado (INT4)
- **Tamaño aproximado:** 900MB
- **Motor de Inferencia:** MLC LLM / llama.cpp (integrado)
- **Almacenamiento:** Almacenamiento interno de la aplicación (`filesDir/models/`)

### Flujo de Operación

1. **Aprovisionamiento Inicial:**
   - Verificación de existencia del archivo del modelo.
   - Descarga bajo demanda desde servidor configurado en primer uso.

2. **Modalidades de Ejecución:**
   - **Local (On-device):** Inferencia directa en el dispositivo móvil.
   - **Remota (LAN):** Conexión vía API REST al backend de escritorio (opcional).

3. **Configuración:**
   - Punto de origen de descarga definido en `ModelManager.kt`.

---

## Justificación Arquitectónica

1. **Eficiencia de Recursos:**
   - Selección de modelos < 2GB permite ejecución fluida en equipos con 4GB-8GB de RAM.
   
2. **Privacidad y Seguridad:**
   - Procesamiento 100% local (Edge Computing).
   - Ausencia total de telemetría de datos de usuario.
   - Independencia de conectividad a internet post-instalación.

3. **Portabilidad:**
   - Empaquetado de dependencias permite distribución autocontenida.

---

## Consideraciones de Implementación y Distribución

### Distribución de Binarios y Modelos

Debido a restricciones de tamaño y licencias, los modelos y binarios de Ollama no se incluyen en el repositorio de código fuente.

**Estrategias de Despliegue Desktop:**
- **Instalación Manual:** Instrucciones al usuario para instalar Ollama.
- **Script de Post-instalación:** Automatización de descarga de componentes.

**Estrategias de Despliegue Android:**
- **Descarga bajo demanda:** El usuario descarga el modelo en el primer uso (estrategia actual).

### Requisitos Mínimos Recomendados

**Desktop:**
- Procesador: Dual Core 2.0GHz+
- RAM: 4GB (8GB Recomendado para multitarea)
- Almacenamiento: 2GB espacio disponible

**Android:**
- Android 7.0 (API 24)+
- RAM: 3GB+
- Procesador: ARMv8 (64-bit)

### Rendimiento Estimado

- **Desktop (CPU):** 20-50 tokens/segundo.
- **Android (ARM):** 10-30 tokens/segundo.
*El rendimiento varía según el hardware específico y el estado térmico del dispositivo.*

---

## Tareas de Ingeniería Pendientes

**Desktop:**
- [ ] Definir estrategia final de empaquetado para Ollama.
- [ ] Desarrollar scripts de instalación silenciosa.

**Android:**
- [ ] Configurar servidor de distribución de modelos (CDN).
- [ ] Implementar validación de integridad (Checksum SHA256).

**General:**
- [ ] Documentación técnica de troubleshooting.
