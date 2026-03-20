# Mini Inventory System — Frontend

React.js + Vite + Tailwind CSS frontend for the Mini Inventory System backend.

---

## Project Structure

```
src/
├── components/
│   ├── Modal.jsx           # Reusable modal base
│   ├── Navbar.jsx          # Top navigation
│   ├── ProductCard.jsx     # Expandable product card with edit/delete
│   ├── InventoryTable.jsx  # Stock table per warehouse (inside product card)
│   ├── StockModal.jsx      # Add / Remove stock modal
│   └── TransferModal.jsx   # Transfer stock between warehouses
├── pages/
│   ├── Login.jsx           # /login
│   ├── Register.jsx        # /register
│   ├── Dashboard.jsx       # / (home)
│   ├── Products.jsx        # /products
│   └── Warehouses.jsx      # /warehouses
├── services/
│   ├── api.js              # Axios instance (auto token + 401 redirect)
│   ├── authService.js      # signup, login, logout
│   ├── productService.js   # CRUD products
│   ├── warehouseService.js # CRUD warehouses
│   └── inventoryService.js # addStock, removeStock, transferStock
├── hooks/
│   └── useToast.jsx        # Global toast notification context
└── utils/
    └── auth.js             # Token helpers (localStorage)
```

---

## Setup & Run

### 1. Install dependencies
```bash
cd inventory-frontend
npm install
```

### 2. Set environment variable
The `.env` file is already configured for the backend default port:
```
VITE_API_BASE_URL=http://localhost:5000
```
Change `5000` if your backend runs on a different port.

### 3. Run the frontend
```bash
npm run dev
```
Frontend will be available at: **http://localhost:5173**

---

## Running Both Frontend + Backend

Open two terminals:

**Terminal 1 — Backend:**
```bash
cd Mini-inventory-system
npm run start:dev
# Runs on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd inventory-frontend
npm run dev
# Runs on http://localhost:5173
```

---

## API Endpoints Used

| Method | Endpoint              | Auth | Description               |
|--------|-----------------------|------|---------------------------|
| POST   | /auth/signup          | ❌   | Register new user          |
| POST   | /auth/login           | ❌   | Login → returns tokens     |
| GET    | /products             | ✅   | Get all products + inventory |
| POST   | /products             | ✅   | Create product             |
| PUT    | /products/:id         | ✅   | Update product             |
| DELETE | /products/:id         | ✅   | Delete product             |
| GET    | /warehouses           | ✅   | Get all warehouses         |
| POST   | /warehouses           | ✅   | Create warehouse           |
| POST   | /inventory/add        | ✅   | Add stock                  |
| POST   | /inventory/remove     | ✅   | Remove stock               |
| POST   | /inventory/transfer   | ✅   | Transfer between warehouses|

---

## Testing All Features

1. **Register** — Go to `/register`, create an account
   - Password must have: 8+ chars, uppercase, lowercase, number

2. **Login** — Go to `/login`, sign in

3. **Create a warehouse** — Go to `/warehouses` → New Warehouse

4. **Create a product** — Go to `/products` → New Product (name + SKU required)

5. **Add stock** — Click on a product to expand it → click "Add" on any warehouse row

6. **Remove stock** — Click "Remove" → enter quantity → confirmation dialog appears → click Confirm

7. **Transfer stock** — Click "Transfer" → select destination warehouse → enter quantity

8. **Edit product** — Click "Edit" button on any product card

9. **Delete product** — Click "Delete" (only works if product has no inventory records)

---

## Notes

- All inventory IDs sent to the backend are `number` type (not strings)
- The `GET /products` response already includes nested inventories with warehouse info — no extra API calls needed
- Token is stored in `localStorage` as `inv_access_token`
- On 401 response → auto redirect to `/login`
- Quantity badges: 🟢 green = 10+, 🟡 amber = 1-9, 🔴 red = 0
