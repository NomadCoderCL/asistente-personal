# Changelog

Registro de cambios notables en el proyecto.

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/).
Adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [0.1.0] - 2024-12-14

### Agregado

#### Frontend
- Interfaz de usuario profesional con tema oscuro optimizado.
- Sistema de diseño con variables CSS y librería de componentes.
- Sistema de navegación persistente con indicadores de estado.
- Panel de ayuda contextual integrado.
- Rediseño completo del módulo de Chat:
  - Indicadores de estado de conectividad en tiempo real.
  - Formateo de mensajes con metadatos.
  - Spinner de carga y manejo de estados asíncronos.
  - Validación de entrada y atajos de teclado.
- Panel de Configuración avanzado:
  - Diagnóstico de servicios del sistema.
  - Selector de idioma internacional.
  - Gestión de almacenamiento local.
- Módulo de Tareas con visualización de estado y resultados.

#### Backend
- Sistema de logging estructurado con niveles de severidad.
- Manejo global de excepciones en endpoints API.
- Script de validación de entorno (`check_env.py`).
- Configuración de entorno dual (Desarrollo/Producción).
- Optimización de gestión de dependencias opcionales.

#### Infraestructura
- Tipado estricto TypeScript para componentes React.
- Configuración de `electron-builder` multiplataforma.
- Script de pre-carga (preload) con seguridad reforzada.
- Documentación técnica integral (README, DEPLOYMENT, ARQUITECTURA).

### Cambiado
- Reorganización de dependencias en `requirements.txt`.
- Estandarización de modelo predeterminado a `qwen2.5:0.5b` por eficiencia.
- Puerto de servicio backend fijado en 8765.
- Incremento de timeouts de solicitud para operaciones de inferencia IA.
- Actualización de formato de solicitud a API de Ollama.
- **Renombrado del proyecto**: Cambio de "Carmen Assistant" a "Asistente Personal" para reflejar el carácter interno del proyecto.

### Corregido
- Resolución de errores de compilación TypeScript.
- Corrección de problemas de compatibilidad de dependencias en Windows.
- Ajuste de rutas relativas en configuración de empaquetado.
- Solución a errores de inyección de estilos CSS.
- Manejo de excepciones en comunicación cliente-servidor.

### Seguridad
- Habilitación de Context Isolation en proceso Electron.
- Deshabilitación de Node Integration en renderizadores.
- Implementación de lista blanca para canales IPC.
- Validación de estructuras de datos en API REST.
- Configuración restrictiva de CORS.

---

## [0.0.1] - 2024-12-13

### Inicial
- Estructura base del proyecto (Electron + FastAPI).
- Implementación de servidor backend básico.
- Interfaz de chat prototipo.
- Integración preliminar con Ollama.
- Motor básico de ejecución de tareas YAML.
