import { Link } from 'react-router-dom'
import { Clock, Flame } from 'lucide-react'
import SEO from '@/components/SEO'
import Reveal from '@/components/Reveal'
import TornEdge from '@/components/TornEdge'

const RECIPES = [
  {
    title: 'Classic Chicken Curry',
    time: '45 min',
    heat: 2,
    desc: 'A home-style curry built on slow-cooked onions, tomatoes and a generous spoon of Venky\u2019s Red Chilli Powder for colour and depth.',
  },
  {
    title: 'Andhra-Style Gunpowder (Karam Podi)',
    time: '20 min',
    heat: 3,
    desc: 'A fiery lentil and chilli powder blend, roasted and ground coarse — perfect mixed with ghee over hot rice or idli.',
  },
  {
    title: 'Chilli Garlic Pickle',
    time: '30 min + resting',
    heat: 3,
    desc: 'A punchy, tangy pickle made with mustard oil, garlic and a generous helping of chilli powder — a jar that lasts for weeks.',
  },
  {
    title: 'Tandoori-Style Marinade',
    time: '15 min + marinating',
    heat: 2,
    desc: 'Yogurt, ginger-garlic paste and Venky\u2019s Red Chilli Powder come together for a smoky, restaurant-style marinade at home.',
  },
  {
    title: 'Peanut Chutney Podi',
    time: '15 min',
    heat: 1,
    desc: 'Roasted peanuts, curry leaves and a touch of chilli powder blitzed into a dry chutney that keeps for weeks.',
  },
  {
    title: 'Spiced Roasted Potatoes',
    time: '35 min',
    heat: 2,
    desc: 'Crispy potatoes tossed with chilli powder, turmeric and mustard seeds — a simple weeknight side that never disappoints.',
  },
]

export default function Recipes() {
  return (
    <>
      <SEO
        title="Recipes"
        description="Recipe ideas using Venky's Red Chilli Powder — from classic curries to homemade gunpowder and pickles."
        path="/recipes"
      />

      <section className="relative bg-maroon overflow-hidden">
        <div className="absolute inset-0 bg-grain opacity-40" />
        <div className="container-page relative py-20 sm:py-28 text-center">
          <Reveal>
            <span className="eyebrow text-gold-light">From Our Kitchen To Yours</span>
            <h1 className="mt-4 text-4xl sm:text-5xl font-light text-cream max-w-2xl mx-auto leading-tight">
              Recipes worth the real thing
            </h1>
            <p className="mt-5 text-cream/60 max-w-lg mx-auto">
              A few of our favourite ways to put Venky's Red Chilli Powder to work.
            </p>
          </Reveal>
        </div>
        <TornEdge />
      </section>

      <section className="container-page py-16 sm:py-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {RECIPES.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.07}>
              <div className="card p-7 h-full flex flex-col">
                <h3 className="font-display text-xl mb-3">{r.title}</h3>
                <p className="text-sm text-brown-900/60 leading-relaxed flex-1">{r.desc}</p>
                <div className="mt-6 flex items-center justify-between text-xs text-brown-900/50">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={14} /> {r.time}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <Flame
                        key={idx}
                        size={14}
                        className={idx < r.heat ? 'text-chili' : 'text-brown-900/15'}
                        fill={idx < r.heat ? 'currentColor' : 'none'}
                      />
                    ))}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2} className="text-center mt-16">
          <p className="text-brown-900/60 mb-6">Every recipe starts with a spice you can trust.</p>
          <Link to="/shop" className="btn-primary w-fit mx-auto">Shop Red Chilli Powder</Link>
        </Reveal>
      </section>
    </>
  )
}
