import { HeroSection } from '@/components/HeroSection'
import { ProductGrid } from '@/components/ProductGrid'

export default async function Home() {
  return (
    <div>
      <HeroSection />
      <ProductGrid />
    </div>
  )
}
