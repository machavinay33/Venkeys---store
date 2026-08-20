import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import SEO from '@/components/SEO'
import { EmptyState } from '@/components/Skeletons'
import { useCart } from '@/lib/cart'
import { formatINR } from '@/lib/format'
import { createOrder, type CheckoutDetails } from '@/lib/orders'
import ProductImage from '@/components/ProductImage'

const initialForm: CheckoutDetails = {
  fullName: '',
  mobile: '',
  email: '',
  house: '',
  street: '',
  landmark: '',
  city: '',
  state: '',
  pincode: '',
  notes: '',
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Delhi',
]

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState<CheckoutDetails>(initialForm)
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutDetails, string>>>({})
  const [submitting, setSubmitting] = useState(false)

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your bag is empty"
        description="Add some spices to your bag before checking out."
        action={<Link to="/shop" className="btn-primary">Shop Spices</Link>}
      />
    )
  }

  const update = (field: keyof CheckoutDetails) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setErrors((er) => ({ ...er, [field]: undefined }))
  }

  const validate = (): boolean => {
    const next: Partial<Record<keyof CheckoutDetails, string>> = {}
    if (!form.fullName.trim()) next.fullName = 'Required'
    if (!/^[0-9+\s-]{10,15}$/.test(form.mobile.trim())) next.mobile = 'Enter a valid mobile number'
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email'
    if (!form.house.trim()) next.house = 'Required'
    if (!form.street.trim()) next.street = 'Required'
    if (!form.city.trim()) next.city = 'Required'
    if (!form.state.trim()) next.state = 'Required'
    if (!/^[0-9]{6}$/.test(form.pincode.trim())) next.pincode = 'Enter a valid 6-digit pincode'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) {
      toast.error('Please fix the errors in the form')
      return
    }
    setSubmitting(true)
    try {
      const result = await createOrder(form, items)
      clearCart()
      navigate('/order-success', { state: { orderNumber: result.orderNumber, total: result.total } })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not place order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = (field: keyof CheckoutDetails) =>
    `w-full border rounded-sm px-4 py-3 text-sm bg-white/60 outline-none transition-colors ${
      errors[field] ? 'border-chili' : 'border-brown-900/15 focus:border-maroon'
    }`

  return (
    <>
      <SEO title="Checkout" description="Complete your Venky's order." path="/checkout" />
      <section className="container-page py-10 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-light mb-10">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-12">
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="eyebrow mb-5">Contact Details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <input
                    placeholder="Full Name *"
                    value={form.fullName}
                    onChange={update('fullName')}
                    className={inputClass('fullName')}
                  />
                  {errors.fullName && <p className="text-xs text-chili mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <input
                    placeholder="Mobile Number *"
                    value={form.mobile}
                    onChange={update('mobile')}
                    className={inputClass('mobile')}
                  />
                  {errors.mobile && <p className="text-xs text-chili mt-1">{errors.mobile}</p>}
                </div>
                <div className="sm:col-span-2">
                  <input
                    placeholder="Email (optional)"
                    value={form.email}
                    onChange={update('email')}
                    className={inputClass('email')}
                  />
                  {errors.email && <p className="text-xs text-chili mt-1">{errors.email}</p>}
                </div>
              </div>
            </div>

            <div>
              <h2 className="eyebrow mb-5">Delivery Address</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <input
                    placeholder="House / Flat No. *"
                    value={form.house}
                    onChange={update('house')}
                    className={inputClass('house')}
                  />
                  {errors.house && <p className="text-xs text-chili mt-1">{errors.house}</p>}
                </div>
                <div>
                  <input
                    placeholder="Street / Area *"
                    value={form.street}
                    onChange={update('street')}
                    className={inputClass('street')}
                  />
                  {errors.street && <p className="text-xs text-chili mt-1">{errors.street}</p>}
                </div>
                <div className="sm:col-span-2">
                  <input
                    placeholder="Landmark (optional)"
                    value={form.landmark}
                    onChange={update('landmark')}
                    className={inputClass('landmark')}
                  />
                </div>
                <div>
                  <input
                    placeholder="City *"
                    value={form.city}
                    onChange={update('city')}
                    className={inputClass('city')}
                  />
                  {errors.city && <p className="text-xs text-chili mt-1">{errors.city}</p>}
                </div>
                <div>
                  <select
                    value={form.state}
                    onChange={update('state') as unknown as React.ChangeEventHandler<HTMLSelectElement>}
                    className={inputClass('state')}
                  >
                    <option value="">Select State *</option>
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {errors.state && <p className="text-xs text-chili mt-1">{errors.state}</p>}
                </div>
                <div>
                  <input
                    placeholder="Pincode *"
                    value={form.pincode}
                    onChange={update('pincode')}
                    className={inputClass('pincode')}
                  />
                  {errors.pincode && <p className="text-xs text-chili mt-1">{errors.pincode}</p>}
                </div>
              </div>
            </div>

            <div>
              <h2 className="eyebrow mb-5">Order Notes</h2>
              <textarea
                placeholder="Anything we should know about your order? (optional)"
                value={form.notes}
                onChange={update('notes')}
                rows={3}
                className={inputClass('notes')}
              />
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto">
              {submitting ? 'Placing Order...' : 'Place Order'}
            </button>
            <p className="text-xs text-brown-900/40">
              Cash on delivery. By placing this order you agree to be contacted regarding delivery.
            </p>
          </form>

          <div className="lg:col-span-1">
            <div className="card p-6 sm:p-8 sticky top-24">
              <h2 className="font-display text-xl mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-3 items-center">
                    <ProductImage src={item.image} alt="" className="h-14 w-14 rounded-sm object-cover bg-cream-200 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-brown-900 truncate">{item.name}</p>
                      <p className="text-xs text-brown-900/50">Qty {item.quantity}</p>
                    </div>
                    <p className="text-sm font-display shrink-0">{formatINR(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-brown-900/10 pt-5 flex justify-between items-baseline">
                <span className="font-display text-lg">Total</span>
                <span className="font-display text-2xl text-maroon">{formatINR(subtotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
