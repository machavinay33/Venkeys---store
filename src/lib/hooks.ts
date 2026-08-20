import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import type { Offer, Product, SiteSettings } from './types'

export function useProducts(activeOnly = true) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      let query = supabase.from('products').select('*').order('sort_order', { ascending: true })
      if (activeOnly) query = query.eq('is_active', true)
      const { data, error } = await query
      if (cancelled) return
      if (error) setError(error.message)
      else setProducts((data ?? []) as Product[])
      setLoading(false)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [activeOnly])

  return { products, loading, error }
}

export function useProduct(slug: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) {
      setLoading(false)
      return
    }
    let cancelled = false
    async function load() {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle()
      if (cancelled) return
      if (error) setError(error.message)
      else setProduct(data as Product | null)
      setLoading(false)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [slug])

  return { product, loading, error }
}

export function useActiveOffer() {
  const [offer, setOffer] = useState<Offer | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const now = new Date().toISOString()
      const { data } = await supabase
        .from('offers')
        .select('*')
        .eq('is_active', true)
        .or(`start_date.is.null,start_date.lte.${now}`)
        .or(`end_date.is.null,end_date.gte.${now}`)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (cancelled) return
      setOffer((data as Offer) ?? null)
      setLoading(false)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { offer, loading }
}

const FALLBACK_SETTINGS: SiteSettings = {
  id: 'fallback',
  brand_name: "Venky's",
  tagline: 'Authentic Organic Spices',
  phone: '+91 93919 01656',
  whatsapp: '+91 93919 01656',
  instagram_url: 'https://www.instagram.com/venkys__kitchen',
  email: 'venkysfoodsofficial@gmail.com',
  address: 'Shanthi Nagar, Hayath Nagar, Hyderabad',
  homepage_headline: 'Where purity meets tradition',
  homepage_subheadline:
    'Premium red chilli powder, made from carefully selected chillies for rich colour, authentic aroma and natural taste — without pesticides, artificial colours, chemicals or preservatives.',
  footer_note: 'More premium organic food products are coming soon.',
  updated_at: new Date().toISOString(),
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(FALLBACK_SETTINGS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const { data } = await supabase.from('site_settings').select('*').limit(1).maybeSingle()
      if (cancelled) return
      if (data) setSettings(data as SiteSettings)
      setLoading(false)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { settings, loading }
}
