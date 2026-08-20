import { Link, Navigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Copy } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import SEO from '@/components/SEO'
import { formatINR } from '@/lib/format'

interface LocationState {
  orderNumber: string
  total: number
}

export default function OrderSuccess() {
  const location = useLocation()
  const state = location.state as LocationState | undefined
  const [copied, setCopied] = useState(false)

  if (!state?.orderNumber) {
    return <Navigate to="/" replace />
  }

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(state.orderNumber)
    setCopied(true)
    toast.success('Order number copied')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <SEO title="Order Confirmed" description="Your Venky's order has been placed." path="/order-success" />
      <section className="container-page py-20 sm:py-28 flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="h-20 w-20 rounded-full bg-maroon flex items-center justify-center mb-8"
        >
          <Check size={36} className="text-cream" strokeWidth={2} />
        </motion.div>

        <span className="eyebrow">Order Confirmed</span>
        <h1 className="mt-3 text-3xl sm:text-4xl font-light">Thank you for your order</h1>
        <p className="mt-4 text-brown-900/60 max-w-md">
          We've received your order request and will reach out shortly to confirm delivery details.
        </p>

        <div className="mt-10 flex items-center gap-3 rounded-sm border border-brown-900/15 bg-white/60 px-6 py-4">
          <div className="text-left">
            <p className="text-[11px] uppercase tracking-widest2 text-brown-900/40">Order Number</p>
            <p className="font-display text-xl text-maroon">{state.orderNumber}</p>
          </div>
          <button
            onClick={copyOrderNumber}
            aria-label="Copy order number"
            className="ml-4 h-9 w-9 flex items-center justify-center rounded-full hover:bg-maroon/5 text-brown-900/50"
          >
            {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
          </button>
        </div>

        <p className="mt-6 text-brown-900/70">
          Order Total: <span className="font-display text-maroon">{formatINR(state.total)}</span>
        </p>
        <p className="mt-1 text-xs text-brown-900/40">Cash on delivery</p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link to="/shop" className="btn-primary">Continue Shopping</Link>
          <Link to="/" className="btn-outline">Back to Home</Link>
        </div>
      </section>
    </>
  )
}
