import { useState, useEffect } from 'react'
import Modal from './Modal.jsx'
import { transferStock } from '../services/inventoryService.js'
import { getWarehouses } from '../services/warehouseService.js'
import { useToast } from '../hooks/useToast.jsx'

export default function TransferModal({ product, inventoryRow, onClose, onSuccess }) {
  const [quantity,   setQuantity]  = useState('')
  const [note,       setNote]      = useState('')
  const [toWarehouseId, setTo]     = useState('')
  const [warehouses, setWarehouses] = useState([])
  // FIX: separate loading states for fetch vs submit
  const [fetching,   setFetching]  = useState(true)
  const [loading,    setLoading]   = useState(false)
  const toast = useToast()

  useEffect(() => {
    setFetching(true)
    getWarehouses()
      .then(list => setWarehouses(list.filter(w => w.id !== inventoryRow.warehouseId)))
      .catch(() => toast('Failed to load warehouses', 'error'))
      .finally(() => setFetching(false))
  }, [inventoryRow.warehouseId])

  const destWarehouse = warehouses.find(w => w.id === Number(toWarehouseId))

  async function handleSubmit(e) {
    e.preventDefault()
    const qty = parseInt(quantity)
    if (!qty || qty < 1 || !toWarehouseId) return
    setLoading(true)
    try {
      await transferStock({
        productId:       product.id,
        fromWarehouseId: inventoryRow.warehouseId,
        toWarehouseId:   Number(toWarehouseId),
        quantity:        qty,
        note,
      })
      toast('Transfer completed successfully')
      onSuccess()
      onClose()
    } catch (err) {
      toast(err.response?.data?.message || 'Transfer failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title={`Transfer Stock — ${product.name}`} onClose={onClose} size="md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* From → To summary */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-slate-800/60 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">From</p>
            <p className="font-medium text-slate-100">{inventoryRow.warehouse?.name}</p>
            <p className="text-xs font-mono text-sky-400 mt-0.5">{inventoryRow.quantity} units</p>
          </div>
          <div className="bg-slate-800/60 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">To</p>
            {destWarehouse
              ? <><p className="font-medium text-slate-100">{destWarehouse.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{destWarehouse.location || '—'}</p></>
              : <p className="text-slate-500 italic text-xs">Select below</p>
            }
          </div>
        </div>

        {/* Destination warehouse */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">
            Destination Warehouse *
          </label>
          {fetching ? (
            <div className="input flex items-center gap-2 text-slate-500 text-xs">
              <span className="w-3.5 h-3.5 border-2 border-slate-600 border-t-sky-400 rounded-full animate-spin inline-block" />
              Loading warehouses...
            </div>
          ) : (
            <select value={toWarehouseId} onChange={e => setTo(e.target.value)} className="input" required>
              <option value="">Select warehouse...</option>
              {warehouses.map(w => (
                <option key={w.id} value={w.id}>
                  {w.name}{w.location ? ` — ${w.location}` : ''}
                </option>
              ))}
            </select>
          )}
          {!fetching && warehouses.length === 0 && (
            <p className="text-xs text-amber-400 mt-1">
              ⚠️ No other warehouses available. Create one first.
            </p>
          )}
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Quantity *</label>
          <input
            type="number" min="1" max={inventoryRow.quantity}
            value={quantity} onChange={e => setQuantity(e.target.value)}
            placeholder="Enter quantity" className="input" required
          />
          <p className="text-xs text-slate-500 mt-1">
            Max available: <span className="font-mono text-slate-400">{inventoryRow.quantity}</span>
          </p>
        </div>

        {/* Note */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Note (optional)</label>
          <input type="text" value={note} onChange={e => setNote(e.target.value)}
            placeholder="Reason or reference..." className="input" />
        </div>

        <div className="flex gap-2 pt-1">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button
            type="submit"
            disabled={loading || fetching || !quantity || !toWarehouseId || warehouses.length === 0}
            className="btn-primary flex-1"
          >
            {loading ? 'Transferring...' : 'Transfer Stock'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
