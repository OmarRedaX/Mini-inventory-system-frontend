import api from './api.js'

// POST /inventory/add → { productId: number, warehouseId: number, quantity: number, note?: string }
export async function addStock({ productId, warehouseId, quantity, note }) {
  const body = {
    productId: Number(productId),
    warehouseId: Number(warehouseId),
    quantity: Number(quantity),
  }
  if (note) body.note = note
  const res = await api.post('/inventory/add', body)
  return res.data.data
}

// POST /inventory/remove → { productId: number, warehouseId: number, quantity: number, note?: string }
export async function removeStock({ productId, warehouseId, quantity, note }) {
  const body = {
    productId: Number(productId),
    warehouseId: Number(warehouseId),
    quantity: Number(quantity),
  }
  if (note) body.note = note
  const res = await api.post('/inventory/remove', body)
  return res.data.data
}

// POST /inventory/transfer → { productId, fromWarehouseId, toWarehouseId, quantity, note? }
export async function transferStock({ productId, fromWarehouseId, toWarehouseId, quantity, note }) {
  const body = {
    productId: Number(productId),
    fromWarehouseId: Number(fromWarehouseId),
    toWarehouseId: Number(toWarehouseId),
    quantity: Number(quantity),
  }
  if (note) body.note = note
  const res = await api.post('/inventory/transfer', body)
  return res.data.data
}
