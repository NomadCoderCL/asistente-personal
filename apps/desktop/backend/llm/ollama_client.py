import os
import requests

OLLAMA_URL = os.environ.get('OLLAMA_URL', 'http://127.0.0.1:11434')


def ping(timeout: float = 1.0) -> bool:
    try:
        # Health by listing tags; 200 means Ollama is serving
        r = requests.get(f"{OLLAMA_URL}/api/tags", timeout=timeout)
        return r.status_code == 200
    except Exception:
        return False


def generate_sync(model: str, prompt: str, system: str = None, max_tokens: int = 256, temperature: float = 0.7) -> str:
    """Synchronous, non-stream generate against Ollama.
    Notes:
    - Ollama uses 'num_predict' instead of 'max_tokens'.
    - Set 'stream': False to receive a single JSON with 'response'.
    """
    payload = {
        'model': model,
        'prompt': prompt,
        'num_predict': max_tokens,
        'temperature': temperature,
        'stream': False,
    }
    if system:
        payload['system'] = system
    try:
        r = requests.post(f"{OLLAMA_URL}/api/generate", json=payload, timeout=120)
        r.raise_for_status()
        j = r.json()
        return j.get('response', j.get('content', j.get('text', str(j))))
    except Exception as e:
        return f"[ollama unavailable] {e}"


def ensure_model(model: str, timeout: int = 600) -> bool:
    """Download a model into the local Ollama instance if needed.

    Returns True if the model is available (pulled successfully or already present),
    False if there was an error contacting Ollama.
    """
    payload = {
        'name': model,
        'stream': False,
    }
    try:
        r = requests.post(f"{OLLAMA_URL}/api/pull", json=payload, timeout=timeout)
        r.raise_for_status()
        return True
    except Exception as e:
        print(f"[ollama_client] Error ensuring model '{model}': {e}")
        return False
