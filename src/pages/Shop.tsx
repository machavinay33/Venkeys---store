import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import SEO from '@/components/SEO'
import Reveal from '@/components/Reveal'
import ProductCard from '@/components/ProductCard'
import { EmptyState, ProductGridSkeleton } from '@/components/Skeletons'
import { useProducts } from '@/lib/hooks'
import { Search } from 'lucide-react'

export default function Shop() {
  const { products, loading } = useProducts()
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')

  const filtered = useMemo(() => {
    if (!query.trim()) return products
    const q = query.toLowerCase()
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.short_description.toLowerCase().includes(q) ||
        p.weight_label.toLowerCase().includes(q)
    )
  }, [products, query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchParams(query ? { q: query } : {})
  }

  return (
    <>
      <SEO
        title="Shop Spices"
        description="Shop Venky's premium Red Chilli Powder — traditional, organic, made without pesticides, artificial colours or preservatives."
        path="/shop"
      />

      <section className="bg-maroon-900 py-14 sm:py-20">
        <div className="container-page">
          <Reveal>
            <span className="eyebrow text-gold-light">The Collection</span>
            <h1 className="mt-3 text-3xl sm:text-5xl font-light text-cream">Shop Spices</h1>
            <p className="mt-4 text-cream/60 max-w-lg">
              Traditional, organic spices — made without pesticides, artificial colours or preservatives.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-page py-12 sm:py-16">
        <form onSubmit={handleSearch} className="mb-10 max-w-md">
          <div className="flex items-center gap-3 border-b border-brown-900/20 pb-3 focus-within:border-maroon transition-colors">
            <Search size={18} className="text-brown-900/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search spices..."
              className="flex-1 bg-transparent outline-none placeholder:text-brown-900/30"
            />
          </div>
        </form>

        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No spices found"
            description="Try a different search term, or browse our full collection."
            action={
              <button
                onClick={() => {
                  setQuery('')
                  setSearchParams({})
                }}
                className="btn-outline"
              >
                Clear Search
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
