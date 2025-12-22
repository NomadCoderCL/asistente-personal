# Guía de Despliegue - Asistente Personal

Documentación técnica para la preparación, compilación y distribución de versiones de producción.

---

## checklist Pre-Deployment

Validaciones mandatorias antes de iniciar el proceso de construcción (build).

### Backend (Python)
- [ ] Verificación de integridad de dependencias (`python check_env.py`).
- [ ] Ejecución exitosa de suite de pruebas.
- [ ] Configuración de variables de entorno para perfil de producción.
- [ ] Configuración de sistema de rotación y persistencia de logs.
- [ ] Verificación de binarios de IA (Ollama) si corresponde a la distribución.

### Frontend (React/Electron)
- [ ] Compilación exitosa sin advertencias (`npm run build`).
- [ ] Validación estática de código (TypeScript/ESLint).
- [ ] Verificación de rutas y deeplinking.
- [ ] Optimización y minificación de recursos estáticos.

---

## Proceso de Construcción (Build Pipeline)

### 1. Preparación del Backend

```bash
cd apps/desktop/backend

# Activación de entorno virtual
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # Linux/macOS

# Validación de entorno
python check_env.py

# Generación de lockfile de dependencias
pip freeze > requirements.lock
```

### 2. Compilación del Frontend

```bash
cd apps/desktop/app

# Limpieza de artefactos previos
rm -rf dist/

# Instalación limpia de dependencias
npm ci

# Transpilación y empaquetado para producción
npm run build
```

### 3. Configuración de Electron Builder

Verificar la configuración en `apps/desktop/builder/electron-builder.yml`:

```yaml
appId: com.carmen.assistant
productName: Carmen Assistant
copyright: Copyright © 2024

directories:
  output: dist
  buildResources: build

files:
  - dist/**/*
  - src/main/**/*
  - package.json

extraResources:
  - from: ../backend
    to: backend
    filter:
      - "**/*"
      - "!.venv/**/*"
      - "!__pycache__/**/*"
      - "!*.pyc"
      - "!.pytest_cache/**/*"

win:
  target:
    - nsis
  icon: build/icon.ico

mac:
  target:
    - dmg
  icon: build/icon.icns
  category: public.app-category.productivity

linux:
  target:
    - AppImage
  icon: build/icon.png
  category: Utility
```

### 4. Generación de Instaladores

```bash
cd apps/desktop/app

# Build para plataforma actual
npm run dist

# Cross-compilation (puede requerir configuración adicional)
npm run dist -- --win
npm run dist -- --mac
npm run dist -- --linux
```
Los binarios resultantes se ubicarán en `apps/desktop/app/dist/`.

---

## Protocolos de Seguridad en Producción

### Gestión de Secretos
- Excluir estrictamente claves de API, tokens y credenciales del código fuente.
- Utilizar inyección de variables de entorno en tiempo de ejecución.

### Validación de Datos
- Implementar validación estricta de tipos y formatos en todos los puntos de entrada.
- Sanitización de rutas de sistema de archivos para prevenir Path Traversal.
- Límites de tamaño para carga de archivos.

### Política de Actualizaciones
- Implementar firma digital de código (Code Signing).
- Configurar canal de actualizaciones seguro (HTTPS).

---

## Estrategias de Optimización

### Backend

1. **Logging Estructurado**:
   Configurar logging rotativo y formateado JSON para ingestión en sistemas de monitoreo.

2. **Gestión de Memoria IA**:
   - Implementar descarga de modelos inactivos.
   - Configurar límites de memoria para procesos secundarios.

3. **Manejo de Excepciones**:
   - Implementar capturas globales de errores no controlados.
   - Ocultar detalles de implementación en respuestas al cliente.

### Frontend

1. **Lazy Loading**:
   Implementar carga diferida de módulos (Code Splitting) para reducir tiempo de inicio.

2. **Optimización de Recursos**:
   - Compresión de imágenes y recursos gráficos.
   - Eliminación de código muerto (Tree Shaking).

---

## Verificación de Calidad (QA)

### Pruebas Funcionales Críticas
1. **Ciclo de Vida de Chat**: Conexión, envío, recepción, desconexión.
2. **Ciclo de Vida de Tareas**: Listado, ejecución, monitoreo, resultado.
3. **Gestión de Configuración**: Persistencia de preferencias, gestión de datos locales.

### Pruebas de Integración
```bash
# Backend
cd apps/desktop/backend
pytest tests/
```

### Pruebas de Aceptación
1. **Instalación Limpia**: Verificar funcionamiento en SO recién instalado.
2. **Actualización**: Verificar migración de datos desde versión previa.
3. **Desinstalación**: Verificar limpieza de archivos y registros.

---

## Versionado y Distribución

Estrictamente adherido a Semantic Versioning (MAJOR.MINOR.PATCH).

### Firma de Código (Code Signing)

#### Windows
```bash
signtool sign /f certificate.pfx /p password /tr http://timestamp.digicert.com installer.exe
```

#### macOS
```bash
codesign --deep --force --verify --verbose --sign "Developer ID" Carmen.app
```

---

## Soporte y Mantenimiento

Para incidencias durante el proceso de despliegue:
1. Analizar logs de compilación de electron-builder.
2. Verificar compatibilidad de ABI de módulos nativos.
3. Consultar referencias técnicas en documentación interna.
