import { ProductGrid } from '@/components/ProductGrid'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

function ProductGridSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8 space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-square w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <div>
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGrid />
      </Suspense>
    </div>
  )
}
