export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

/**
 * Generates an order number in the shape VK-YYYYMMDD-XXXX.
 * The sequence portion is produced atomically by the `next_order_seq`
 * Postgres function (see supabase/migrations) to avoid collisions;
 * this client-side helper is only used for optimistic/preview display.
 */
export function previewOrderNumber(seq: number): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `VK-${y}${m}${d}-${String(seq).padStart(4, '0')}`
}

export const statusLabels: Record<string, string> = {
  new: 'New',
  confirmed: 'Confirmed',
  processing: 'Processing',
  packed: 'Packed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export const statusColors: Record<string, string> = {
  new: 'bg-gold/20 text-gold-dark',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-amber-100 text-amber-700',
  packed: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}
