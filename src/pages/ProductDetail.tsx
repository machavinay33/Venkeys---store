import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Minus, Plus, ShieldCheck, Leaf, Sparkles } from 'lucide-react'
import SEO from '@/components/SEO'
import Reveal from '@/components/Reveal'
import ProductCard from '@/components/ProductCard'
import { EmptyState } from '@/components/Skeletons'
import { useProduct, useProducts } from '@/lib/hooks'
import { formatINR } from '@/lib/format'
import { useCart } from '@/lib/cart'
import ProductImage from '@/components/ProductImage'

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { product, loading } = useProduct(slug)
  const { products } = useProducts()
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)
  const [activeImage, setActiveImage] = useState(0)

  if (loading) {
    return (
      <div className="container-page py-20 grid lg:grid-cols-2 gap-14">
        <div className="skeleton aspect-square w-full" />
        <div className="space-y-4">
          <div className="skeleton h-4 w-24" />
          <div className="skeleton h-10 w-2/3" />
          <div className="skeleton h-6 w-32" />
          <div className="skeleton h-24 w-full" />
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <EmptyState
        title="Product not found"
        description="This spice may have been removed or renamed."
        action={<Link to="/shop" className="btn-primary">Back to Shop</Link>}
      />
    )
  }

  const images = [
    product.cover_image,
    ...product.gallery_images.filter((image) => image && image !== product.cover_image),
  ]
  const related = products.filter((p) => p.id !== product.id).slice(0, 4)

  const handleAdd = () => {
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: `${product.name} — ${product.weight_label}`,
        weightLabel: product.weight_label,
        price: product.price,
        image: product.cover_image,
      },
      qty
    )
  }

  return (
    <>
      <SEO
        title={`${product.name} — ${product.weight_label}`}
        description={product.short_description}
        path={`/product/${product.slug}`}
        image={product.cover_image}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: `${product.name} — ${product.weight_label}`,
          description: product.description,
          image: product.cover_image,
          brand: { '@type': 'Brand', name: "Venky's" },
          offers: {
            '@type': 'Offer',
            priceCurrency: 'INR',
            price: product.price,
            availability:
              product.stock_status === 'out_of_stock'
                ? 'https://schema.org/OutOfStock'
                : 'https://schema.org/InStock',
          },
        }}
      />

      <section className="container-page py-10 sm:py-16">
        <nav className="text-xs uppercase tracking-wide text-brown-900/40 mb-8 flex items-center gap-2">
          <Link to="/" className="hover:text-maroon">Home</Link> /
          <Link to="/shop" className="hover:text-maroon">Shop</Link> /
          <span className="text-brown-900/70">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="aspect-square rounded-sm overflow-hidden bg-cream-200">
              <ProductImage
                src={images[activeImage]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="mt-4 flex gap-3">
                {images.map((img, i) => (
                  <button
                    key={img + i}
                    onClick={() => setActiveImage(i)}
                    className={`h-20 w-20 rounded-sm overflow-hidden border-2 transition-colors ${
                      activeImage === i ? 'border-maroon' : 'border-transparent'
                    }`}
                  >
                    <ProductImage src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <div>
            {product.badge !== 'none' && (
              <span className="inline-block rounded-full bg-maroon/10 text-maroon px-3 py-1 text-[11px] font-semibold uppercase tracking-widest2 mb-4">
                {product.badge}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl font-light text-brown-900">{product.name}</h1>
            <p className="mt-1 text-brown-900/50">{product.weight_label} pack</p>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-2xl font-display text-maroon">{formatINR(product.price)}</span>
              {product.compare_at_price && product.compare_at_price > product.price && (
                <span className="text-brown-900/40 line-through">{formatINR(product.compare_at_price)}</span>
              )}
            </div>

            <p className="mt-6 text-brown-900/70 leading-relaxed">{product.description}</p>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                { icon: Leaf, label: 'No Pesticides' },
                { icon: Sparkles, label: 'No Colours' },
                { icon: ShieldCheck, label: 'No Chemicals' },
              ].map((f) => (
                <div key={f.label} className="flex flex-col items-center text-center gap-2 rounded-sm border border-brown-900/10 py-4 px-2">
                  <f.icon size={20} className="text-maroon" strokeWidth={1.5} />
                  <span className="text-[11px] text-brown-900/60 leading-tight">{f.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-9 flex items-center gap-4">
              <div className="flex items-center border border-brown-900/20 rounded-sm">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="h-12 w-11 flex items-center justify-center hover:bg-maroon/5"
                  aria-label="Decrease quantity"
                >
                  <Minus size={15} />
                </button>
                <span className="w-10 text-center font-medium">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="h-12 w-11 flex items-center justify-center hover:bg-maroon/5"
                  aria-label="Increase quantity"
                >
                  <Plus size={15} />
                </button>
              </div>
              <button
                onClick={handleAdd}
                disabled={product.stock_status === 'out_of_stock'}
                className="btn-primary flex-1"
              >
                {product.stock_status === 'out_of_stock' ? 'Out of Stock' : 'Add to Bag'}
              </button>
            </div>

            {product.stock_status === 'low_stock' && (
              <p className="mt-3 text-xs text-chili">Only a few packs left in stock.</p>
            )}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-cream-200/50 py-16 sm:py-20">
          <div className="container-page">
            <Reveal>
              <span className="eyebrow">You May Also Like</span>
              <h2 className="mt-3 text-2xl sm:text-3xl font-light mb-10">More From Venky's</h2>
            </Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
