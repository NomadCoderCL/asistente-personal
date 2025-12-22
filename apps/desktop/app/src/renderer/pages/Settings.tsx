import React, { useState, useEffect } from 'react'

interface RuntimeStatus {
  ollama: boolean
}

export default function Settings() {
  const [runtimeStatus, setRuntimeStatus] = useState<RuntimeStatus | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [language, setLanguage] = useState('es')

  useEffect(() => {
    checkRuntime()
  }, [])

  async function checkRuntime() {
    setIsChecking(true)
    try {
      const r = await fetch('http://127.0.0.1:8765/runtime', { signal: AbortSignal.timeout(5000) })
      const j = await r.json()
      setRuntimeStatus(j)
    } catch (e) {
      setRuntimeStatus({ ollama: false })
    } finally {
      setIsChecking(false)
    }
  }

  async function clearData() {
    if (!confirm('¿Estás seguro de que deseas borrar todos los datos locales? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      await fetch('http://127.0.0.1:8765/clear', { method: 'POST' }).catch(() => { })
      alert('✓ Se solicitó borrar datos. Revisa el backend para confirmar.')
    } catch (e) {
      alert('✗ Error al intentar borrar datos.')
    }
  }

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h2 style={{ margin: 0, marginBottom: 'var(--spacing-xs)' }}>⚙️ Configuración</h2>
        <p style={{ margin: 0, color: 'var(--dark-text-secondary)', fontSize: '0.875rem' }}>
          Ajusta las preferencias y verifica el estado del sistema
        </p>
      </div>

      {/* Language Settings */}
      <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div className="card-header">
          <h3 className="card-title">🌐 Idioma</h3>
        </div>
        <div className="card-body">
          <p style={{ color: 'var(--dark-text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--spacing-md)' }}>
            Selecciona el idioma de la interfaz
          </p>
          <select
            className="select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{ maxWidth: '300px' }}
          >
            <option value="es">Español (ES)</option>
            <option value="en">English (EN)</option>
            <option value="pt">Português (PT)</option>
          </select>
        </div>
      </div>

      {/* Runtime Status */}
      <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="card-title">🔧 Estado del Sistema</h3>
            <button
              onClick={checkRuntime}
              disabled={isChecking}
              className="btn btn-secondary btn-sm"
            >
              {isChecking ? (
                <>
                  <div className="spinner" />
                  Verificando...
                </>
              ) : (
                <>
                  🔄 Actualizar
                </>
              )}
            </button>
          </div>
        </div>
        <div className="card-body">
          {runtimeStatus === null ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', color: 'var(--dark-text-secondary)' }}>
              <div className="spinner" />
              <span>Verificando estado del sistema...</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              {/* Backend Status */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 'var(--spacing-md)',
                background: 'var(--dark-bg)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--dark-border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--primary-600)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem'
                  }}>
                    🖥️
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: '2px' }}>Backend FastAPI</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--dark-text-secondary)' }}>
                      Servidor principal de la aplicación
                    </div>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-xs)',
                  padding: 'var(--spacing-xs) var(--spacing-md)',
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--success-500)'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--success-500)'
                  }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--success-500)', fontWeight: 600 }}>
                    Conectado
                  </span>
                </div>
              </div>

              {/* Ollama Status */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 'var(--spacing-md)',
                background: 'var(--dark-bg)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--dark-border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-md)',
                    background: runtimeStatus.ollama ? 'var(--secondary-600)' : 'var(--gray-600)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem'
                  }}>
                    🧠
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: '2px' }}>Ollama Runtime</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--dark-text-secondary)' }}>
                      Motor de inteligencia artificial local
                    </div>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-xs)',
                  padding: 'var(--spacing-xs) var(--spacing-md)',
                  background: runtimeStatus.ollama ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  borderRadius: 'var(--radius-full)',
                  border: `1px solid ${runtimeStatus.ollama ? 'var(--success-500)' : 'var(--error-500)'}`
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: runtimeStatus.ollama ? 'var(--success-500)' : 'var(--error-500)'
                  }} />
                  <span style={{
                    fontSize: '0.75rem',
                    color: runtimeStatus.ollama ? 'var(--success-500)' : 'var(--error-500)',
                    fontWeight: 600
                  }}>
                    {runtimeStatus.ollama ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>

              {!runtimeStatus.ollama && (
                <div style={{
                  padding: 'var(--spacing-md)',
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid var(--warning-500)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  color: 'var(--warning-500)'
                }}>
                  <strong>⚠️ Ollama no está disponible</strong>
                  <p style={{ margin: 'var(--spacing-xs) 0 0 0', fontSize: '0.75rem' }}>
                    Las funciones de IA estarán limitadas. Asegúrate de que Ollama esté instalado y ejecutándose.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Data Management */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">🗑️ Gestión de Datos</h3>
        </div>
        <div className="card-body">
          <p style={{ color: 'var(--dark-text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--spacing-md)' }}>
            Administra el almacenamiento local de la aplicación
          </p>
          <button
            onClick={clearData}
            className="btn btn-danger"
          >
            🗑️ Borrar todos los datos
          </button>
          <p style={{
            marginTop: 'var(--spacing-sm)',
            fontSize: '0.75rem',
            color: 'var(--dark-text-secondary)',
            fontStyle: 'italic'
          }}>
            Esta acción eliminará todos los datos almacenados localmente, incluyendo historial de conversaciones.
          </p>
        </div>
      </div>

      {/* System Info */}
      <div className="card" style={{ marginTop: 'var(--spacing-lg)' }}>
        <div className="card-header">
          <h3 className="card-title">ℹ️ Información del Sistema</h3>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 'var(--spacing-sm)', fontSize: '0.875rem' }}>
            <span style={{ color: 'var(--dark-text-secondary)' }}>Versión:</span>
            <span style={{ fontWeight: 600 }}>0.1.0</span>

            <span style={{ color: 'var(--dark-text-secondary)' }}>Backend URL:</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>http://127.0.0.1:8765</span>

            <span style={{ color: 'var(--dark-text-secondary)' }}>Plataforma:</span>
            <span style={{ fontWeight: 600 }}>{navigator.platform}</span>

            <span style={{ color: 'var(--dark-text-secondary)' }}>User Agent:</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', wordBreak: 'break-all' }}>
              {navigator.userAgent.substring(0, 80)}...
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
