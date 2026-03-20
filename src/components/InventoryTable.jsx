import { useState } from 'react'
import StockModal from './StockModal.jsx'
import TransferModal from './TransferModal.jsx'

// inventories come directly from product.inventories (already loaded)
// each row: { id, quantity, warehouseId, warehouse: { id, name, location } }
export default function InventoryTable({ product, onRefresh }) {
  const [modal, setModal] = useState(null) // { type, row }

  const rows = product.inventories || []

  if (rows.length === 0) {
    return (
      <p className="py-5 text-center text-slate-500 text-sm italic">
        No inventory records. Add stock to a warehouse to get started.
      </p>
    )
  }

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60">
              <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-400 uppercase tracking-wider">Warehouse</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-400 uppercase tracking-wider hidden sm:table-cell">Location</th>
              <th className="text-center px-4 py-2.5 text-xs font-medium text-slate-400 uppercase tracking-wider">Qty</th>
              <th className="text-right px-4 py-2.5 text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {rows.map(row => (
              <tr key={row.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-4 py-3 font-medium text-slate-200">
                  {row.warehouse?.name ?? `Warehouse #${row.warehouseId}`}
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs hidden sm:table-cell">
                  {row.warehouse?.location || '—'}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`tag font-mono ${
                    row.quantity === 0     ? 'bg-red-950 text-red-400 border border-red-800/50'
                    : row.quantity < 10   ? 'bg-amber-950 text-amber-400 border border-amber-800/50'
                                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                  }`}>{row.quantity}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => setModal({ type: 'add', row })}
                      className="btn btn-sm bg-emerald-950 text-emerald-400 border border-emerald-800/50 hover:bg-emerald-900"
                    >Add</button>
                    <button
                      onClick={() => setModal({ type: 'remove', row })}
                      className="btn btn-sm bg-red-950 text-red-400 border border-red-800/50 hover:bg-red-900"
                    >Remove</button>
                    <button
                      onClick={() => setModal({ type: 'transfer', row })}
                      className="btn btn-sm bg-sky-950 text-sky-400 border border-sky-800/50 hover:bg-sky-900"
                    >Transfer</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal?.type === 'add' && (
        <StockModal mode="add" product={product} inventoryRow={modal.row}
          onClose={() => setModal(null)} onSuccess={onRefresh} />
      )}
      {modal?.type === 'remove' && (
        <StockModal mode="remove" product={product} inventoryRow={modal.row}
          onClose={() => setModal(null)} onSuccess={onRefresh} />
      )}
      {modal?.type === 'transfer' && (
        <TransferModal product={product} inventoryRow={modal.row}
          onClose={() => setModal(null)} onSuccess={onRefresh} />
      )}
    </>
  )
}
