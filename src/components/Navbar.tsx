import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, ShoppingBag, Menu, X } from 'lucide-react'
import { useCart } from '@/lib/cart'
import logo from '@/assets/logo.jpg'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop Spices' },
  { to: '/our-story', label: 'Our Story' },
  { to: '/why-venkys', label: 'Why Venky\u2019s' },
  { to: '/recipes', label: 'Recipes' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const { itemCount } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchValue.trim())}`)
      setSearchOpen(false)
      setSearchValue('')
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? 'bg-cream/95 backdrop-blur-md shadow-[0_2px_20px_rgba(38,8,11,0.08)]'
          : 'bg-cream/80 backdrop-blur-sm'
      }`}
    >
      <div className="container-page flex items-center justify-between transition-all duration-500" style={{ height: scrolled ? 64 : 84 }}>
        <Link to="/" className="flex items-center gap-3 shrink-0" aria-label="Venky's home">
          <img
            src={logo}
            alt="Venky's — Authentic Organic Spices"
            className={`w-auto object-contain transition-all duration-500 rounded-sm ${scrolled ? 'h-9' : 'h-12'}`}
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-9">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `relative text-[13px] tracking-wide uppercase font-medium transition-colors duration-300 py-2 ${
                  isActive ? 'text-maroon' : 'text-brown-900/80 hover:text-maroon'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  <span
                    className={`absolute left-0 -bottom-0.5 h-[1.5px] bg-gold transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0'
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            aria-label="Search"
            onClick={() => setSearchOpen((s) => !s)}
            className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full text-brown-900/80 hover:text-maroon hover:bg-maroon/5 transition-colors"
          >
            <Search size={19} strokeWidth={1.75} />
          </button>
          <Link
            to="/cart"
            aria-label="Cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-brown-900/80 hover:text-maroon hover:bg-maroon/5 transition-colors"
          >
            <ShoppingBag size={19} strokeWidth={1.75} />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-maroon px-1 text-[10px] font-semibold text-cream">
                {itemCount}
              </span>
            )}
          </Link>
          <button
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-brown-900/80 hover:text-maroon lg:hidden"
          >
            <Menu size={22} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="hidden sm:block overflow-hidden border-t border-brown-900/10 bg-cream"
          >
            <form onSubmit={submitSearch} className="container-page py-4 flex items-center gap-3">
              <Search size={18} className="text-brown-900/50" />
              <input
                autoFocus
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search for spices..."
                className="flex-1 bg-transparent outline-none text-lg font-display placeholder:text-brown-900/30"
              />
              <button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search">
                <X size={18} className="text-brown-900/50" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-brown-950/50 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed right-0 top-0 z-[70] h-full w-[86%] max-w-sm bg-cream shadow-soft lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-brown-900/10">
                <img src={logo} alt="Venky's" className="h-9" />
                <button
                  aria-label="Close menu"
                  onClick={() => setMobileOpen(false)}
                  className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-maroon/5"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={submitSearch} className="px-6 py-4 border-b border-brown-900/10 flex items-center gap-3">
                <Search size={18} className="text-brown-900/50" />
                <input
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search for spices..."
                  className="flex-1 bg-transparent outline-none placeholder:text-brown-900/30"
                />
              </form>

              <nav className="flex flex-col px-2 py-4">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.35 }}
                  >
                    <NavLink
                      to={link.to}
                      end={link.to === '/'}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `block px-4 py-3.5 text-base font-display border-b border-brown-900/5 ${
                          isActive ? 'text-maroon' : 'text-brown-900'
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-auto px-6 py-6 border-t border-brown-900/10">
                <Link
                  to="/cart"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary w-full"
                >
                  View Bag {itemCount > 0 && `(${itemCount})`}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
