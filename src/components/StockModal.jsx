import { useState } from 'react'
import Modal from './Modal.jsx'
import { addStock, removeStock } from '../services/inventoryService.js'
import { useToast } from '../hooks/useToast.jsx'

// inventoryRow shape from backend:
// { id, quantity, warehouseId, warehouse: { id, name, location } }
export default function StockModal({ mode, product, inventoryRow, onClose, onSuccess }) {
  const [quantity,   setQuantity]  = useState('')
  const [note,       setNote]      = useState('')
  const [confirmed,  setConfirmed] = useState(false)
  const [loading,    setLoading]   = useState(false)
  const toast = useToast()

  const isRemove = mode === 'remove'

  async function handleSubmit(e) {
    e.preventDefault()
    const qty = parseInt(quantity)
    if (!qty || qty < 1) return

    // First click on remove → show confirmation dialog
    if (isRemove && !confirmed) {
      setConfirmed(true)
      return
    }

    // Guard: can't remove more than current stock
    if (isRemove && qty > inventoryRow.quantity) {
      toast(`Cannot remove more than current stock (${inventoryRow.quantity})`, 'error')
      return
    }

    setLoading(true)
    try {
      if (isRemove) {
        await removeStock({
          productId:   product.id,
          warehouseId: inventoryRow.warehouseId,
          quantity:    qty,
          note:        note || undefined,
        })
        toast('Stock removed successfully')
      } else {
        await addStock({
          productId:   product.id,
          warehouseId: inventoryRow.warehouseId,
          quantity:    qty,
          note:        note || undefined,
        })
        toast('Stock added successfully')
      }
      onSuccess()
      onClose()
    } catch (err) {
      toast(err.response?.data?.message || 'Operation failed', 'error')
      setConfirmed(false) // reset so user can try again
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title={`${isRemove ? 'Remove' : 'Add'} Stock — ${product.name}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* Info row */}
        <div className="bg-slate-800/60 rounded-lg px-3 py-2.5 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Warehouse</span>
            <span className="text-slate-200 font-medium">{inventoryRow.warehouse?.name}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-slate-400">Current stock</span>
            <span className="font-mono text-sky-400">{inventoryRow.quantity} units</span>
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Quantity *</label>
          <input
            type="number" min="1"
            max={isRemove ? inventoryRow.quantity : undefined}
            value={quantity}
            onChange={e => { setQuantity(e.target.value); setConfirmed(false) }}
            placeholder="Enter quantity"
            className="input" autoFocus required
          />
          {isRemove && (
            <p className="text-xs text-slate-500 mt-1">
              Max: <span className="font-mono text-slate-400">{inventoryRow.quantity}</span>
            </p>
          )}
        </div>

        {/* Optional note */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Note (optional)</label>
          <input
            type="text" value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Reason or reference..."
            className="input"
          />
        </div>

        {/* Confirmation warning for remove */}
        {isRemove && confirmed && (
          <div className="bg-red-950/60 border border-red-800 rounded-lg px-3 py-2.5 text-sm text-red-300">
            ⚠️ Remove <strong>{quantity}</strong> units from{' '}
            <strong>{inventoryRow.warehouse?.name}</strong>? Click "Confirm" to proceed.
          </div>
        )}

        <div className="flex gap-2 pt-1">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button
            type="submit"
            disabled={loading || !quantity}
            className={`flex-1 ${isRemove ? 'btn-danger' : 'btn-success'}`}
          >
            {loading             ? 'Processing...'
              : isRemove && confirmed ? '✓ Confirm Remove'
              : isRemove             ? 'Remove Stock'
              :                        'Add Stock'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
