import api from './api.js'

// GET /products → { message, data: Product[] }
// Each Product: { id(number), name, sku, description, inventories[{ id, quantity, warehouseId, warehouse }] }
export async function getProducts() {
  const res = await api.get('/products')
  return res.data.data
}

// GET /products/:id
export async function getProductById(id) {
  const res = await api.get(`/products/${id}`)
  return res.data.data
}

// POST /products → { name, sku, description? }
export async function createProduct({ name, sku, description }) {
  const body = { name, sku }
  if (description?.trim()) body.description = description.trim()
  const res = await api.post('/products', body)
  return res.data.data
}

// PUT /products/:id → only send fields that are non-empty
// FIX: backend Joi rejects empty strings for optional string fields
export async function updateProduct(id, { name, sku, description }) {
  const body = {}
  if (name?.trim())        body.name        = name.trim()
  if (sku?.trim())         body.sku         = sku.trim()
  if (description?.trim()) body.description = description.trim()
  const res = await api.put(`/products/${id}`, body)
  return res.data.data
}

// DELETE /products/:id
export async function deleteProduct(id) {
  const res = await api.delete(`/products/${id}`)
  return res.data
}
