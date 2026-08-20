import { Flame } from 'lucide-react'

type ProductImageProps = {
  src?: string | null
  alt: string
  className?: string
  loading?: 'eager' | 'lazy'
}

const BUNDLED_PRODUCT_IMAGE = /(?:^|\/)images\/product-(?:hero|500g|1kg|\d+kg)\.jpg(?:$|\?)/i

export default function ProductImage({ src, alt, className = '', loading = 'lazy' }: ProductImageProps) {
  const showImage = Boolean(src && !BUNDLED_PRODUCT_IMAGE.test(src))

  if (!showImage) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-maroon via-brown-950 to-maroon text-cream/80 ${className}`} role="img" aria-label={alt}>
        <div className="flex flex-col items-center gap-2 text-center px-4">
          <Flame size={28} className="text-gold" strokeWidth={1.4} />
          <span className="font-display text-lg tracking-wide">Venky&apos;s</span>
          <span className="text-[10px] uppercase tracking-[0.22em] text-cream/50">Authentic Organic Spices</span>
        </div>
      </div>
    )
  }

  return <img src={src ?? undefined} alt={alt} loading={loading} className={className} />
}

export function isBundledProductImage(src?: string | null) {
  return Boolean(src && BUNDLED_PRODUCT_IMAGE.test(src))
}
