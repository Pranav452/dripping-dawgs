import { HeroSection } from '@/components/HeroSection'
import { TopDesigns } from '@/components/TopDesigns'
import { AboutUs } from '@/components/AboutUs'
import { OurServices } from '@/components/OurServices'

export default async function Home() {
  return (
    <div className="space-y-20">
      <HeroSection />
      <TopDesigns />
      <AboutUs />
      <OurServices />
    </div>
  )
}
