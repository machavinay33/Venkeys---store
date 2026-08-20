import { Link } from 'react-router-dom'
import { Check, X } from 'lucide-react'
import SEO from '@/components/SEO'
import Reveal from '@/components/Reveal'
import TornEdge from '@/components/TornEdge'

const COMPARISON = [
  { feature: 'Pesticide-free chillies', venkys: true, ordinary: false },
  { feature: 'No artificial colours', venkys: true, ordinary: false },
  { feature: 'No chemical additives', venkys: true, ordinary: false },
  { feature: 'No preservatives', venkys: true, ordinary: false },
  { feature: 'Stone-ground, traditional process', venkys: true, ordinary: false },
  { feature: 'Rich natural colour & aroma', venkys: true, ordinary: true },
]

const REASONS = [
  {
    title: 'Purity You Can Trust',
    desc: 'Every pack is made without pesticides, artificial colours, chemicals or preservatives — checked at every step.',
  },
  {
    title: 'Traditional Process',
    desc: 'Sun-dried and stone-ground the way spices have always been made, preserving natural oils and aroma.',
  },
  {
    title: 'Rich Colour, Real Aroma',
    desc: 'No shortcuts for colour or shine — what you see and smell is exactly what nature put there.',
  },
  {
    title: 'Made For Every Kitchen',
    desc: 'Available in 500g, 1kg and bulk quantities for homes, restaurants, retailers and wholesalers.',
  },
]

export default function WhyVenkys() {
  return (
    <>
      <SEO
        title="Why Venky's"
        description="Why choose Venky's Authentic Organic Spices — purity, tradition and trust in every pack."
        path="/why-venkys"
      />

      <section className="relative bg-maroon overflow-hidden">
        <div className="absolute inset-0 bg-grain opacity-40" />
        <div className="container-page relative py-20 sm:py-28 text-center">
          <Reveal>
            <span className="eyebrow text-gold-light">Why Venky's</span>
            <h1 className="mt-4 text-4xl sm:text-5xl font-light text-cream max-w-2xl mx-auto leading-tight">
              Purity meets tradition, in every pack
            </h1>
          </Reveal>
        </div>
        <TornEdge />
      </section>

      <section className="container-page py-16 sm:py-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {REASONS.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.08} className="gold-rule">
              <h3 className="font-display text-xl mb-2">{r.title}</h3>
              <p className="text-sm text-brown-900/60 leading-relaxed">{r.desc}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-cream-200/60 py-16 sm:py-24">
        <div className="container-page">
          <Reveal className="text-center mb-12">
            <span className="eyebrow">The Difference</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-light">Venky's vs. Ordinary Chilli Powder</h2>
          </Reveal>

          <Reveal delay={0.1} className="max-w-2xl mx-auto overflow-hidden rounded-sm border border-brown-900/10 bg-white/60">
            <div className="grid grid-cols-3 bg-maroon text-cream text-sm font-medium">
              <div className="px-5 py-4">Feature</div>
              <div className="px-5 py-4 text-center">Venky's</div>
              <div className="px-5 py-4 text-center">Ordinary</div>
            </div>
            {COMPARISON.map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-3 text-sm ${i % 2 === 0 ? 'bg-white/40' : ''}`}
              >
                <div className="px-5 py-4 text-brown-900/80">{row.feature}</div>
                <div className="px-5 py-4 flex justify-center">
                  {row.venkys ? (
                    <Check size={18} className="text-green-600" />
                  ) : (
                    <X size={18} className="text-brown-900/25" />
                  )}
                </div>
                <div className="px-5 py-4 flex justify-center">
                  {row.ordinary ? (
                    <Check size={18} className="text-green-600" />
                  ) : (
                    <X size={18} className="text-brown-900/25" />
                  )}
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="container-page py-16 sm:py-20 text-center">
        <Reveal>
          <h2 className="text-2xl sm:text-3xl font-light mb-6">Taste the difference yourself</h2>
          <Link to="/shop" className="btn-primary w-fit mx-auto">Shop Red Chilli Powder</Link>
        </Reveal>
      </section>
    </>
  )
}
