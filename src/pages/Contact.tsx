import { useState } from 'react'
import { Instagram, Mail, MapPin, Phone } from 'lucide-react'
import toast from 'react-hot-toast'
import SEO from '@/components/SEO'
import Reveal from '@/components/Reveal'
import TornEdge from '@/components/TornEdge'
import { useSiteSettings } from '@/lib/hooks'

export default function Contact() {
  const { settings } = useSiteSettings()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sending, setSending] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.message.trim()) {
      toast.error('Please fill in your name and message')
      return
    }
    setSending(true)
    // No backend endpoint specified for contact messages — routes the
    // customer to email directly with their message pre-filled.
    const subject = encodeURIComponent(`Message from ${form.name} via venkysfoods.in`)
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`)
    window.location.href = `mailto:${settings.email}?subject=${subject}&body=${body}`
    setSending(false)
  }

  return (
    <>
      <SEO
        title="Contact Us"
        description="Get in touch with Venky's Authentic Organic Spices — for orders, bulk enquiries and more."
        path="/contact"
      />

      <section className="relative bg-maroon overflow-hidden">
        <div className="absolute inset-0 bg-grain opacity-40" />
        <div className="container-page relative py-20 sm:py-28 text-center">
          <Reveal>
            <span className="eyebrow text-gold-light">Get In Touch</span>
            <h1 className="mt-4 text-4xl sm:text-5xl font-light text-cream">Contact Us</h1>
          </Reveal>
        </div>
        <TornEdge />
      </section>

      <section className="container-page py-16 sm:py-24 grid lg:grid-cols-2 gap-16">
        <Reveal>
          <h2 className="text-2xl font-light mb-8">Reach Us Directly</h2>
          <div className="space-y-6">
            <a href={`tel:${settings.phone}`} className="flex items-center gap-4 group">
              <div className="h-12 w-12 rounded-full bg-maroon/5 flex items-center justify-center text-maroon shrink-0">
                <Phone size={19} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-brown-900/40">Phone / WhatsApp</p>
                <p className="text-brown-900 group-hover:text-maroon transition-colors">{settings.phone}</p>
              </div>
            </a>
            <a href={`mailto:${settings.email}`} className="flex items-center gap-4 group">
              <div className="h-12 w-12 rounded-full bg-maroon/5 flex items-center justify-center text-maroon shrink-0">
                <Mail size={19} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-brown-900/40">Email</p>
                <p className="text-brown-900 group-hover:text-maroon transition-colors break-all">{settings.email}</p>
              </div>
            </a>
            <a href={settings.instagram_url} target="_blank" rel="noreferrer" className="flex items-center gap-4 group">
              <div className="h-12 w-12 rounded-full bg-maroon/5 flex items-center justify-center text-maroon shrink-0">
                <Instagram size={19} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-brown-900/40">Instagram</p>
                <p className="text-brown-900 group-hover:text-maroon transition-colors">@venkys__kitchen</p>
              </div>
            </a>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-maroon/5 flex items-center justify-center text-maroon shrink-0">
                <MapPin size={19} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-brown-900/40">Address</p>
                <p className="text-brown-900">{settings.address}</p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <h2 className="text-2xl font-light mb-8">Send a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full border border-brown-900/15 rounded-sm px-4 py-3 text-sm bg-white/60 outline-none focus:border-maroon transition-colors"
            />
            <input
              placeholder="Your Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full border border-brown-900/15 rounded-sm px-4 py-3 text-sm bg-white/60 outline-none focus:border-maroon transition-colors"
            />
            <textarea
              placeholder="Your Message"
              rows={5}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              className="w-full border border-brown-900/15 rounded-sm px-4 py-3 text-sm bg-white/60 outline-none focus:border-maroon transition-colors"
            />
            <button type="submit" disabled={sending} className="btn-primary w-full sm:w-auto">
              Send Message
            </button>
          </form>
        </Reveal>
      </section>
    </>
  )
}
