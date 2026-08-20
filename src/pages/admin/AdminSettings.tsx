import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import type { SiteSettings } from '@/lib/types'

export default function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.from('site_settings').select('*').limit(1).maybeSingle()
      if (error) toast.error(error.message)
      setSettings(data as SiteSettings | null)
      setLoading(false)
    }
    load()
  }, [])

  const update = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
    setSettings((s) => (s ? { ...s, [key]: value } : s))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!settings) return
    setSaving(true)
    const { error } = await supabase
      .from('site_settings')
      .update({
        brand_name: settings.brand_name,
        tagline: settings.tagline,
        phone: settings.phone,
        whatsapp: settings.whatsapp,
        instagram_url: settings.instagram_url,
        email: settings.email,
        address: settings.address,
        homepage_headline: settings.homepage_headline,
        homepage_subheadline: settings.homepage_subheadline,
        footer_note: settings.footer_note,
      })
      .eq('id', settings.id)
    setSaving(false)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Settings saved')
  }

  if (loading) return <p className="text-brown-900/40">Loading settings...</p>
  if (!settings) return <p className="text-brown-900/40">No settings row found. Run the seed migration first.</p>

  const inputClass =
    'w-full border border-brown-900/15 rounded-sm px-4 py-2.5 text-sm outline-none focus:border-maroon bg-white transition-colors'

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl sm:text-3xl mb-8">Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-sm border border-brown-900/10 p-6 sm:p-8">
        <div>
          <h2 className="eyebrow mb-4">Brand</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-wide text-brown-900/40 mb-1.5 block">Brand Name</label>
              <input value={settings.brand_name} onChange={(e) => update('brand_name', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-brown-900/40 mb-1.5 block">Tagline</label>
              <input value={settings.tagline} onChange={(e) => update('tagline', e.target.value)} className={inputClass} />
            </div>
          </div>
        </div>

        <div>
          <h2 className="eyebrow mb-4">Contact</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-wide text-brown-900/40 mb-1.5 block">Phone</label>
              <input value={settings.phone} onChange={(e) => update('phone', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-brown-900/40 mb-1.5 block">WhatsApp</label>
              <input value={settings.whatsapp} onChange={(e) => update('whatsapp', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-brown-900/40 mb-1.5 block">Email</label>
              <input value={settings.email} onChange={(e) => update('email', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-brown-900/40 mb-1.5 block">Instagram URL</label>
              <input value={settings.instagram_url} onChange={(e) => update('instagram_url', e.target.value)} className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs uppercase tracking-wide text-brown-900/40 mb-1.5 block">Address</label>
              <input value={settings.address} onChange={(e) => update('address', e.target.value)} className={inputClass} />
            </div>
          </div>
        </div>

        <div>
          <h2 className="eyebrow mb-4">Homepage Text</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wide text-brown-900/40 mb-1.5 block">Headline</label>
              <input value={settings.homepage_headline} onChange={(e) => update('homepage_headline', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-brown-900/40 mb-1.5 block">Subheadline</label>
              <textarea value={settings.homepage_subheadline} onChange={(e) => update('homepage_subheadline', e.target.value)} rows={3} className={inputClass} />
            </div>
          </div>
        </div>

        <div>
          <h2 className="eyebrow mb-4">Footer</h2>
          <textarea value={settings.footer_note} onChange={(e) => update('footer_note', e.target.value)} rows={2} className={inputClass} />
        </div>

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  )
}
