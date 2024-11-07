'use client'

import { useCounter } from '@/hooks/useCounter'
import { Star } from 'lucide-react'

export function AboutUs() {
  const customerCount = useCounter(1000);
  const designCount = useCounter(50);
  const ordersCount = useCounter(5000);

  return (
    <section className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-8 py-20 md:py-28">
        <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">About DrippingDog</h2>
        <div className="flex flex-col md:flex-row justify-between gap-16 max-w-7xl mx-auto">
          {/* Left side text content */} 
          <div className="md:w-2/3 space-y-10"><br />
            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
              At DrippingDog, we're passionate about creating unique, high-quality clothing that 
              helps you express your individual style. Our journey began with a simple idea: to 
              combine comfort with cutting-edge design.
            </p>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
              Every piece in our collection is carefully crafted with attention to detail and 
              a commitment to quality. We believe that great style shouldn't compromise on comfort, 
              which is why we use only the finest materials in our products.
            </p>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
              Our dedication to innovation drives us to constantly explore new trends and techniques, 
              ensuring that each collection brings something fresh and exciting to your wardrobe. 
              We take pride in building a community of fashion-forward individuals who appreciate 
              both style and substance.
            </p>
          </div>

          {/* Right side statistics */}
          <div className="md:w-auto space-y-6">
            <div className="min-w-[200px] py-4 px-5 rounded-lg bg-white backdrop-blur-sm">
              <h3 className="text-3xl md:text-4xl font-bold text-black">
                {customerCount}+
              </h3>
              <p className="text-gray-600 text-sm mt-1">Happy Customers</p>
            </div>
            <div className="min-w-[200px] py-4 px-5 rounded-lg bg-white backdrop-blur-sm">
              <h3 className="text-3xl md:text-4xl font-bold text-black">
                {ordersCount}+
              </h3>
              <p className="text-gray-600 text-sm mt-1">Orders Delivered</p>
            </div>
            <div className="min-w-[200px] py-4 px-5 rounded-lg bg-white backdrop-blur-sm">
              <h3 className="text-3xl md:text-4xl font-bold text-black">
                {designCount}+
              </h3>
              <p className="text-gray-600 text-sm mt-1">Unique Designs</p>
            </div>
            <div className="min-w-[200px] py-4 px-5 rounded-lg bg-white backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <h3 className="text-3xl md:text-4xl font-bold text-black">4.5</h3>
                <div className="flex text-yellow-400">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current opacity-50" />
                </div>
              </div>
              <p className="text-gray-600 text-sm mt-1">Customer Rating</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 