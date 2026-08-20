import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import type { Product } from '@/lib/types'
import { formatINR } from '@/lib/format'
import { useCart } from '@/lib/cart'
import ProductImage from '@/components/ProductImage'

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
          <ProductImage
            src={product.cover_image}
            alt={`${product.name} ${product.weight_label}`}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
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

      <button
        onClick={handleQuickAdd}
        disabled={product.stock_status === 'out_of_stock'}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-sm border border-maroon px-4 py-3 text-xs font-semibold uppercase tracking-widest text-maroon transition-colors hover:bg-maroon hover:text-cream disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus size={16} strokeWidth={2} />
        {product.stock_status === 'out_of_stock' ? 'Out of Stock' : 'Add to Bag'}
      </button>
    </motion.div>
  )
}
