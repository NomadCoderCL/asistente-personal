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
  backendProcess = spawn(python, ['-m', 'uvicorn', 'main:app', '--host', '127.0.0.1', '--port', process.env.DESKTOP_BACKEND_PORT || '8765'], {
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

  const devUrl = `http://localhost:${process.env.DESKTOP_UI_PORT || 5173}`
  mainWindow.loadURL(devUrl)
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
