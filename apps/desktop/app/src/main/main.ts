import { app, BrowserWindow } from 'electron'
import * as path from 'path'
import { spawn, ChildProcess } from 'child_process'

let mainWindow: BrowserWindow | null = null
let backendProcess: ChildProcess | null = null

function startBackend() {
  // Inicia el backend FastAPI (python -m uvicorn main:app)
  const backendPath = path.resolve(__dirname, '..', '..', 'backend')
  // Windows: use .\venv\Scripts\python.exe if exists; fallback to python
  const python = process.platform === 'win32' ? 'python' : 'python3'
  const backendHost = process.env.DESKTOP_BACKEND_HOST || '127.0.0.1'
  const backendPort = process.env.DESKTOP_BACKEND_PORT || '8765'
  backendProcess = spawn(python, ['-m', 'uvicorn', 'main:app', '--host', backendHost, '--port', backendPort], {
    cwd: backendPath,
    stdio: 'inherit'
  })
  backendProcess.on('exit', (code) => console.log('backend exited', code))
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  // Decide whether to load the dev server (during development) or the
  // built local HTML (in production / packaged app).
  const devUrl = `http://localhost:${process.env.DESKTOP_UI_PORT || 5173}`
  const isDev = process.env.NODE_ENV === 'development' || process.env.DESKTOP_UI_DEV === 'true' || process.env.ELECTRON_START_URL

  if (isDev) {
    mainWindow.loadURL(devUrl)
  } else {
    // When packaged, Vite build output places renderer files under ../renderer
    // relative to the compiled main bundle. Load the local index.html.
    const indexHtml = path.join(__dirname, '..', 'renderer', 'index.html')
    mainWindow.loadFile(indexHtml).catch(err => {
      // Fallback: if the file cannot be loaded, open a simple error page
      console.error('Failed to load local index.html', err)
      mainWindow.loadURL(devUrl).catch(() => {})
    })
  }
}

app.whenReady().then(() => {
  startBackend()
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('before-quit', () => {
  if (backendProcess) {
    backendProcess.kill()
    backendProcess = null
  }
})
