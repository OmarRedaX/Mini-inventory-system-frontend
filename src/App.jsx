import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastProvider } from './hooks/useToast.jsx'
import { isLoggedIn } from './utils/auth.js'

import Login      from './pages/Login.jsx'
import Register   from './pages/Register.jsx'
import Dashboard  from './pages/Dashboard.jsx'
import Products   from './pages/Products.jsx'
import Warehouses from './pages/Warehouses.jsx'
import Navbar     from './components/Navbar.jsx'

function Protected({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />
}

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={
            <Protected><Layout><Dashboard /></Layout></Protected>
          } />
          <Route path="/products" element={
            <Protected><Layout><Products /></Layout></Protected>
          } />
          <Route path="/warehouses" element={
            <Protected><Layout><Warehouses /></Layout></Protected>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}
