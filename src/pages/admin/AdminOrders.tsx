import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Order, OrderItem, OrderStatus } from '@/lib/types'
import { formatDate, formatINR, statusColors, statusLabels } from '@/lib/format'

const STATUS_OPTIONS: OrderStatus[] = [
  'new', 'confirmed', 'processing', 'packed', 'shipped', 'delivered', 'cancelled',
]

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
  const [selected, setSelected] = useState<Order | null>(null)
  const [items, setItems] = useState<OrderItem[]>([])

  const loadOrders = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) toast.error(error.message)
    else setOrders((data ?? []) as Order[])
    setLoading(false)
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const openOrder = async (order: Order) => {
    setSelected(order)
    const { data, error } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', order.id)
    if (error) toast.error(error.message)
    else setItems((data ?? []) as OrderItem[])
  }

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Order status updated')
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)))
    setSelected((s) => (s && s.id === orderId ? { ...s, status } : s))
  }

  const filtered = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter
    const q = query.toLowerCase()
    const matchesQuery =
      !q ||
      o.order_number.toLowerCase().includes(q) ||
      o.customer_name.toLowerCase().includes(q) ||
      o.customer_phone.includes(q)
    return matchesStatus && matchesQuery
  })

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl">Orders</h1>
          <p className="text-sm text-brown-900/50 mt-1">{orders.length} total orders</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 flex items-center gap-2 bg-white rounded-sm border border-brown-900/10 px-4 py-2.5">
          <Search size={16} className="text-brown-900/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by order #, name or phone"
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
          className="bg-white rounded-sm border border-brown-900/10 px-4 py-2.5 text-sm outline-none"
        >
          <option value="all">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{statusLabels[s]}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-sm border border-brown-900/10 overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="border-b border-brown-900/10 text-left text-xs uppercase tracking-wide text-brown-900/40">
              <th className="px-5 py-3.5">Order #</th>
              <th className="px-5 py-3.5">Customer</th>
              <th className="px-5 py-3.5">Date</th>
              <th className="px-5 py-3.5">Total</th>
              <th className="px-5 py-3.5">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-brown-900/40">Loading orders...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-brown-900/40">No orders found</td></tr>
            ) : (
              filtered.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => openOrder(order)}
                  className="border-b border-brown-900/5 last:border-0 hover:bg-cream/60 cursor-pointer transition-colors"
                >
                  <td className="px-5 py-4 font-medium text-maroon">{order.order_number}</td>
                  <td className="px-5 py-4">
                    <p>{order.customer_name}</p>
                    <p className="text-xs text-brown-900/40">{order.customer_phone}</p>
                  </td>
                  <td className="px-5 py-4 text-brown-900/60 whitespace-nowrap">{formatDate(order.created_at)}</td>
                  <td className="px-5 py-4 font-display">{formatINR(order.total)}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setSelected(null)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-cream z-50 overflow-y-auto"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-brown-900/10 sticky top-0 bg-cream z-10">
                <h2 className="font-display text-xl text-maroon">{selected.order_number}</h2>
                <button onClick={() => setSelected(null)} className="p-2 hover:bg-maroon/5 rounded-full">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-wide text-brown-900/40 mb-2">Status</p>
                  <select
                    value={selected.status}
                    onChange={(e) => updateStatus(selected.id, e.target.value as OrderStatus)}
                    className="w-full border border-brown-900/15 rounded-sm px-4 py-2.5 text-sm outline-none focus:border-maroon"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{statusLabels[s]}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-brown-900/40 mb-2">Customer</p>
                  <p className="font-medium">{selected.customer_name}</p>
                  <p className="text-sm text-brown-900/60">{selected.customer_phone}</p>
                  {selected.customer_email && <p className="text-sm text-brown-900/60">{selected.customer_email}</p>}
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-brown-900/40 mb-2">Delivery Address</p>
                  <p className="text-sm text-brown-900/70 leading-relaxed">
                    {selected.address_line1}, {selected.address_line2}
                    {selected.landmark && `, near ${selected.landmark}`}<br />
                    {selected.city}, {selected.state} - {selected.pincode}
                  </p>
                </div>

                {selected.notes && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-brown-900/40 mb-2">Order Notes</p>
                    <p className="text-sm text-brown-900/70">{selected.notes}</p>
                  </div>
                )}

                <div>
                  <p className="text-xs uppercase tracking-wide text-brown-900/40 mb-3">Items</p>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm border-b border-brown-900/5 pb-3">
                        <div>
                          <p className="font-medium">{item.product_name}</p>
                          <p className="text-brown-900/50">{item.product_weight_label} &times; {item.quantity}</p>
                        </div>
                        <p className="font-display">{formatINR(item.line_total)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-baseline pt-3">
                    <span className="font-display text-lg">Total</span>
                    <span className="font-display text-xl text-maroon">{formatINR(selected.total)}</span>
                  </div>
                </div>

                <p className="text-xs text-brown-900/40">Placed on {formatDate(selected.created_at)}</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
