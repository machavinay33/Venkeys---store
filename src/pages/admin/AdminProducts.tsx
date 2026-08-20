import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, EyeOff, Eye } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/lib/types'
import { formatINR } from '@/lib/format'

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true })
    if (error) toast.error(error.message)
    else setProducts((data ?? []) as Product[])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const toggleActive = async (product: Product) => {
    const { error } = await supabase
      .from('products')
      .update({ is_active: !product.is_active })
      .eq('id', product.id)
    if (error) {
      toast.error(error.message)
      return
    }
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, is_active: !p.is_active } : p))
    )
    toast.success(product.is_active ? 'Product deactivated' : 'Product activated')
  }

  const deleteProduct = async (product: Product) => {
    if (!confirm(`Delete "${product.name} — ${product.weight_label}"? This cannot be undone.`)) return
    const { error } = await supabase.from('products').delete().eq('id', product.id)
    if (error) {
      toast.error(error.message)
      return
    }
    setProducts((prev) => prev.filter((p) => p.id !== product.id))
    toast.success('Product deleted')
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl">Products</h1>
          <p className="text-sm text-brown-900/50 mt-1">{products.length} products</p>
        </div>
        <Link to="/admin/products/new" className="btn-primary !px-5 !py-2.5">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-brown-900/40">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-brown-900/40">No products yet.</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="bg-white rounded-sm border border-brown-900/10 overflow-hidden">
              <div className="aspect-video bg-cream-200 relative">
                <img src={product.cover_image} alt={product.name} className="h-full w-full object-cover" />
                {!product.is_active && (
                  <span className="absolute top-3 left-3 bg-brown-950/80 text-cream text-xs px-2.5 py-1 rounded-full">
                    Inactive
                  </span>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-lg">{product.name}</h3>
                    <p className="text-xs text-brown-900/50">{product.weight_label}</p>
                  </div>
                  <p className="font-display text-maroon">{formatINR(product.price)}</p>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Link
                    to={`/admin/products/${product.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs border border-brown-900/15 rounded-sm py-2 hover:border-maroon hover:text-maroon transition-colors"
                  >
                    <Pencil size={13} /> Edit
                  </Link>
                  <button
                    onClick={() => toggleActive(product)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs border border-brown-900/15 rounded-sm py-2 hover:border-maroon hover:text-maroon transition-colors"
                  >
                    {product.is_active ? <EyeOff size={13} /> : <Eye size={13} />}
                    {product.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => deleteProduct(product)}
                    className="inline-flex items-center justify-center gap-1.5 text-xs border border-brown-900/15 rounded-sm py-2 px-3 hover:border-chili hover:text-chili transition-colors"
                    aria-label="Delete product"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
