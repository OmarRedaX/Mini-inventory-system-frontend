import { useState, useEffect, useCallback } from 'react'
import { getWarehouses, createWarehouse } from '../services/warehouseService.js'
import { useToast } from '../hooks/useToast.jsx'

const EMPTY_FORM = { name: '', location: '' }

export default function Warehouses() {
  const [warehouses, setWarehouses] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [showForm,   setShowForm]   = useState(false)
  const [form, setForm]             = useState(EMPTY_FORM)
  const [creating,   setCreating]   = useState(false)
  const toast = useToast()

  const fetchWarehouses = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getWarehouses()
      setWarehouses(data)
    } catch {
      setWarehouses([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchWarehouses() }, [fetchWarehouses])

  async function handleCreate(e) {
    e.preventDefault()
    setCreating(true)
    try {
      await createWarehouse(form)
      toast('Warehouse created successfully')
      setForm(EMPTY_FORM)
      setShowForm(false)
      fetchWarehouses()
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to create warehouse', 'error')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Warehouses</h1>
          <p className="text-sm text-slate-500 mt-1">
            {loading ? 'Loading...' : `${warehouses.length} warehouse${warehouses.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button onClick={() => setShowForm(v => !v)} className="btn-primary">
          {showForm ? '✕ Cancel' : '+ New Warehouse'}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="card p-5 border-sky-900/40 fade-in">
          <h3 className="text-sm font-semibold text-slate-100 mb-4">Create New Warehouse</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Name *</label>
              <input className="input" value={form.name} placeholder="Warehouse name" required
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Location</label>
              <input className="input" value={form.location} placeholder="e.g. Cairo, Building A"
                onChange={e => setForm(p => ({ ...p, location: e.target.value }))} />
            </div>
            <div className="sm:col-span-2 flex gap-2 pt-1">
              <button type="button" onClick={() => { setShowForm(false); setForm(EMPTY_FORM) }}
                className="btn-secondary">Cancel</button>
              <button type="submit" disabled={creating} className="btn-primary">
                {creating ? 'Creating...' : 'Create Warehouse'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[0,1,2].map(i => <div key={i} className="card h-24 animate-pulse bg-slate-800/40" />)}
        </div>
      ) : warehouses.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-slate-500 text-sm">No warehouses yet. Create your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {warehouses.map((w, i) => {
            const productCount = (w.inventories || []).length
            const totalStock   = (w.inventories || []).reduce((s, inv) => s + inv.quantity, 0)
            return (
              <div key={w.id} className="card p-5 hover:border-slate-700 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-950 border border-emerald-800/50
                                  flex items-center justify-center text-emerald-400 text-xs font-bold font-mono shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-100 text-sm truncate">{w.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{w.location || 'No location set'}</p>
                    <div className="flex gap-3 mt-2 text-xs text-slate-500">
                      <span><span className="font-mono text-slate-300">{productCount}</span> products</span>
                      <span><span className="font-mono text-slate-300">{totalStock}</span> units</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
