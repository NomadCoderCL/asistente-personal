# Generar instalador Windows (.exe)

Requisitos:
- NSIS instalado (https://nsis.sourceforge.io/). Asegúrate de que `makensis` esté en el `PATH`.
- Haber generado la carpeta `app/release/win-unpacked` (ya incluida en el repositorio en `app/release/win-unpacked` si corresponde).

Pasos rápidos:

1. Abrir PowerShell en la carpeta `apps/desktop` del repositorio.
2. Ejecutar:

```powershell
.\build_installer.ps1
```

Salida:
- El instalador resultante se generará en `apps/desktop/dist` con nombre `Asistente Personal-Setup-0.1.0.exe`.

Notas:
- El instalador incluye todos los archivos encontrados en `app/release/win-unpacked` y crea accesos directos en el escritorio y en el menú de inicio.
- Si prefieres usar `makensis` directamente, ejecuta `makensis installer_script.nsi` desde `apps/desktop`.

- Inno Setup
- Puedes generar un instalador con Inno Setup (opción alternativa):

- Requisitos: Instalar Inno Setup y asegurarte de que `ISCC.exe` esté en el `PATH`.
- Para construir con Inno Setup, desde `apps/desktop` ejecutar:

```powershell
.\build_inno.ps1
```

El instalador Inno se generará en `apps/desktop/dist` con nombre `Asistente_Personal-Setup-0.1.0.exe`.

Instalador Portable (autocontenible)
- Requisitos: `7z.exe` (7-Zip) y `7z.sfx` (módulo SFX de 7-Zip). Si instalaste 7-Zip, `7z.sfx` suele estar en la misma carpeta que `7z.exe`.
- Para construir el ejecutable portable desde `apps/desktop` ejecutar:

```powershell
.\build_portable.ps1
```

Salida: `apps/desktop/dist/Asistente_Personal-Portable.exe` — un self-extractor que extrae los archivos y ejecuta `Asistente Personal.exe`.

Comprobación de requisitos y construcción automática
- Ejecuta `check_requirements.ps1` para verificar herramientas necesarias:

```powershell
.\check_requirements.ps1
```

- Orquestador `build_all.ps1`: detecta herramientas disponibles y ejecuta los builders apropiados; acepta flags para forzar uno:

```powershell
# Construir todo lo posible detectando herramientas
.\build_all.ps1

# Forzar sólo portable
.\build_all.ps1 -PORTABLE

# Forzar NSIS
.\build_all.ps1 -NSIS

# Forzar Inno
.\build_all.ps1 -INNO
```

Ubicación de salida común: `apps/desktop/dist`

Solución de problemas comunes:
- Si `makensis` no está en PATH, instala NSIS y añade su carpeta (contiene `makensis.exe`) al PATH.
- Si `ISCC.exe` no está en PATH, instala Inno Setup y añade la carpeta que contiene `ISCC.exe` al PATH.
- Si `7z.sfx` no se encuentra, localízalo en la instalación de 7-Zip (ej. `C:\Program Files\7-Zip\7z.sfx`) y copia ese archivo en la carpeta donde está `7z.exe` o en `apps/desktop`.
- Asegúrate de que `app/release/win-unpacked` exista (ejecuta el packaging/electron-builder antes de correr los scripts).
