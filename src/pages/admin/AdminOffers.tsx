import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Trash2, Upload, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Offer } from '@/lib/types'
import { formatDate } from '@/lib/format'

type FormState = Omit<Offer, 'id' | 'created_at'>

const EMPTY_FORM: FormState = {
  title: '',
  description: '',
  desktop_image: '',
  mobile_image: '',
  cta_label: 'Shop Now',
  cta_url: '/shop',
  start_date: null,
  end_date: null,
  is_active: false,
}

export default function AdminOffers() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('offers').select('*').order('created_at', { ascending: false })
    if (error) toast.error(error.message)
    else setOffers((data ?? []) as Offer[])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
  }

  const uploadImage = async (file: File, target: 'desktop_image' | 'mobile_image') => {
    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `${crypto.randomUUID()}.${ext}`
      const { error } = await supabase.storage.from('offer-images').upload(path, file)
      if (error) throw error
      const { data } = supabase.storage.from('offer-images').getPublicUrl(path)
      update(target, data.publicUrl)
      toast.success('Image uploaded')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.desktop_image) {
      toast.error('Title and desktop banner image are required')
      return
    }
    setSaving(true)
    const { error } = await supabase.from('offers').insert(form)
    setSaving(false)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Offer created')
    setForm(EMPTY_FORM)
    setShowForm(false)
    load()
  }

  const toggleActive = async (offer: Offer) => {
    const { error } = await supabase.from('offers').update({ is_active: !offer.is_active }).eq('id', offer.id)
    if (error) {
      toast.error(error.message)
      return
    }
    setOffers((prev) => prev.map((o) => (o.id === offer.id ? { ...o, is_active: !o.is_active } : o)))
    toast.success(offer.is_active ? 'Offer deactivated' : 'Offer activated')
  }

  const deleteOffer = async (offer: Offer) => {
    if (!confirm(`Delete offer "${offer.title}"?`)) return
    const { error } = await supabase.from('offers').delete().eq('id', offer.id)
    if (error) {
      toast.error(error.message)
      return
    }
    setOffers((prev) => prev.filter((o) => o.id !== offer.id))
    toast.success('Offer deleted')
  }

  const inputClass =
    'w-full border border-brown-900/15 rounded-sm px-4 py-2.5 text-sm outline-none focus:border-maroon bg-white transition-colors'

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl">Offers</h1>
          <p className="text-sm text-brown-900/50 mt-1">
            Only one active offer is shown on the homepage at a time.
          </p>
        </div>
        <button onClick={() => setShowForm((s) => !s)} className="btn-primary !px-5 !py-2.5">
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel' : 'Add Offer'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-10 bg-white rounded-sm border border-brown-900/10 p-6 sm:p-8 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-wide text-brown-900/40 mb-1.5 block">Title *</label>
              <input value={form.title} onChange={(e) => update('title', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-brown-900/40 mb-1.5 block">CTA Label</label>
              <input value={form.cta_label} onChange={(e) => update('cta_label', e.target.value)} className={inputClass} />
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wide text-brown-900/40 mb-1.5 block">Description</label>
            <textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={2} className={inputClass} />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wide text-brown-900/40 mb-1.5 block">CTA URL</label>
            <input value={form.cta_url} onChange={(e) => update('cta_url', e.target.value)} className={inputClass} placeholder="/shop" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-wide text-brown-900/40 mb-1.5 block">Start Date (optional)</label>
              <input
                type="date"
                value={form.start_date ? form.start_date.slice(0, 10) : ''}
                onChange={(e) => update('start_date', e.target.value ? new Date(e.target.value).toISOString() : null)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-brown-900/40 mb-1.5 block">End Date (optional)</label>
              <input
                type="date"
                value={form.end_date ? form.end_date.slice(0, 10) : ''}
                onChange={(e) => update('end_date', e.target.value ? new Date(e.target.value).toISOString() : null)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="text-xs uppercase tracking-wide text-brown-900/40 mb-2 block">Desktop Banner *</label>
              {form.desktop_image && (
                <img src={form.desktop_image} alt="" className="h-24 w-full object-cover rounded-sm mb-2 border border-brown-900/10" />
              )}
              <label className="inline-flex items-center gap-2 text-sm border border-brown-900/15 rounded-sm px-4 py-2.5 cursor-pointer hover:border-maroon transition-colors w-fit">
                <Upload size={15} /> Upload
                <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], 'desktop_image')} />
              </label>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-brown-900/40 mb-2 block">Mobile Banner</label>
              {form.mobile_image && (
                <img src={form.mobile_image} alt="" className="h-24 w-full object-cover rounded-sm mb-2 border border-brown-900/10" />
              )}
              <label className="inline-flex items-center gap-2 text-sm border border-brown-900/15 rounded-sm px-4 py-2.5 cursor-pointer hover:border-maroon transition-colors w-fit">
                <Upload size={15} /> Upload
                <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], 'mobile_image')} />
              </label>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_active} onChange={(e) => update('is_active', e.target.checked)} />
            Activate immediately
          </label>

          <button type="submit" disabled={saving || uploading} className="btn-primary">
            {saving ? 'Saving...' : 'Create Offer'}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {loading ? (
          <p className="text-brown-900/40">Loading offers...</p>
        ) : offers.length === 0 ? (
          <p className="text-brown-900/40">No offers yet. Create one above — it will appear on the homepage once active.</p>
        ) : (
          offers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-sm border border-brown-900/10 p-5 flex items-center gap-4">
              <img src={offer.desktop_image} alt="" className="h-16 w-24 object-cover rounded-sm shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{offer.title}</p>
                <p className="text-xs text-brown-900/40">Created {formatDate(offer.created_at)}</p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${offer.is_active ? 'bg-green-100 text-green-700' : 'bg-brown-900/5 text-brown-900/50'}`}>
                {offer.is_active ? 'Active' : 'Inactive'}
              </span>
              <button onClick={() => toggleActive(offer)} className="text-xs border border-brown-900/15 rounded-sm px-3 py-2 hover:border-maroon hover:text-maroon transition-colors shrink-0">
                {offer.is_active ? 'Deactivate' : 'Activate'}
              </button>
              <button onClick={() => deleteOffer(offer)} className="text-brown-900/40 hover:text-chili shrink-0" aria-label="Delete offer">
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
