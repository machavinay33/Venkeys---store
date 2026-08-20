export function ProductCardSkeleton() {
  return (
    <div>
      <div className="skeleton aspect-[4/5] w-full" />
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="space-y-2 flex-1">
          <div className="skeleton h-5 w-2/3" />
          <div className="skeleton h-3.5 w-1/3" />
        </div>
        <div className="skeleton h-5 w-16" />
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 px-6">
      <div className="h-16 w-16 rounded-full border border-maroon/20 flex items-center justify-center mb-6">
        <span className="text-2xl">🌶️</span>
      </div>
      <h3 className="font-display text-2xl text-brown-900 mb-2">{title}</h3>
      {description && <p className="text-brown-900/60 max-w-sm mb-6">{description}</p>}
      {action}
    </div>
  )
}
