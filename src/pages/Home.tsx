import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Leaf, ShieldCheck, Sparkles, Truck } from 'lucide-react'
import SEO from '@/components/SEO'
import Reveal from '@/components/Reveal'
import TornEdge from '@/components/TornEdge'
import ProductImage from '@/components/ProductImage'
import ProductCard from '@/components/ProductCard'
import OfferBanner from '@/components/OfferBanner'
import { ProductGridSkeleton } from '@/components/Skeletons'
import { useProducts, useSiteSettings } from '@/lib/hooks'

const VALUES = [
  { icon: Leaf, title: 'No Pesticides', desc: 'Carefully selected chillies, grown and dried the traditional way.' },
  { icon: Sparkles, title: 'No Artificial Colours', desc: 'Rich, natural red — exactly the way nature intended it.' },
  { icon: ShieldCheck, title: 'No Chemicals', desc: 'Pure goodness in every pack, nothing hidden, nothing added.' },
  { icon: Truck, title: 'Fresh To Your Door', desc: 'Ground in small batches and packed for freshness on arrival.' },
]

export default function Home() {
  const { products, loading } = useProducts()
  const { settings } = useSiteSettings()
  const featured = products.filter((p) => p.is_featured)

  return (
    <>
      <SEO
        title="Venky's — Authentic Organic Spices"
        description="Premium, traditionally made Red Chilli Powder. No pesticides, no artificial colours, no chemicals — pure goodness, from our kitchen to yours."
        path="/"
      />

      {/* HERO */}
      <section className="relative overflow-hidden bg-maroon">
        <div className="absolute inset-0 bg-grain opacity-40" />
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute left-0 bottom-0 h-72 w-72 rounded-full bg-chili/10 blur-3xl" />

        <div className="container-page relative grid lg:grid-cols-2 gap-12 items-center py-16 sm:py-24 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="order-2 lg:order-1"
          >
            <span className="eyebrow text-gold-light">{settings.tagline}</span>
            <h1 className="mt-4 text-cream font-display font-light text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.1]">
              {settings.homepage_headline}
            </h1>
            <p className="mt-6 text-cream/70 text-base sm:text-lg leading-relaxed max-w-lg">
              {settings.homepage_subheadline}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link to="/shop" className="btn-gold">
                Shop Red Chilli Powder <ArrowRight size={16} />
              </Link>
              <Link to="/our-story" className="btn-ghost-cream">
                Our Story
              </Link>
            </div>

            <div className="mt-14 flex items-center gap-8">
              <div>
                <p className="font-display text-2xl text-gold">100%</p>
                <p className="text-xs text-cream/50 uppercase tracking-wide mt-1">Organic</p>
              </div>
              <div className="h-9 w-px bg-cream/15" />
              <div>
                <p className="font-display text-2xl text-gold">0</p>
                <p className="text-xs text-cream/50 uppercase tracking-wide mt-1">Preservatives</p>
              </div>
              <div className="h-9 w-px bg-cream/15" />
              <div>
                <p className="font-display text-2xl text-gold">Est.</p>
                <p className="text-xs text-cream/50 uppercase tracking-wide mt-1">Hyderabad</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-sm border border-gold/25 bg-brown-950 shadow-[0_32px_70px_rgba(0,0,0,0.34)]">
              <video
                className="block aspect-video w-full object-cover"
                src="/venkys-hero.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                aria-label="Venky's authentic organic spices"
              />
            </div>
          </motion.div>
        </div>

        <TornEdge />
      </section>

      {/* VALUES */}
      <section className="bg-cream py-16 sm:py-20">
        <div className="container-page grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.08} className="text-center lg:text-left">
              <div className="mx-auto lg:mx-0 mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-maroon/5 text-maroon">
                <v.icon size={22} strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-lg text-brown-900 mb-1.5">{v.title}</h3>
              <p className="text-sm text-brown-900/55 leading-relaxed">{v.desc}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <OfferBanner />

      {/* FEATURED PRODUCTS */}
      <section className="bg-cream py-16 sm:py-24">
        <div className="container-page">
          <Reveal className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <span className="eyebrow">The Collection</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-light">Our Red Chilli Powder</h2>
            </div>
            <Link to="/shop" className="group inline-flex items-center gap-2 text-sm uppercase tracking-wide text-maroon font-medium">
              View All
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>

          {loading ? (
            <ProductGridSkeleton count={2} />
          ) : (
            <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:max-w-2xl">
              {(featured.length ? featured : products).map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* STORY TEASER */}
      <section className="relative bg-brown-950 py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-grain opacity-30" />
        <div className="container-page relative grid lg:grid-cols-2 gap-14 items-center">
          <Reveal>
            <div className="relative max-w-md">
              <div className="absolute -inset-4 border border-gold/20 rounded-sm" />
              <ProductImage
                src={null}
                alt="Venky's spices, made with tradition"
                className="relative aspect-[4/3] w-full rounded-sm shadow-soft"
                loading="eager"
              />
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <span className="eyebrow text-gold">From Our Kitchen</span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-light text-cream leading-tight">
              Rooted in tradition, made for the modern kitchen
            </h2>
            <p className="mt-6 text-cream/60 leading-relaxed max-w-lg">
              Every pack of Venky's Red Chilli Powder begins with chillies chosen by hand,
              dried under the open sun, and stone-ground the way it's always been done —
              no shortcuts, no additives, just the real thing.
            </p>
            <Link to="/our-story" className="btn-gold mt-8 w-fit">
              Read Our Story <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
