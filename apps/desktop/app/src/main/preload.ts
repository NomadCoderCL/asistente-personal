import { contextBridge, ipcRenderer } from 'electron'

// Exponer API segura para el renderer process
contextBridge.exposeInMainWorld('carmen', {
  env: {
    UI_PORT: process.env.DESKTOP_UI_PORT || '5173',
    BACKEND_PORT: process.env.DESKTOP_BACKEND_PORT || '8765',
    BACKEND_HOST: process.env.DESKTOP_BACKEND_HOST || '127.0.0.1'
  },

  // Helper para obtener la URL del backend
  getBackendUrl: () => {
    const host = process.env.DESKTOP_BACKEND_HOST || '127.0.0.1'
    const port = process.env.DESKTOP_BACKEND_PORT || '8765'
    return `http://${host}:${port}`
  },

  // Información del sistema
  platform: process.platform,

  // IPC communication (para comunicación futura con el proceso principal)
  send: (channel: string, data: any) => {
    const validChannels = ['toMain', 'minimize', 'maximize', 'close']
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },

  receive: (channel: string, func: (...args: any[]) => void) => {
    const validChannels = ['fromMain', 'backend-status']
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
  }
})

// Type definitions para TypeScript
declare global {
  interface Window {
    carmen: {
      env: {
        UI_PORT: string
        BACKEND_PORT: string
      }
      getBackendUrl: () => string
      platform: string
      send: (channel: string, data: any) => void
      receive: (channel: string, func: (...args: any[]) => void) => void
    }
  }
}

