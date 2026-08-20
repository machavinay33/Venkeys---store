import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowLeft, Upload, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Product, ProductBadge } from '@/lib/types'

type FormState = Omit<Product, 'id' | 'created_at' | 'updated_at'>

const EMPTY_FORM: FormState = {
  slug: '',
  name: '',
  weight_label: '',
  description: '',
  short_description: '',
  price: 0,
  compare_at_price: null,
  stock_status: 'in_stock',
  is_active: true,
  is_featured: false,
  badge: 'none',
  cover_image: '',
  gallery_images: [],
  sort_order: 0,
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function AdminProductForm() {
  const { id } = useParams<{ id: string }>()
  const isNew = !id || id === 'new'
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [slugTouched, setSlugTouched] = useState(false)

  useEffect(() => {
    if (isNew) return
    async function load() {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single()
      if (error) {
        toast.error(error.message)
      } else if (data) {
        setForm(data as FormState)
        setSlugTouched(true)
      }
      setLoading(false)
    }
    load()
  }, [id, isNew])

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
  }

  const handleNameChange = (name: string) => {
    update('name', name)
    if (!slugTouched) update('slug', slugify(name))
  }

  const uploadImage = async (file: File, target: 'cover' | 'gallery') => {
    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `${crypto.randomUUID()}.${ext}`
      const { error } = await supabase.storage.from('product-images').upload(path, file)
      if (error) throw error
      const { data } = supabase.storage.from('product-images').getPublicUrl(path)
      if (target === 'cover') {
        update('cover_image', data.publicUrl)
      } else {
        update('gallery_images', [...form.gallery_images, data.publicUrl])
      }
      toast.success('Image uploaded')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const removeGalleryImage = (url: string) => {
    update('gallery_images', form.gallery_images.filter((g) => g !== url))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.slug.trim() || !form.weight_label.trim()) {
      toast.error('Name, slug and weight are required')
      return
    }
    if (!form.cover_image) {
      toast.error('Please upload a cover image')
      return
    }
    setSaving(true)
    const payload = { ...form, compare_at_price: form.compare_at_price || null }
    const { error } = isNew
      ? await supabase.from('products').insert(payload)
      : await supabase.from('products').update(payload).eq('id', id)
    setSaving(false)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success(isNew ? 'Product created' : 'Product updated')
    navigate('/admin/products')
  }

  if (loading) return <p className="text-brown-900/40">Loading...</p>

  const inputClass =
    'w-full border border-brown-900/15 rounded-sm px-4 py-2.5 text-sm outline-none focus:border-maroon bg-white transition-colors'

  return (
    <div className="max-w-3xl">
      <button
        onClick={() => navigate('/admin/products')}
        className="inline-flex items-center gap-2 text-sm text-brown-900/60 hover:text-maroon mb-6"
      >
        <ArrowLeft size={15} /> Back to Products
      </button>

      <h1 className="font-display text-2xl sm:text-3xl mb-8">
        {isNew ? 'Add Product' : 'Edit Product'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-sm border border-brown-900/10 p-6 sm:p-8">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase tracking-wide text-brown-900/40 mb-1.5 block">Name *</label>
            <input
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className={inputClass}
              placeholder="Red Chilli Powder"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-brown-900/40 mb-1.5 block">Slug *</label>
            <input
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true)
                update('slug', e.target.value)
              }}
              className={inputClass}
              placeholder="red-chilli-powder-500g"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-brown-900/40 mb-1.5 block">Weight Label *</label>
            <input
              value={form.weight_label}
              onChange={(e) => update('weight_label', e.target.value)}
              className={inputClass}
              placeholder="500g"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-brown-900/40 mb-1.5 block">Badge</label>
            <select
              value={form.badge}
              onChange={(e) => update('badge', e.target.value as ProductBadge)}
              className={inputClass}
            >
              <option value="none">None</option>
              <option value="bestseller">Bestseller</option>
              <option value="new">New</option>
              <option value="limited">Limited</option>
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-brown-900/40 mb-1.5 block">Price (₹) *</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={form.price}
              onChange={(e) => update('price', Number(e.target.value))}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-brown-900/40 mb-1.5 block">Compare-at Price (₹)</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={form.compare_at_price ?? ''}
              onChange={(e) => update('compare_at_price', e.target.value ? Number(e.target.value) : null)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-brown-900/40 mb-1.5 block">Stock Status</label>
            <select
              value={form.stock_status}
              onChange={(e) => update('stock_status', e.target.value as FormState['stock_status'])}
              className={inputClass}
            >
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-brown-900/40 mb-1.5 block">Sort Order</label>
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => update('sort_order', Number(e.target.value))}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="text-xs uppercase tracking-wide text-brown-900/40 mb-1.5 block">Short Description</label>
          <input
            value={form.short_description}
            onChange={(e) => update('short_description', e.target.value)}
            className={inputClass}
            placeholder="One-line description shown on product cards"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wide text-brown-900/40 mb-1.5 block">Full Description</label>
          <textarea
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            rows={4}
            className={inputClass}
          />
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => update('is_active', e.target.checked)}
            />
            Active
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => update('is_featured', e.target.checked)}
            />
            Featured on Homepage
          </label>
        </div>

        <div>
          <label className="text-xs uppercase tracking-wide text-brown-900/40 mb-2 block">Cover Image *</label>
          {form.cover_image && (
            <img src={form.cover_image} alt="Cover" className="h-32 w-32 object-cover rounded-sm mb-3 border border-brown-900/10" />
          )}
          <label className="inline-flex items-center gap-2 text-sm border border-brown-900/15 rounded-sm px-4 py-2.5 cursor-pointer hover:border-maroon transition-colors w-fit">
            <Upload size={15} />
            {uploading ? 'Uploading...' : 'Upload Cover Image'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], 'cover')}
            />
          </label>
        </div>

        <div>
          <label className="text-xs uppercase tracking-wide text-brown-900/40 mb-2 block">Gallery Images</label>
          <div className="flex flex-wrap gap-3 mb-3">
            {form.gallery_images.map((img) => (
              <div key={img} className="relative">
                <img src={img} alt="" className="h-20 w-20 object-cover rounded-sm border border-brown-900/10" />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(img)}
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-brown-950 text-cream flex items-center justify-center"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
          <label className="inline-flex items-center gap-2 text-sm border border-brown-900/15 rounded-sm px-4 py-2.5 cursor-pointer hover:border-maroon transition-colors w-fit">
            <Upload size={15} />
            Add Gallery Image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], 'gallery')}
            />
          </label>
        </div>

        <div className="flex gap-3 pt-4 border-t border-brown-900/10">
          <button type="submit" disabled={saving || uploading} className="btn-primary">
            {saving ? 'Saving...' : isNew ? 'Create Product' : 'Save Changes'}
          </button>
          <button type="button" onClick={() => navigate('/admin/products')} className="btn-outline">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
