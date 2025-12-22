# Asistente Personal - Cliente Android

Aplicación móvil nativa desarrollada en Kotlin utilizando Jetpack Compose. Diseñada para operar con modelos de lenguaje optimizados (Small Language Models) directamente en el dispositivo.

## Especificaciones Técnicas

- **Lenguaje:** Kotlin
- **UI Framework:** Jetpack Compose
- **Motor de Inferencia:** implementation basada en MLC LLM / llama.cpp
- **Modelo Objetivo:** Qwen 1.5B (Cuantización INT4)
- **Requisitos de Sistema:** Android 7.0 (API 24) o superior

## Flujo de Aprovisionamiento de Modelos

El modelo de lenuaje no se distribuye dentro del paquete APK para optimizar el tamaño de descarga inicial.

1. **Primer Inicio:** La aplicación verifica la existencia del modelo en `filesDir/models/`.
2. **Descarga:** Si no existe, inicia descarga segura desde el repositorio configurado.
3. **Configuración:** La URL de origen debe definirse en `com.carmen.assistant.setup.ModelManager.kt`.

## Entorno de Desarrollo

1. Importar el proyecto `apps/android` en Android Studio.
2. Sincronizar proyecto con archivos Gradle.
3. Compilar y ejecutar en dispositivo físico o emulador (arquitectura ARM recomendada).

## Modos de Operación

- **Standalone:** Ejecución 100% local en dispositivo móvil.
- **Cliente Remoto:** Conexión vía LAN al backend de escritorio (opcional).
