import { supabase } from './supabase'
import type { CartItem } from './types'

export interface CheckoutDetails {
  fullName: string
  mobile: string
  email: string
  house: string
  street: string
  landmark: string
  city: string
  state: string
  pincode: string
  notes: string
}

export interface CreateOrderResult {
  orderNumber: string
  orderId: string
  total: number
}

/**
 * Creates an order via the `create_order` Postgres function (see
 * supabase/migrations/0001_init.sql). The function re-prices every line
 * item server-side from the products table, generates a collision-free
 * VK-YYYYMMDD-NNNN order number, and inserts the order + order_items in
 * a single transaction — the client never gets to dictate the price paid.
 */
export async function createOrder(
  details: CheckoutDetails,
  items: CartItem[]
): Promise<CreateOrderResult> {
  const payloadItems = items.map((i) => ({
    product_id: i.productId,
    quantity: i.quantity,
  }))

  const { data, error } = await supabase.rpc('create_order', {
    p_customer_name: details.fullName,
    p_customer_phone: details.mobile,
    p_customer_email: details.email,
    p_address_line1: details.house,
    p_address_line2: details.street,
    p_landmark: details.landmark,
    p_city: details.city,
    p_state: details.state,
    p_pincode: details.pincode,
    p_notes: details.notes,
    p_items: payloadItems,
  })

  if (error) throw new Error(error.message)

  const row = Array.isArray(data) ? data[0] : data
  return {
    orderNumber: row.order_number,
    orderId: row.order_id,
    total: row.total,
  }
}
