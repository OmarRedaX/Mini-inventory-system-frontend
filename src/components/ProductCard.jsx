import { useState } from 'react'
import InventoryTable from './InventoryTable.jsx'
import Modal from './Modal.jsx'
import { updateProduct, deleteProduct } from '../services/productService.js'
import { useToast } from '../hooks/useToast.jsx'

export default function ProductCard({ product, onRefresh }) {
  const [expanded,    setExpanded]   = useState(false)
  const [editOpen,    setEditOpen]   = useState(false)
  const [deleteOpen,  setDeleteOpen] = useState(false)
  const [editForm,    setEditForm]   = useState({
    name:        product.name,
    sku:         product.sku,
    description: product.description || '',
  })
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  function openEdit() {
    // Reset form to current values every time Edit is opened
    setEditForm({ name: product.name, sku: product.sku, description: product.description || '' })
    setEditOpen(true)
  }

  async function handleEdit(e) {
    e.preventDefault()
    // Guard: name and sku must not be empty
    if (!editForm.name.trim() || !editForm.sku.trim()) {
      toast('Name and SKU are required', 'error')
      return
    }
    setLoading(true)
    try {
      await updateProduct(product.id, editForm)
      toast('Product updated successfully')
      setEditOpen(false)
      onRefresh()
    } catch (err) {
      toast(err.response?.data?.message || 'Update failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    setLoading(true)
    try {
      await deleteProduct(product.id)
      toast('Product deleted successfully')
      setDeleteOpen(false)
      onRefresh()
    } catch (err) {
      toast(err.response?.data?.message || 'Delete failed', 'error')
      setDeleteOpen(false)
    } finally {
      setLoading(false)
    }
  }

  const totalStock    = (product.inventories || []).reduce((s, i) => s + i.quantity, 0)
  const warehouseCount = (product.inventories || []).length

  return (
    <>
      <div className="card overflow-hidden">
        {/* Card header */}
        <div className="px-5 py-4 flex items-center gap-3">

          {/* Expand toggle */}
          <button
            onClick={() => setExpanded(v => !v)}
            className="flex-1 flex items-start gap-3 text-left min-w-0"
          >
            <span className={`mt-0.5 text-slate-500 text-xs transition-transform duration-200 shrink-0 ${expanded ? 'rotate-90' : ''}`}>
              ▶
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-slate-100 text-sm">{product.name}</span>
                <span className="tag bg-slate-800 text-slate-400 border border-slate-700">{product.sku}</span>
              </div>
              {product.description && (
                <p className="text-xs text-slate-500 mt-0.5 truncate">{product.description}</p>
              )}
            </div>
            {/* Stats — hidden on mobile */}
            <div className="hidden sm:flex items-center gap-4 shrink-0 text-xs">
              <span className="text-slate-500">
                <span className="font-mono text-slate-300">{totalStock}</span> units
              </span>
              <span className="text-slate-500">
                <span className="font-mono text-slate-300">{warehouseCount}</span> warehouses
              </span>
            </div>
          </button>

          {/* Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button onClick={openEdit} className="btn btn-sm btn-secondary">Edit</button>
            <button
              onClick={() => setDeleteOpen(true)}
              className="btn btn-sm bg-red-950/60 text-red-400 border border-red-900 hover:bg-red-900/60"
            >Delete</button>
          </div>
        </div>

        {/* Expanded inventory section */}
        {expanded && (
          <div className="px-5 pb-5 pt-4 border-t border-slate-800 fade-in">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
              Inventory per Warehouse
            </p>
            <InventoryTable product={product} onRefresh={onRefresh} />
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editOpen && (
        <Modal title={`Edit — ${product.name}`} onClose={() => setEditOpen(false)} size="md">
          <form onSubmit={handleEdit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Name *</label>
              <input
                className="input" value={editForm.name} required
                onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">SKU *</label>
              <input
                className="input font-mono" value={editForm.sku} required
                onChange={e => setEditForm(p => ({ ...p, sku: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Description
                <span className="ml-1 font-normal text-slate-600">(optional — clear to remove)</span>
              </label>
              <input
                className="input" value={editForm.description} placeholder="Leave empty to remove"
                onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))}
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={() => setEditOpen(false)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn-primary flex-1">
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirm Modal */}
      {deleteOpen && (
        <Modal title="Delete Product" onClose={() => setDeleteOpen(false)}>
          <div className="flex flex-col gap-4">
            <p className="text-sm text-slate-300">
              Are you sure you want to delete{' '}
              <strong className="text-white">{product.name}</strong>?
            </p>
            <div className="bg-amber-950/40 border border-amber-800/50 rounded-lg px-3 py-2.5 text-xs text-amber-300">
              ⚠️ This will fail if the product has existing inventory records. Remove all stock first.
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setDeleteOpen(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleDelete} disabled={loading} className="btn-danger flex-1">
                {loading ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
