import { NavLink } from 'react-router-dom'
import { logout } from '../services/authService.js'

const links = [
  { to: '/',           label: 'Dashboard' },
  { to: '/products',   label: 'Products'  },
  { to: '/warehouses', label: 'Warehouses'},
]

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-7 h-7 rounded-lg bg-sky-500 flex items-center justify-center text-white text-xs font-bold">
            MI
          </span>
          <span className="font-semibold text-sm hidden sm:block">Mini Inventory</span>
        </div>

        <nav className="flex items-center gap-1">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ` +
                (isActive ? 'bg-slate-800 text-sky-400 border border-slate-700'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60')
              }
            >{l.label}</NavLink>
          ))}
        </nav>

        <button onClick={logout}
          className="text-sm text-slate-400 hover:text-red-400 transition-colors shrink-0">
          Logout
        </button>
      </div>
    </header>
  )
}
