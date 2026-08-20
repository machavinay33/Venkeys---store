import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useActiveOffer } from '@/lib/hooks'

export default function OfferBanner() {
  const { offer, loading } = useActiveOffer()

  if (loading || !offer) return null

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative w-full overflow-hidden"
    >
      <Link to={offer.cta_url || '/shop'} className="block group">
        <picture>
          {offer.mobile_image && (
            <source media="(max-width: 640px)" srcSet={offer.mobile_image} />
          )}
          <img
            src={offer.desktop_image || offer.mobile_image}
            alt={offer.title}
            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-brown-950/70 via-brown-950/10 to-transparent flex flex-col justify-end p-6 sm:p-10">
          <p className="eyebrow text-gold mb-2">{offer.title}</p>
          {offer.description && (
            <p className="text-cream max-w-md text-sm sm:text-base mb-4">{offer.description}</p>
          )}
          <span className="btn-gold w-fit">{offer.cta_label || 'Shop Now'}</span>
        </div>
      </Link>
    </motion.section>
  )
}
