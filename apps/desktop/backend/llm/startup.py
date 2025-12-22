import subprocess
import os
import time
import requests

RUNTIME_DIR = os.environ.get('OLLAMA_RUNTIME_DIR', os.path.join(os.path.dirname(__file__), '..', 'runtime', 'ollama'))

def is_ollama_running():
    try:
        r = requests.get('http://127.0.0.1:11434/api/tags', timeout=1)
        return r.status_code == 200
    except Exception:
        return False


async def ensure_ollama_running():
    # No descarga modelos; intenta arrancar un binario local si está presente.
    if is_ollama_running():
        return True
    # Resolve platform-specific binary name
    bin_candidates = ['ollama']
    if os.name == 'nt':
        bin_candidates.insert(0, 'ollama.exe')
    bin_path = None
    for name in bin_candidates:
        candidate = os.path.join(RUNTIME_DIR, name)
        if os.path.exists(candidate):
            bin_path = candidate
            break

    if bin_path and os.path.exists(bin_path):
        # Start as background process
        try:
            env = os.environ.copy()
            # Si no se ha configurado explí­citamente, usar runtime/ollama/models
            env.setdefault('OLLAMA_MODELS', os.path.join(RUNTIME_DIR, 'models'))
            subprocess.Popen([bin_path, 'serve'], cwd=RUNTIME_DIR, env=env)
            # esperar un poco
            time.sleep(2)
            return is_ollama_running()
        except Exception as e:
            print('Error starting ollama:', e)
            return False
    else:
        print('No ollama binary found in', RUNTIME_DIR)
        return False
