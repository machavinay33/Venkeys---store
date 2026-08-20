import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutGrid, Package, Tag, Settings, LogOut, Menu, X, ExternalLink } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import logo from '@/assets/logo.jpg'

const LINKS = [
  { to: '/admin', label: 'Orders', icon: LayoutGrid, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/offers', label: 'Offers', icon: Tag },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login')
  }

  const SidebarContent = (
    <>
      <div className="flex items-center gap-3 px-6 py-6">
        <img src={logo} alt="Venky's" className="h-9 rounded-sm" />
        <span className="text-cream/50 text-xs uppercase tracking-wide">Admin</span>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-sm text-sm transition-colors ${
                isActive ? 'bg-gold/15 text-gold' : 'text-cream/70 hover:bg-cream/5 hover:text-cream'
              }`
            }
          >
            <link.icon size={17} strokeWidth={1.75} />
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-3 py-4 space-y-1 border-t border-cream/10">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 px-4 py-3 rounded-sm text-sm text-cream/70 hover:bg-cream/5 hover:text-cream transition-colors"
        >
          <ExternalLink size={17} strokeWidth={1.75} />
          View Store
        </a>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm text-cream/70 hover:bg-chili/10 hover:text-chili transition-colors"
        >
          <LogOut size={17} strokeWidth={1.75} />
          Sign Out
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-cream-200/40 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col bg-brown-950 fixed inset-y-0 left-0">
        {SidebarContent}
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-brown-950 flex flex-col">
            {SidebarContent}
          </aside>
        </div>
      )}

      <div className="flex-1 lg:ml-64">
        <header className="lg:hidden sticky top-0 z-30 bg-brown-950 flex items-center justify-between px-4 py-3">
          <img src={logo} alt="Venky's" className="h-8 rounded-sm" />
          <button onClick={() => setMobileOpen(true)} className="text-cream p-2" aria-label="Open menu">
            <Menu size={22} />
          </button>
        </header>
        <main className="p-5 sm:p-8 lg:p-10">
          <Outlet />
        </main>
      </div>

      {mobileOpen && (
        <button
          onClick={() => setMobileOpen(false)}
          className="fixed top-4 right-4 z-[60] lg:hidden text-cream bg-brown-950 rounded-full p-2"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      )}
    </div>
  )
}
