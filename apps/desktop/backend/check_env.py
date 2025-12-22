"""
Script de validación de entorno para Carmen Assistant Backend
Verifica que todas las dependencias y configuraciones estén correctas
"""

import sys
import os
import importlib.util
from pathlib import Path

def check_python_version():
    """Verifica la versión de Python"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        return False, f"Python {version.major}.{version.minor} (se requiere 3.8+)"
    return True, f"Python {version.major}.{version.minor}.{version.micro}"

def check_module(module_name):
    """Verifica si un módulo está instalado"""
    spec = importlib.util.find_spec(module_name)
    return spec is not None

def check_dependencies():
    """Verifica las dependencias principales"""
    required = {
        'fastapi': 'FastAPI',
        'uvicorn': 'Uvicorn',
        'requests': 'Requests',
        'websockets': 'WebSockets',
        'yaml': 'PyYAML',
        'cv2': 'OpenCV',
        'pytesseract': 'Pytesseract',
        'jinja2': 'Jinja2',
        'docx': 'python-docx',
        'openpyxl': 'openpyxl'
    }
    
    optional = {
        'chromadb': 'ChromaDB',
        'faiss': 'FAISS-CPU'
    }
    
    results = {'required': {}, 'optional': {}}
    
    for module, name in required.items():
        results['required'][name] = check_module(module)
    
    for module, name in optional.items():
        results['optional'][name] = check_module(module)
    
    return results

def check_directories():
    """Verifica que existan los directorios necesarios"""
    base_dir = Path(__file__).parent
    dirs = {
        'tasks': base_dir / 'tasks',
        'runtime': base_dir / 'runtime',
        'ollama': base_dir / 'runtime' / 'ollama'
    }
    
    results = {}
    for name, path in dirs.items():
        results[name] = path.exists()
    
    return results

def check_ollama():
    """Verifica si Ollama está disponible"""
    runtime_dir = Path(__file__).parent / 'runtime' / 'ollama'
    
    if os.name == 'nt':
        ollama_bin = runtime_dir / 'ollama.exe'
    else:
        ollama_bin = runtime_dir / 'ollama'
    
    return ollama_bin.exists(), str(ollama_bin)

def main():
    print("=" * 70)
    print("Carmen Assistant - Validación de Entorno Backend")
    print("=" * 70)
    print()
    
    # Python version
    ok, version = check_python_version()
    status = "✓" if ok else "✗"
    print(f"{status} Versión de Python: {version}")
    if not ok:
        print("  ⚠ Se requiere Python 3.8 o superior")
        sys.exit(1)
    print()
    
    # Dependencies
    print("Dependencias Requeridas:")
    deps = check_dependencies()
    all_required_ok = True
    for name, installed in deps['required'].items():
        status = "✓" if installed else "✗"
        print(f"  {status} {name}")
        if not installed:
            all_required_ok = False
    print()
    
    print("Dependencias Opcionales:")
    for name, installed in deps['optional'].items():
        status = "✓" if installed else "⚠"
        print(f"  {status} {name}")
        if not installed:
            print(f"     (Opcional - Ver requirements-optional.txt)")
    print()
    
    # Directories
    print("Directorios:")
    dirs = check_directories()
    for name, exists in dirs.items():
        status = "✓" if exists else "⚠"
        print(f"  {status} {name}/")
        if not exists:
            print(f"     (Se creará automáticamente si es necesario)")
    print()
    
    # Ollama
    print("Runtime Ollama:")
    ollama_exists, ollama_path = check_ollama()
    status = "✓" if ollama_exists else "⚠"
    print(f"  {status} Binario Ollama")
    if ollama_exists:
        print(f"     Ubicación: {ollama_path}")
    else:
        print(f"     No encontrado en: {ollama_path}")
        print(f"     (Las funciones de IA estarán limitadas)")
    print()
    
    # Summary
    print("=" * 70)
    if all_required_ok:
        print("✓ Todas las dependencias requeridas están instaladas")
        print()
        print("El backend está listo para ejecutarse.")
        print()
        print("Para iniciar el servidor:")
        print("  python -m uvicorn main:app --host 127.0.0.1 --port 8765")
        print()
        if not ollama_exists:
            print("Nota: Para habilitar funciones de IA, instala Ollama en:")
            print(f"  {ollama_path}")
    else:
        print("✗ Faltan dependencias requeridas")
        print()
        print("Para instalar las dependencias:")
        print("  pip install -r requirements.txt")
        print()
        print("Para dependencias opcionales (puede requerir conda en Windows):")
        print("  pip install -r requirements-optional.txt")
        sys.exit(1)
    print("=" * 70)

if __name__ == '__main__':
    main()
