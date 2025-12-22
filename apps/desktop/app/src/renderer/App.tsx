import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './styles/global.css'

export default function App() {
  const location = useLocation()
  const [showHelp, setShowHelp] = useState(false)

  const navItems = [
    { path: '/', label: 'Chat', icon: '💬' },
    { path: '/tasks', label: 'Tareas', icon: '📋' },
    { path: '/settings', label: 'Configuración', icon: '⚙️' }
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header/Navigation */}
      <header style={{
        background: 'linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)',
        borderBottom: '1px solid var(--dark-border)',
        boxShadow: 'var(--shadow-lg)',
        position: 'sticky',
        top: 0,
        zIndex: 'var(--z-sticky)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: 'var(--spacing-md) var(--spacing-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Logo/Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              backdropFilter: 'blur(10px)'
            }}>
              🤖
            </div>
            <div>
              <h1 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'white',
                margin: 0,
                letterSpacing: '-0.025em'
              }}>
                Asistente Personal
              </h1>
              <p style={{
                fontSize: '0.75rem',
                color: 'rgba(255, 255, 255, 0.8)',
                margin: 0
              }}>
                Tu asistente personal inteligente
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-xs)',
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  color: isActive(item.path) ? 'white' : 'rgba(255, 255, 255, 0.8)',
                  background: isActive(item.path) ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  fontWeight: isActive(item.path) ? '600' : '500',
                  fontSize: '0.875rem',
                  transition: 'all var(--transition-base)',
                  backdropFilter: isActive(item.path) ? 'blur(10px)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isActive(item.path)) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(item.path)) {
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}

            {/* Help Button */}
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="btn btn-secondary btn-sm"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                backdropFilter: 'blur(10px)'
              }}
            >
              ❓ Ayuda
            </button>
          </nav>
        </div>
      </header>

      {/* Help Panel */}
      {showHelp && (
        <div style={{
          background: 'var(--secondary-900)',
          borderBottom: '1px solid var(--dark-border)',
          padding: 'var(--spacing-lg)',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <h3 style={{ color: 'white', marginTop: 0 }}>💡 Centro de Ayuda</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-md)' }}>
                  <div>
                    <h4 style={{ color: 'var(--primary-300)', fontSize: '1rem' }}>💬 Chat</h4>
                    <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem' }}>
                      Conversa con el Asistente usando inteligencia artificial local. Escribe tu pregunta y presiona Enviar.
                    </p>
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--primary-300)', fontSize: '1rem' }}>📋 Tareas</h4>
                    <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem' }}>
                      Ejecuta tareas automatizadas como crear cotizaciones, procesar documentos y más.
                    </p>
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--primary-300)', fontSize: '1rem' }}>⚙️ Configuración</h4>
                    <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem' }}>
                      Ajusta el idioma, verifica el estado del sistema y gestiona tus datos.
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowHelp(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: 'var(--spacing-xs)'
                }}
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main style={{
        flex: 1,
        padding: 'var(--spacing-xl)',
        maxWidth: '1280px',
        width: '100%',
        margin: '0 auto'
      }}>
        {/* Router will render pages here */}
      </main>

      {/* Footer */}
      <footer style={{
        background: 'var(--dark-surface)',
        borderTop: '1px solid var(--dark-border)',
        padding: 'var(--spacing-md)',
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: '0.75rem',
          color: 'var(--dark-text-secondary)',
          margin: 0
        }}>
          Asistente Personal v0.1.0 • Asistente personal local y privado
        </p>
      </footer>
    </div>
  )
}
