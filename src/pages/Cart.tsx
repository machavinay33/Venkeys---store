import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react'
import SEO from '@/components/SEO'
import { EmptyState } from '@/components/Skeletons'
import { useCart } from '@/lib/cart'
import { formatINR } from '@/lib/format'
import ProductImage from '@/components/ProductImage'

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal } = useCart()

  if (items.length === 0) {
    return (
      <>
        <SEO title="Your Bag" description="Your Venky's shopping bag." path="/cart" />
        <EmptyState
          title="Your bag is empty"
          description="Looks like you haven't added any spices yet."
          action={<Link to="/shop" className="btn-primary">Shop Spices</Link>}
        />
      </>
    )
  }

  return (
    <>
      <SEO title="Your Bag" description="Your Venky's shopping bag." path="/cart" />
      <section className="container-page py-10 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-light mb-10">Your Bag</h1>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 divide-y divide-brown-900/10">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div
                  key={item.productId}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex gap-5 py-6"
                >
                  <Link to={`/product/${item.slug}`} className="shrink-0">
                    <ProductImage
                      src={item.image}
                      alt={item.name}
                      className="h-24 w-24 sm:h-28 sm:w-28 rounded-sm object-cover bg-cream-200"
                    />
                  </Link>
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <Link to={`/product/${item.slug}`}>
                        <h3 className="font-display text-lg text-brown-900">{item.name}</h3>
                      </Link>
                      <p className="text-sm text-brown-900/50 mt-1">{formatINR(item.price)} each</p>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="mt-2 inline-flex items-center gap-1.5 text-xs text-brown-900/40 hover:text-chili transition-colors"
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    </div>
                    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3">
                      <div className="flex items-center border border-brown-900/20 rounded-sm">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="h-9 w-9 flex items-center justify-center hover:bg-maroon/5"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="h-9 w-9 flex items-center justify-center hover:bg-maroon/5"
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <p className="font-display text-maroon">{formatINR(item.price * item.quantity)}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-1">
            <div className="card p-6 sm:p-8 sticky top-24">
              <h2 className="font-display text-xl mb-6">Order Summary</h2>
              <div className="flex justify-between text-sm text-brown-900/70 mb-3">
                <span>Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-brown-900/70 mb-5">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="border-t border-brown-900/10 pt-5 flex justify-between items-baseline mb-8">
                <span className="font-display text-lg">Total</span>
                <span className="font-display text-2xl text-maroon">{formatINR(subtotal)}</span>
              </div>
              <Link to="/checkout" className="btn-primary w-full">
                Proceed to Checkout <ArrowRight size={16} />
              </Link>
              <p className="text-xs text-brown-900/40 text-center mt-4">
                Cash on delivery. No online payment required.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
