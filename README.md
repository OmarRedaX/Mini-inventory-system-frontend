# 🖥️ Mini Inventory System — Frontend

A clean, professional React.js frontend for the [Mini Inventory System backend](https://github.com/OmarRedaX/Mini-inventory-system). Built with Vite, Tailwind CSS, and Axios — designed to be simple, functional, and easy to maintain.

---

## 📌 Project Overview

This frontend provides a full user interface for managing products, warehouses, and inventory stock across multiple storage locations. It connects directly to the Mini Inventory System REST API, handles JWT authentication, and supports all core inventory operations through a clean dark-themed UI.

**What it does:**
- Authenticates users via JWT (register + login)
- Displays all products with their stock levels per warehouse
- Allows creating, editing, and deleting products and warehouses
- Provides stock operations — Add, Remove, and Transfer — through modal dialogs
- Shows real-time feedback via toast notifications and loading states
- Protects all routes from unauthenticated access

**Relationship to the backend:**
This project is the frontend layer for `OmarRedaX/Mini-inventory-system`. It communicates exclusively through the backend's REST API using an Axios instance that automatically attaches the JWT access token to every authenticated request.

---

## 🚀 Features

| Feature | Description |
|---|---|
| 🔐 Register & Login | Create an account and sign in with JWT-based authentication |
| 📦 Products List | View all products in an expandable card layout |
| 🔽 Expand Product | Click a product to see its full inventory breakdown by warehouse |
| ✏️ Edit / Delete Products | Inline edit form and confirmation modal for deletion |
| 🏭 Warehouses | View all warehouses with product count and total stock |
| ➕ Create Product / Warehouse | Inline forms that appear on the same page without navigation |
| 📥 Add Stock | Modal to add units to a product in a specific warehouse |
| 📤 Remove Stock | Modal with two-step confirmation before removing units |
| 🔄 Transfer Stock | Modal to move stock between warehouses atomically |
| 🔔 Toast Notifications | Success and error alerts slide in for every operation |
| ⏳ Loading States | Skeleton loaders on initial fetch, spinners on background refresh |
| 🛡️ Protected Routes | All pages except `/login` and `/register` require a valid token |
| 🔁 Auto 401 Redirect | Expired token triggers automatic logout and redirect to login |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [React.js 18](https://react.dev) | UI library — functional components with hooks |
| [Vite 5](https://vitejs.dev) | Build tool and dev server |
| [Tailwind CSS 3](https://tailwindcss.com) | Utility-first styling |
| [Axios](https://axios-http.com) | HTTP client with interceptors for auth |
| [React Router v6](https://reactrouter.com) | Client-side routing and navigation |
| [DM Sans](https://fonts.google.com/specimen/DM+Sans) | Primary UI font |
| [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) | Monospace font for SKUs and quantities |

---

## 📁 Folder Structure

```
Mini-inventory-system-frontend/
├── index.html                  # HTML entry point (loads fonts + root div)
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind theme + content paths
├── postcss.config.js           # PostCSS config for Tailwind
├── .env                        # Environment variables (not committed)
├── package.json
└── src/
    ├── main.jsx                # React app entry — mounts <App /> to DOM
    ├── App.jsx                 # Root component: routing, layout, ToastProvider
    ├── index.css               # Tailwind directives + global component classes
    │
    ├── pages/
    │   ├── Login.jsx           # /login — email/password form
    │   ├── Register.jsx        # /register — signup with confirmPassword
    │   ├── Dashboard.jsx       # / — stats overview + quick navigation
    │   ├── Products.jsx        # /products — product list + create form
    │   └── Warehouses.jsx      # /warehouses — warehouse grid + create form
    │
    ├── components/
    │   ├── Navbar.jsx          # Sticky top nav with active link highlighting
    │   ├── Modal.jsx           # Reusable modal base (Escape key + backdrop close)
    │   ├── ProductCard.jsx     # Expandable card with edit/delete modals
    │   ├── InventoryTable.jsx  # Stock table shown inside expanded product card
    │   ├── StockModal.jsx      # Add / Remove stock with confirmation step
    │   └── TransferModal.jsx   # Transfer stock between warehouses
    │
    ├── services/
    │   ├── api.js              # Axios instance — baseURL, auth header, 401 handler
    │   ├── authService.js      # signup(), login(), logout()
    │   ├── productService.js   # getProducts(), createProduct(), updateProduct(), deleteProduct()
    │   ├── warehouseService.js # getWarehouses(), createWarehouse()
    │   └── inventoryService.js # addStock(), removeStock(), transferStock()
    │
    ├── hooks/
    │   └── useToast.jsx        # React context for global toast notifications
    │
    └── utils/
        └── auth.js             # getToken(), setToken(), removeToken(), isLoggedIn()
```

### Folder Purposes

**`pages/`** — Top-level route components. Each page owns its data fetching, state, and layout. Pages are thin: they delegate rendering to components and API calls to services.

**`components/`** — Reusable UI building blocks. Components are stateful where needed (modals, forms) but receive data and callbacks from pages via props.

**`services/`** — All API communication is isolated here. No component or page calls Axios directly. Each service file maps 1:1 to a backend module.

**`hooks/`** — Custom React hooks for shared logic. Currently contains the toast notification context which wraps the entire app.

**`utils/`** — Pure utility functions. `auth.js` is a thin wrapper around `localStorage` for token management, keeping the storage key in one place.

---

## 🚀 Setup & Run Instructions

### Prerequisites
- Node.js 18+
- The [backend](https://github.com/OmarRedaX/Mini-inventory-system) running locally on port `5000`

### 1. Clone the repository

```bash
git clone https://github.com/OmarRedaX/Mini-inventory-system-frontend
cd Mini-inventory-system-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

```bash
touch .env
```

### 4. Set environment variables

Open `.env` and add:

```env
VITE_API_BASE_URL=http://localhost:5000
```

> Change `5000` to whatever port your backend runs on.

### 5. Run the dev server

```bash
npm run dev
```

Frontend will be available at **`http://localhost:5173`**

### 6. Build for production

```bash
npm run build
```

Output goes to `dist/`. Serve it with any static file server:

```bash
npm run preview    # local preview of the production build
```

---

## 🔗 API Integration

### Axios Instance (`services/api.js`)

All HTTP calls go through a single Axios instance configured with:

```js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
})
```

**Request interceptor** — attaches the JWT token automatically:
```js
api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)
```

**Response interceptor** — handles expired/invalid tokens globally:
```js
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      removeToken()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)
```

### Token Storage

The access token is stored in `localStorage` under the key `inv_access_token` via `utils/auth.js`:

```js
export const getToken    = ()      => localStorage.getItem('inv_access_token')
export const setToken    = (token) => localStorage.setItem('inv_access_token', token)
export const removeToken = ()      => localStorage.removeItem('inv_access_token')
export const isLoggedIn  = ()      => !!getToken()
```

### Protected Routes (`App.jsx`)

All authenticated pages are wrapped in a `<Protected>` component:

```jsx
function Protected({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />
}
```

### Example API Calls

```js
// Auth
await api.post('/auth/login', { email, password })
await api.post('/auth/signup', { email, password, confirmPassword })

// Products — response includes nested inventories
await api.get('/products')
await api.post('/products', { name, sku, description })
await api.put(`/products/${id}`, { name, sku })
await api.delete(`/products/${id}`)

// Warehouses
await api.get('/warehouses')
await api.post('/warehouses', { name, location })

// Inventory — all IDs sent as numbers
await api.post('/inventory/add',      { productId, warehouseId, quantity, note })
await api.post('/inventory/remove',   { productId, warehouseId, quantity, note })
await api.post('/inventory/transfer', { productId, fromWarehouseId, toWarehouseId, quantity, note })
```

---

## 🎯 Key Features — How They Work

### Products List Page (`/products`)
Fetches all products from `GET /products` on mount. The response includes nested `inventories` for each product, so no additional API calls are needed when expanding a product. A search bar filters the list client-side by name or SKU. A spinner in the page header indicates background refreshes after stock operations (no full skeleton reload).

### Expand Product → Inventory Display
Clicking on a `ProductCard` toggles an `InventoryTable` below the card header. The table renders rows from `product.inventories` — already available in the GET response — showing warehouse name, location, quantity badge (🟢/🟡/🔴 by threshold), and action buttons.

### Create Product / Warehouse Forms
Both pages have an inline "New Product" / "New Warehouse" toggle button. Clicking it reveals a form on the same page without navigation. On success, the list auto-refreshes silently. Required fields are enforced both client-side (`required` attribute) and server-side.

### Stock Modals
Each inventory row has three action buttons that open a modal:
- **Add** (`StockModal mode="add"`) — quantity input + optional note → calls `POST /inventory/add`
- **Remove** (`StockModal mode="remove"`) — quantity input with max validation → first click shows a red confirmation banner → second click calls `POST /inventory/remove`
- **Transfer** (`TransferModal`) — fetches warehouse list on open, filters out current warehouse, shows From/To preview, calls `POST /inventory/transfer`

All modals close on success and trigger a silent background refresh of the product list.

### Loading States & Alerts
- **Initial page load** — skeleton placeholder cards while fetching
- **Background refresh** — spinning indicator in the page title, no content flicker
- **Button states** — buttons show "Processing...", "Creating...", "Transferring..." and are disabled during API calls
- **Toasts** — slide in from the bottom-right, green for success, red for errors, auto-dismiss after 3.5 seconds

---

## 🧠 Assumptions & Design Decisions

**No extra inventory endpoint needed**
`GET /products` already returns nested inventories with warehouse data. The frontend uses this directly in `InventoryTable`, avoiding redundant API calls when expanding product cards.

**Two-step confirmation for Remove Stock**
Removing stock is destructive. Rather than a separate confirmation modal, the same `StockModal` shows a red warning banner after the first submit click, requiring a second click to confirm. This is intentional — keeps the UI minimal while preventing accidents.

**Silent refresh after stock operations**
After add/remove/transfer, the product list refreshes in the background (no skeleton flash). A small spinner appears in the header to signal activity. This preserves expanded cards and scroll position.

**Separated loading states in `TransferModal`**
`fetching` (loading warehouses on mount) and `loading` (submitting the form) are separate state variables. The submit button is disabled during both. A spinner replaces the select dropdown while warehouses are loading.

**Token stored in `localStorage`**
For a single-page app without SSR, `localStorage` is straightforward and sufficient. The token key is centralized in `utils/auth.js` so it can be changed in one place.

**Context for toasts, not a library**
A custom `useToast` context hook was used instead of a third-party toast library to keep dependencies minimal and give full control over appearance.

**React Router v6 `<Navigate>` for route protection**
Auth checks happen at render time using `isLoggedIn()`. If the token is missing, React Router redirects before the page component mounts, preventing any authenticated API calls.

---

## ⚠️ Notes

- **Backend repository:** [Mini-inventory-system](https://github.com/OmarRedaX/Mini-inventory-system)
- The backend must be running before starting the frontend
- Update `VITE_API_BASE_URL` in `.env` to match your backend's actual port
- The `.env` file is listed in `.gitignore` and should never be committed
- All inventory `productId`, `warehouseId`, `fromWarehouseId`, `toWarehouseId` values are sent as **JavaScript numbers**, not strings — matching the backend's Joi validation which expects `joi.number()`
- Delete product will return a `400` error if the product has existing inventory records — remove all stock first
- Password requirements for registration: minimum 8 characters, at least one uppercase letter, one lowercase letter, and one digit