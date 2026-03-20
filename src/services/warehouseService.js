import api from './api.js'

// GET /warehouses → { message, data: Warehouse[] }
// Each Warehouse: { id(number), name, location, inventories[{ id, quantity, product }] }
export async function getWarehouses() {
  const res = await api.get('/warehouses')
  return res.data.data
}

// GET /warehouses/:id
export async function getWarehouseById(id) {
  const res = await api.get(`/warehouses/${id}`)
  return res.data.data
}

// POST /warehouses → { name, location? }
// FIX: don't send empty string for optional location field
export async function createWarehouse({ name, location }) {
  const body = { name: name.trim() }
  if (location?.trim()) body.location = location.trim()
  const res = await api.post('/warehouses', body)
  return res.data.data
}
