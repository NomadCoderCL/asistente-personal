import React, { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant' | 'error'
  content: string
  timestamp: Date
}

export default function Chat() {
  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Check backend status on mount
  useEffect(() => {
    checkBackend()
  }, [])

  async function checkBackend() {
    try {
      const res = await fetch('http://127.0.0.1:8765/health', { signal: AbortSignal.timeout(3000) })
      setBackendStatus(res.ok ? 'online' : 'offline')
    } catch {
      setBackendStatus('offline')
    }
  }

  async function send() {
    if (!prompt.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: prompt,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setPrompt('')
    setIsLoading(true)

    try {
      const res = await fetch('http://127.0.0.1:8765/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'qwen2.5:0.5b',
          prompt: userMessage.content,
          max_tokens: 512,
          temperature: 0.7
        }),
        signal: AbortSignal.timeout(60000) // 60 second timeout
      })

      if (!res.ok) {
        throw new Error(`Backend error: ${res.status}`)
      }

      const data = await res.json()
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.text || 'No response received',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (e: any) {
      const errorMessage: Message = {
        role: 'error',
        content: `Error: ${e.message || 'No se pudo conectar con el backend'}`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="animate-fade-in">
      {/* Header with status */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--spacing-lg)'
      }}>
        <div>
          <h2 style={{ margin: 0, marginBottom: 'var(--spacing-xs)' }}>💬 Chat con Carmen</h2>
          <p style={{ margin: 0, color: 'var(--dark-text-secondary)', fontSize: '0.875rem' }}>
            Conversa con tu asistente personal inteligente
          </p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-sm)',
          padding: 'var(--spacing-sm) var(--spacing-md)',
          background: 'var(--dark-surface)',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--dark-border)'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: backendStatus === 'online' ? 'var(--success-500)' :
              backendStatus === 'offline' ? 'var(--error-500)' :
                'var(--warning-500)',
            animation: backendStatus === 'checking' ? 'pulse 2s infinite' : 'none'
          }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--dark-text-secondary)' }}>
            {backendStatus === 'online' ? 'Conectado' :
              backendStatus === 'offline' ? 'Desconectado' :
                'Verificando...'}
          </span>
          <button
            onClick={checkBackend}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--primary-500)',
              cursor: 'pointer',
              padding: '2px',
              fontSize: '0.75rem'
            }}
          >
            🔄
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="card" style={{
        minHeight: '500px',
        maxHeight: '600px',
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        overflow: 'hidden'
      }}>
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: 'var(--spacing-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-md)'
        }}>
          {messages.length === 0 ? (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--dark-text-secondary)',
              textAlign: 'center',
              gap: 'var(--spacing-md)'
            }}>
              <div style={{ fontSize: '4rem' }}>🤖</div>
              <div>
                <h3 style={{ margin: 0, marginBottom: 'var(--spacing-xs)' }}>¡Hola! Soy tu Asistente</h3>
                <p style={{ margin: 0, fontSize: '0.875rem' }}>
                  Escribe un mensaje para comenzar la conversación
                </p>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 'var(--spacing-sm)',
                width: '100%',
                maxWidth: '600px',
                marginTop: 'var(--spacing-lg)'
              }}>
                {['¿Qué puedes hacer?', '¿Cómo funcionas?', 'Ayúdame con una tarea'].map(suggestion => (
                  <button
                    key={suggestion}
                    onClick={() => setPrompt(suggestion)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem' }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: 'var(--spacing-md)',
                  alignItems: 'flex-start',
                  animation: 'fadeIn 0.3s ease-out'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-md)',
                  background: msg.role === 'user' ? 'var(--primary-600)' :
                    msg.role === 'error' ? 'var(--error-600)' :
                      'var(--secondary-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '1.2rem'
                }}>
                  {msg.role === 'user' ? '👤' : msg.role === 'error' ? '⚠️' : '🤖'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    gap: 'var(--spacing-sm)',
                    alignItems: 'center',
                    marginBottom: 'var(--spacing-xs)'
                  }}>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                      {msg.role === 'user' ? 'Tú' : msg.role === 'error' ? 'Error' : 'Asistente'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--dark-text-secondary)' }}>
                      {msg.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div style={{
                    background: msg.role === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                    padding: msg.role === 'error' ? 'var(--spacing-sm)' : 0,
                    borderRadius: 'var(--radius-sm)',
                    color: msg.role === 'error' ? 'var(--error-500)' : 'var(--dark-text)',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    lineHeight: 1.6
                  }}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div style={{
              display: 'flex',
              gap: 'var(--spacing-md)',
              alignItems: 'flex-start',
              animation: 'fadeIn 0.3s ease-out'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--secondary-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem'
              }}>
                🤖
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 'var(--spacing-xs)', display: 'block' }}>
                  Asistente
                </span>
                <div style={{ display: 'flex', gap: 'var(--spacing-xs)', alignItems: 'center' }}>
                  <div className="spinner" />
                  <span style={{ fontSize: '0.875rem', color: 'var(--dark-text-secondary)' }}>
                    Pensando...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{
          borderTop: '1px solid var(--dark-border)',
          padding: 'var(--spacing-lg)',
          background: 'var(--dark-bg)'
        }}>
          <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
            <textarea
              className="textarea"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje aquí... (Shift+Enter para nueva línea)"
              disabled={isLoading || backendStatus === 'offline'}
              style={{
                minHeight: '60px',
                maxHeight: '150px',
                resize: 'none'
              }}
            />
            <button
              onClick={send}
              disabled={!prompt.trim() || isLoading || backendStatus === 'offline'}
              className="btn btn-primary"
              style={{
                alignSelf: 'flex-end',
                minWidth: '100px'
              }}
            >
              {isLoading ? (
                <>
                  <div className="spinner" />
                  Enviando
                </>
              ) : (
                <>
                  📤 Enviar
                </>
              )}
            </button>
          </div>
          {backendStatus === 'offline' && (
            <div style={{
              marginTop: 'var(--spacing-sm)',
              padding: 'var(--spacing-sm)',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid var(--error-500)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              color: 'var(--error-500)'
            }}>
              ⚠️ El backend no está disponible. Verifica que el servidor esté ejecutándose.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
