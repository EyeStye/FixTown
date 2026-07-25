import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be inside ToastProvider')
  return ctx
}

const toastStyles = {
  success: { bg: 'rgba(74,222,128,0.12)', border: 'rgba(74,222,128,0.3)',  icon: '✅', color: '#4ade80' },
  error:   { bg: 'rgba(251,113,133,0.12)', border: 'rgba(251,113,133,0.3)', icon: '❌', color: '#fb7185' },
  info:    { bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.3)',  icon: 'ℹ️', color: '#f59e0b' },
  warning: { bg: 'rgba(251,191,36,0.10)', border: 'rgba(251,191,36,0.25)', icon: '⚠️', color: '#fbbf24' },
}

function ToastContainer({ toasts, onRemove }) {
  if (!toasts.length) return null

  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px',
      zIndex: 'var(--z-toast)',
      display: 'flex', flexDirection: 'column', gap: '10px',
      maxWidth: '360px', width: 'calc(100vw - 48px)',
    }}>
      {toasts.map(toast => {
        const s = toastStyles[toast.type] || toastStyles.info
        return (
          <div key={toast.id} style={{
            display: 'flex', alignItems: 'flex-start', gap: '10px',
            padding: '12px 14px',
            background: s.bg,
            border: `1px solid ${s.border}`,
            borderRadius: 'var(--radius-lg)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            animation: 'fadeInUp 0.25s var(--ease-out) both',
            cursor: 'pointer',
          }}
          onClick={() => onRemove(toast.id)}
          >
            <span style={{ fontSize: '1rem', flexShrink: 0, marginTop: '1px' }}>{s.icon}</span>
            <span style={{
              fontSize: '0.875rem', color: 'var(--text-primary)',
              lineHeight: '1.5', flex: 1,
            }}>
              {toast.message}
            </span>
            <button onClick={() => onRemove(toast.id)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', fontSize: '1rem', flexShrink: 0,
              lineHeight: 1, padding: '0 2px',
            }}>×</button>
          </div>
        )
      })}
    </div>
  )
}