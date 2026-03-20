import { useState, useEffect, useCallback } from 'react'
import { getProducts, createProduct } from '../services/productService.js'
import ProductCard from '../components/ProductCard.jsx'
import { useToast } from '../hooks/useToast.jsx'

const EMPTY_FORM = { name: '', sku: '', description: '' }

export default function Products() {
  const [products,   setProducts]  = useState([])
  const [loading,    setLoading]   = useState(true)
  // FIX: separate refreshing state so background refresh
  // doesn't replace the full list with skeletons
  const [refreshing, setRefreshing] = useState(false)
  const [search,     setSearch]    = useState('')
  const [showForm,   setShowForm]  = useState(false)
  const [form,       setForm]      = useState(EMPTY_FORM)
  const [creating,   setCreating]  = useState(false)
  const toast = useToast()

  // Initial load — shows skeleton
  const fetchProducts = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    else setRefreshing(true)
    try {
      const data = await getProducts()
      setProducts(data)
    } catch {
      if (!silent) setProducts([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  // Called after stock operations — silent refresh, no skeletons
  const refreshSilent = useCallback(() => fetchProducts(true), [fetchProducts])

  async function handleCreate(e) {
    e.preventDefault()
    setCreating(true)
    try {
      await createProduct(form)
      toast('Product created successfully')
      setForm(EMPTY_FORM)
      setShowForm(false)
      fetchProducts(true)
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to create product', 'error')
    } finally {
      setCreating(false)
    }
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-100">Products</h1>
            {refreshing && (
              <span className="w-4 h-4 border-2 border-slate-600 border-t-sky-400 rounded-full animate-spin" />
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {loading ? 'Loading...' : `${products.length} product${products.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button onClick={() => setShowForm(v => !v)} className="btn-primary">
          {showForm ? '✕ Cancel' : '+ New Product'}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="card p-5 border-sky-900/40 fade-in">
          <h3 className="text-sm font-semibold text-slate-100 mb-4">Create New Product</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Name *</label>
              <input className="input" value={form.name} placeholder="Product name" required
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">SKU *</label>
              <input className="input font-mono" value={form.sku} placeholder="e.g. PROD-001" required
                onChange={e => setForm(p => ({ ...p, sku: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Description</label>
              <input className="input" value={form.description} placeholder="Optional"
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
            </div>
            <div className="sm:col-span-3 flex gap-2 pt-1">
              <button type="button" onClick={() => { setShowForm(false); setForm(EMPTY_FORM) }}
                className="btn-secondary">Cancel</button>
              <button type="submit" disabled={creating} className="btn-primary">
                {creating ? 'Creating...' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      {products.length > 3 && (
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or SKU..." className="input max-w-sm" />
      )}

      {/* List */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[0,1,2,3].map(i => <div key={i} className="card h-16 animate-pulse bg-slate-800/40" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-slate-500 text-sm">
            {search ? 'No products match your search.' : 'No products yet. Create your first one!'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} onRefresh={refreshSilent} />
          ))}
        </div>
      )}
    </div>
  )
}
