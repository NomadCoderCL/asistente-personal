import React, { useState } from 'react'

interface TaskEvent {
  step: string
  status: string
}

interface TaskResult {
  events: TaskEvent[]
}

export default function Tasks() {
  const [isExecuting, setIsExecuting] = useState(false)
  const [result, setResult] = useState<TaskResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const availableTasks = [
    {
      id: 'crear_cotizacion_excel',
      name: 'Crear Cotización en Excel',
      description: 'Genera una cotización profesional en formato Excel',
      icon: '📊',
      variables: { cliente: 'ACME Corp' }
    },
    {
      id: 'procesar_documento',
      name: 'Procesar Documento',
      description: 'Extrae y procesa información de documentos',
      icon: '📄',
      variables: {}
    },
    {
      id: 'generar_reporte',
      name: 'Generar Reporte',
      description: 'Crea un reporte detallado con datos del sistema',
      icon: '📈',
      variables: {}
    }
  ]

  async function executeTask(taskId: string, variables: any) {
    setIsExecuting(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('http://127.0.0.1:8765/tasks/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_tarea: taskId, variables }),
        signal: AbortSignal.timeout(30000)
      })

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`)
      }

      const data = await res.json()
      setResult(data)
    } catch (e: any) {
      setError(e.message || 'Error al ejecutar la tarea')
    } finally {
      setIsExecuting(false)
    }
  }

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h2 style={{ margin: 0, marginBottom: 'var(--spacing-xs)' }}>📋 Tareas Automatizadas</h2>
        <p style={{ margin: 0, color: 'var(--dark-text-secondary)', fontSize: '0.875rem' }}>
          Ejecuta tareas predefinidas para automatizar tu trabajo
        </p>
      </div>

      {/* Available Tasks Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 'var(--spacing-lg)',
        marginBottom: 'var(--spacing-xl)'
      }}>
        {availableTasks.map(task => (
          <div
            key={task.id}
            className="card"
            style={{
              cursor: 'pointer',
              transition: 'all var(--transition-base)',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div style={{
              fontSize: '3rem',
              marginBottom: 'var(--spacing-md)',
              textAlign: 'center'
            }}>
              {task.icon}
            </div>
            <h3 style={{
              margin: 0,
              marginBottom: 'var(--spacing-sm)',
              fontSize: '1.125rem',
              textAlign: 'center'
            }}>
              {task.name}
            </h3>
            <p style={{
              margin: 0,
              marginBottom: 'var(--spacing-lg)',
              fontSize: '0.875rem',
              color: 'var(--dark-text-secondary)',
              textAlign: 'center',
              minHeight: '40px'
            }}>
              {task.description}
            </p>
            <button
              onClick={() => executeTask(task.id, task.variables)}
              disabled={isExecuting}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              {isExecuting ? (
                <>
                  <div className="spinner" />
                  Ejecutando...
                </>
              ) : (
                <>
                  ▶️ Ejecutar
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Result Display */}
      {(result || error) && (
        <div className="card animate-fade-in">
          <div className="card-header">
            <h3 className="card-title">
              {error ? '❌ Error' : '✅ Resultado'}
            </h3>
          </div>
          <div className="card-body">
            {error ? (
              <div style={{
                padding: 'var(--spacing-md)',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid var(--error-500)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--error-500)'
              }}>
                <strong>Error al ejecutar la tarea:</strong>
                <p style={{ margin: 'var(--spacing-xs) 0 0 0', fontSize: '0.875rem' }}>
                  {error}
                </p>
              </div>
            ) : result ? (
              <div>
                <p style={{
                  marginBottom: 'var(--spacing-md)',
                  color: 'var(--success-500)',
                  fontWeight: 600
                }}>
                  ✓ Tarea ejecutada exitosamente
                </p>
                <div style={{
                  background: 'var(--dark-bg)',
                  padding: 'var(--spacing-md)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--dark-border)'
                }}>
                  <h4 style={{
                    margin: 0,
                    marginBottom: 'var(--spacing-sm)',
                    fontSize: '0.875rem',
                    color: 'var(--dark-text-secondary)'
                  }}>
                    Eventos ejecutados:
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                    {result.events.map((event, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--spacing-sm)',
                          padding: 'var(--spacing-sm)',
                          background: 'var(--dark-surface)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.875rem'
                        }}
                      >
                        <span style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: event.status === 'done' ? 'var(--success-500)' : 'var(--warning-500)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          flexShrink: 0
                        }}>
                          {event.status === 'done' ? '✓' : '⋯'}
                        </span>
                        <span style={{ flex: 1 }}>{event.step}</span>
                        <span style={{
                          fontSize: '0.75rem',
                          color: 'var(--dark-text-secondary)',
                          textTransform: 'uppercase'
                        }}>
                          {event.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
          <div className="card-footer">
            <button
              onClick={() => {
                setResult(null)
                setError(null)
              }}
              className="btn btn-secondary btn-sm"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="card" style={{ marginTop: 'var(--spacing-xl)', background: 'var(--dark-surface)' }}>
        <div className="card-body">
          <h4 style={{ margin: 0, marginBottom: 'var(--spacing-sm)', fontSize: '1rem' }}>
            💡 ¿Cómo funcionan las tareas?
          </h4>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--dark-text-secondary)', lineHeight: 1.6 }}>
            Las tareas son flujos de trabajo automatizados definidos en archivos YAML.
            Cada tarea puede ejecutar múltiples pasos secuencialmente, como generar documentos,
            procesar datos, o interactuar con servicios externos. Los resultados se muestran
            en tiempo real para que puedas monitorear el progreso.
          </p>
        </div>
      </div>
    </div>
  )
}
