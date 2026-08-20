export type ProductBadge = 'none' | 'bestseller' | 'new' | 'limited'

export interface Product {
  id: string
  slug: string
  name: string
  weight_label: string
  description: string
  short_description: string
  price: number
  compare_at_price: number | null
  stock_status: 'in_stock' | 'out_of_stock' | 'low_stock'
  is_active: boolean
  is_featured: boolean
  badge: ProductBadge
  cover_image: string
  gallery_images: string[]
  sort_order: number
  created_at: string
  updated_at: string
}

export type OrderStatus =
  | 'new'
  | 'confirmed'
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  customer_email: string
  address_line1: string
  address_line2: string
  landmark: string
  city: string
  state: string
  pincode: string
  notes: string
  status: OrderStatus
  subtotal: number
  total: number
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  product_weight_label: string
  unit_price: number
  quantity: number
  line_total: number
}

export interface Offer {
  id: string
  title: string
  description: string
  desktop_image: string
  mobile_image: string
  cta_label: string
  cta_url: string
  start_date: string | null
  end_date: string | null
  is_active: boolean
  created_at: string
}

export interface SiteSettings {
  id: string
  brand_name: string
  tagline: string
  phone: string
  whatsapp: string
  instagram_url: string
  email: string
  address: string
  homepage_headline: string
  homepage_subheadline: string
  footer_note: string
  updated_at: string
}

export interface CartItem {
  productId: string
  slug: string
  name: string
  weightLabel: string
  price: number
  image: string
  quantity: number
}
