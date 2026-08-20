import { Link } from 'react-router-dom'
import { Instagram, Mail, MapPin, Phone } from 'lucide-react'
import { useSiteSettings } from '@/lib/hooks'

export default function Footer() {
  const { settings } = useSiteSettings()

  return (
    <footer className="bg-brown-950 text-cream/80">
      <div className="container-page py-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-5 flex flex-col leading-none">
            <span className="font-display text-4xl italic font-semibold tracking-[-0.04em] text-cream">Venky&apos;s</span>
            <span className="mt-1 text-[8px] uppercase tracking-[0.2em] text-gold/80">Authentic Organic Spices</span>
          </div>
          <p className="text-sm leading-relaxed text-cream/60 max-w-xs">
            {settings.footer_note}
          </p>
          <a
            href={settings.instagram_url}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 hover:border-gold hover:text-gold transition-colors"
            aria-label="Instagram"
          >
            <Instagram size={17} strokeWidth={1.75} />
          </a>
        </div>

        <div>
          <h4 className="eyebrow text-gold mb-5">Explore</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/shop" className="hover:text-gold transition-colors">Shop Spices</Link></li>
            <li><Link to="/our-story" className="hover:text-gold transition-colors">Our Story</Link></li>
            <li><Link to="/why-venkys" className="hover:text-gold transition-colors">Why Venky's</Link></li>
            <li><Link to="/recipes" className="hover:text-gold transition-colors">Recipes</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow text-gold mb-5">Support</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/contact" className="hover:text-gold transition-colors">Contact Us</Link></li>
            <li><Link to="/cart" className="hover:text-gold transition-colors">Your Bag</Link></li>
            <li><a href={`https://wa.me/${settings.whatsapp.replace(/[^\d]/g, '')}`} target="_blank" rel="noreferrer" className="hover:text-gold transition-colors">WhatsApp Us</a></li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow text-gold mb-5">Reach Us</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-gold" strokeWidth={1.75} />
              <span>{settings.address}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={16} className="shrink-0 text-gold" strokeWidth={1.75} />
              <a href={`tel:${settings.phone}`} className="hover:text-gold transition-colors">{settings.phone}</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={16} className="shrink-0 text-gold" strokeWidth={1.75} />
              <a href={`mailto:${settings.email}`} className="hover:text-gold transition-colors break-all">{settings.email}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container-page py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cream/40">
          <p>&copy; {new Date().getFullYear()} {settings.brand_name}. All rights reserved.</p>
          <p className="tracking-widest2 uppercase">{settings.tagline}</p>
        </div>
      </div>
    </footer>
  )
}
