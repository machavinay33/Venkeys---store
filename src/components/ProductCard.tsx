import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import type { Product } from '@/lib/types'
import { formatINR } from '@/lib/format'
import { useCart } from '@/lib/cart'

const BADGE_LABEL: Record<string, string> = {
  bestseller: 'Bestseller',
  new: 'New',
  limited: 'Limited',
}

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addItem } = useCart()

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      productId: product.id,
      slug: product.slug,
      name: `${product.name} — ${product.weight_label}`,
      weightLabel: product.weight_label,
      price: product.price,
      image: product.cover_image,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-cream-200">
          {product.badge !== 'none' && (
            <span className="absolute left-4 top-4 z-10 rounded-full bg-maroon px-3 py-1 text-[10px] font-semibold uppercase tracking-widest2 text-cream">
              {BADGE_LABEL[product.badge]}
            </span>
          )}
          {product.stock_status === 'out_of_stock' && (
            <span className="absolute right-4 top-4 z-10 rounded-full bg-brown-950/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest2 text-cream">
              Sold Out
            </span>
          )}
          <img
            src={product.cover_image}
            alt={`${product.name} ${product.weight_label}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <button
            onClick={handleQuickAdd}
            disabled={product.stock_status === 'out_of_stock'}
            aria-label={`Add ${product.name} to bag`}
            className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-cream text-maroon shadow-card opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-maroon hover:text-cream disabled:hidden"
          >
            <Plus size={18} strokeWidth={2} />
          </button>
        </div>

        <div className="mt-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-lg text-brown-900">{product.name}</h3>
            <p className="text-sm text-brown-900/50 mt-0.5">{product.weight_label}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-display text-lg text-maroon">{formatINR(product.price)}</p>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <p className="text-xs text-brown-900/40 line-through">
                {formatINR(product.compare_at_price)}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
