import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProducts } from '../services/productService.js'
import { getWarehouses } from '../services/warehouseService.js'

function StatCard({ label, value, color, to }) {
  return (
    <Link to={to} className="card p-5 hover:border-slate-700 transition-colors group">
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">{label}</p>
      <p className={`text-3xl font-bold font-mono ${color}`}>{value}</p>
      <p className="text-xs text-slate-500 mt-2 group-hover:text-slate-400 transition-colors">View all →</p>
    </Link>
  )
}

export default function Dashboard() {
  const [products,   setProducts]   = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    Promise.all([getProducts(), getWarehouses()])
      .then(([p, w]) => { setProducts(p); setWarehouses(w) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const totalStock = products.reduce((s, p) =>
    s + (p.inventories || []).reduce((si, i) => si + i.quantity, 0), 0)

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Overview of your inventory system</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[0,1,2].map(i => <div key={i} className="card h-28 animate-pulse bg-slate-800/40" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Total Products"   value={products.length}   color="text-sky-400"     to="/products" />
          <StatCard label="Total Warehouses" value={warehouses.length} color="text-emerald-400" to="/warehouses" />
          <StatCard label="Total Stock Units" value={totalStock}       color="text-amber-400"   to="/products" />
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/products" className="card p-5 hover:border-sky-800/60 transition-colors group">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📦</span>
            <div>
              <p className="text-sm font-semibold text-slate-100 group-hover:text-sky-400 transition-colors">
                Manage Products
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Create, edit, view stock per warehouse</p>
            </div>
          </div>
        </Link>
        <Link to="/warehouses" className="card p-5 hover:border-emerald-800/60 transition-colors group">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏭</span>
            <div>
              <p className="text-sm font-semibold text-slate-100 group-hover:text-emerald-400 transition-colors">
                Manage Warehouses
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Create and view storage locations</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent products table */}
      {!loading && products.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-300">Recent Products</h2>
            <Link to="/products" className="text-xs text-sky-400 hover:text-sky-300 transition-colors">View all →</Link>
          </div>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-400">Name</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-400">SKU</th>
                  <th className="text-right px-4 py-2.5 text-xs font-medium text-slate-400">Total Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {products.slice(0, 5).map(p => {
                  const stock = (p.inventories || []).reduce((s, i) => s + i.quantity, 0)
                  return (
                    <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-200">{p.name}</td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-400">{p.sku}</td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-slate-300">{stock}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
