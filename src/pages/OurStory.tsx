import { Link } from 'react-router-dom'
import SEO from '@/components/SEO'
import Reveal from '@/components/Reveal'
import TornEdge from '@/components/TornEdge'
import productImg from '@/assets/product-1kg.jpg'
import heroImg from '@/assets/product-hero.jpg'

export default function OurStory() {
  return (
    <>
      <SEO
        title="Our Story"
        description="The story behind Venky's — Authentic Organic Spices, and our mission to bring pure, traditional Red Chilli Powder to every kitchen."
        path="/our-story"
      />

      <section className="relative bg-maroon overflow-hidden">
        <div className="absolute inset-0 bg-grain opacity-40" />
        <div className="container-page relative py-20 sm:py-28 text-center">
          <Reveal>
            <span className="eyebrow text-gold-light">Our Story</span>
            <h1 className="mt-4 text-4xl sm:text-5xl font-light text-cream max-w-2xl mx-auto leading-tight">
              Where purity meets tradition
            </h1>
          </Reveal>
        </div>
        <TornEdge />
      </section>

      <section className="container-page py-16 sm:py-24 grid lg:grid-cols-2 gap-16 items-center">
        <Reveal>
          <img src={heroImg} alt="Venky's Red Chilli Powder" className="w-full max-w-md mx-auto rounded-sm shadow-soft" />
        </Reveal>
        <Reveal delay={0.15}>
          <span className="eyebrow">How It Began</span>
          <h2 className="mt-3 text-3xl font-light mb-6">A promise, not just a product</h2>
          <div className="space-y-4 text-brown-900/70 leading-relaxed">
            <p>
              Venky's began with a simple frustration — it had become harder and harder to find
              spices that tasted the way they used to. Colours were brighter, but flavours were
              flatter. Packs were cheaper, but so was what was in them.
            </p>
            <p>
              We set out to change that, starting with the spice every Indian kitchen depends on
              most: red chilli powder. We work with carefully selected chillies, sun-dried and
              stone-ground the traditional way, with nothing added to fake the colour, the aroma,
              or the heat.
            </p>
            <p>
              No pesticides. No artificial colours. No chemicals. No preservatives. Just pure
              chilli, prepared with the same care our grandmothers used, and packed fresh for
              your kitchen.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="bg-brown-950 py-20 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-grain opacity-30" />
        <div className="container-page relative grid sm:grid-cols-3 gap-10 text-center">
          {[
            { stat: '100%', label: 'Traditional Process' },
            { stat: '0', label: 'Artificial Additives' },
            { stat: '3', label: 'Pack Sizes for Every Kitchen' },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1}>
              <p className="font-display text-5xl text-gold">{s.stat}</p>
              <p className="mt-3 text-cream/60 text-sm uppercase tracking-wide">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-page py-16 sm:py-24 grid lg:grid-cols-2 gap-16 items-center">
        <Reveal className="order-2 lg:order-1">
          <span className="eyebrow">Our Mission</span>
          <h2 className="mt-3 text-3xl font-light mb-6">
            Bringing authentic, healthy, trusted food to every kitchen
          </h2>
          <p className="text-brown-900/70 leading-relaxed mb-6">
            Red Chilli Powder is just the beginning. As we grow, we're working on more premium
            organic food products — always made the same way: honestly, traditionally, and
            without compromise.
          </p>
          <Link to="/shop" className="btn-primary w-fit">Shop Our Chilli Powder</Link>
        </Reveal>
        <Reveal delay={0.15} className="order-1 lg:order-2">
          <img src={productImg} alt="Venky's spices" className="w-full max-w-md mx-auto rounded-sm shadow-soft" />
        </Reveal>
      </section>
    </>
  )
}
