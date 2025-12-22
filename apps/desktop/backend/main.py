from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.responses import JSONResponse, FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import uvicorn
import os
import logging
from llm import ollama_client
from llm.startup import ensure_ollama_running
import yaml
from vision.ocr import ocr_contains
from vision.verify import file_exists
from pathlib import Path

app = FastAPI()

# Montar frontend estático (asume carpeta sibling "frontend" junto a "backend")
_frontend_dir = Path(__file__).resolve().parents[1] / "frontend"
if _frontend_dir.exists():
    app.mount("/static", StaticFiles(directory=str(_frontend_dir)), name="static")

# Configurar CORS (puede ajustarse con DESKTOP_FRONTEND_ORIGINS)
_origins_env = os.environ.get('DESKTOP_FRONTEND_ORIGINS', '*')
if _origins_env.strip() == '*':
    _origins = ["*"]
else:
    _origins = [o.strip() for o in _origins_env.split(',') if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatReq(BaseModel):
    model: str
    prompt: str
    max_tokens: int = 256
    temperature: float = 0.7


@app.on_event('startup')
async def startup_event():
    logger = logging.getLogger("backend.startup")
    logger.info("=" * 60)
    logger.info("Carmen Assistant Backend - Starting up...")
    logger.info("=" * 60)
    
    # Asegurar directorio de tareas
    tasks_dir = Path(os.path.dirname(__file__)) / 'tasks'
    try:
        tasks_dir.mkdir(parents=True, exist_ok=True)
        logger.info(f"✓ Tasks directory ensured at: {tasks_dir}")
    except Exception as e:
        logger.error(f"✗ Could not ensure tasks directory: {e}")

    # Intenta arrancar ollama portable si existe
    try:
        ok = await ensure_ollama_running()
        if ok:
            logger.info("✓ Ollama runtime is running")
        else:
            logger.warning("⚠ Ollama runtime not available - LLM features will be limited")
    except Exception as e:
        logger.error(f"✗ Error checking Ollama runtime: {e}")

    # Pre-descargar un modelo por defecto (configurable por env).
    # Solo en modo desarrollo para evitar descargas en producción
    if os.environ.get('APP_ENV', 'production') == 'development':
        model_to_preload = os.environ.get('OLLAMA_DEFAULT_MODEL', 'qwen2.5:0.5b')
        try:
            logger.info(f"Development mode: Attempting to ensure model '{model_to_preload}'...")
            available = ollama_client.ensure_model(model_to_preload)
            if available:
                logger.info(f"✓ Model '{model_to_preload}' is available")
            else:
                logger.warning(f"⚠ Model '{model_to_preload}' could not be loaded")
        except Exception as e:
            logger.warning(f"⚠ Model preload failed: {e}")
    else:
        logger.info("Production mode: Skipping automatic model download")
    
    logger.info("=" * 60)
    logger.info("Backend startup complete")
    logger.info("=" * 60)


@app.get('/health')
def health():
    return {'status': 'ok'}


@app.get('/runtime')
def runtime():
    ok = ollama_client.ping()
    return {'ollama': ok}


@app.post('/chat')
async def chat(req: ChatReq):
    try:
        # Intentar streaming si el cliente lo requiere. Aquí devolvemos JSON simple.
        text = ollama_client.generate_sync(req.model, req.prompt, max_tokens=req.max_tokens, temperature=req.temperature)
        return JSONResponse({'text': text})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post('/vision/check')
async def vision_check(body: dict):
    t = body.get('type')
    params = body.get('params', {})
    if t == 'ocr_contains':
        image_path = params.get('image_path')
        needle = params.get('text')
        res = ocr_contains(image_path, needle)
        return {'result': res}
    if t == 'file_exists':
        path = params.get('path')
        return {'result': file_exists(path)}
    return {'error': 'unknown type'}


@app.post('/tasks/run')
async def tasks_run(body: dict):
    id_t = body.get('id_tarea')
    if not id_t:
        raise HTTPException(status_code=400, detail='id_tarea required')
    # Cargar YAML desde tasks
    task_file = os.path.join(os.path.dirname(__file__), 'tasks', f'{id_t}.yaml')
    if not os.path.exists(task_file):
        raise HTTPException(status_code=404, detail='task not found')
    with open(task_file, 'r', encoding='utf-8') as f:
        data = yaml.safe_load(f)
    # Orquestador simple: ejecutar pasos secuencialmente (placeholder)
    events = []
    for step in data.get('steps', []):
        events.append({'step': step.get('name'), 'status': 'done'})
    return {'events': events}


@app.get('/')
async def index():
    # Servir index.html del frontend si existe
    index_path = _frontend_dir / "index.html"
    if index_path.exists():
        return FileResponse(str(index_path))
    # Fallback: pequeña página con enlace a docs
    html = "<html><body><h3>Frontend no encontrado</h3><p>Use /docs para la API o coloque su frontend en: {}</p></body></html>".format(_frontend_dir)
    return HTMLResponse(content=html, status_code=200)


@app.websocket('/stream')
async def websocket_stream(ws: WebSocket):
    await ws.accept()
    try:
        while True:
            msg = await ws.receive_text()
            # ECHO por ahora
            await ws.send_text(f'ECHO: {msg}')
    except WebSocketDisconnect:
        logging.getLogger("backend.websocket").info('websocket disconnected')
    except Exception as e:
        logging.getLogger("backend.websocket").exception(f'websocket error: {e}')


if __name__ == '__main__':
    # Configurar logging básico y arrancar uvicorn sin reload cuando se ejecuta directamente
    logging.basicConfig(level=logging.INFO)
    host = os.environ.get('DESKTOP_BACKEND_HOST', '0.0.0.0')
    port = int(os.environ.get('DESKTOP_BACKEND_PORT', 8765))
    dev_reload = os.environ.get('DESKTOP_DEV', '0') in ('1', 'true', 'True')
    uvicorn.run('main:app', host=host, port=port, reload=dev_reload)
