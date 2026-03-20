import { createContext, useContext, useState, useCallback } from 'react'

const Ctx = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const toast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts(p => [...p, { id, message, type }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500)
  }, [])

  return (
    <Ctx.Provider value={toast}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`slide-in pointer-events-auto flex items-center gap-2.5
            px-4 py-3 rounded-xl shadow-2xl border text-sm font-medium min-w-[260px]
            ${t.type === 'success' ? 'bg-emerald-950 border-emerald-700 text-emerald-200'
            : t.type === 'error'   ? 'bg-red-950 border-red-700 text-red-200'
            : 'bg-slate-800 border-slate-700 text-slate-200'}`}
          >
            <span>{t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}</span>
            {t.message}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}

export function useToast() {
  return useContext(Ctx)
}
