'use client'

import { useCounter } from '@/hooks/useCounter'

export function AboutUs() {
  const customerCount = useCounter(1000);
  const designCount = useCounter(50);
  const qualityCount = useCounter(100);

  return (
    <section className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center">About Dripping Dog</h2>
          <p className="text-gray-300 mb-4 md:mb-6 text-sm md:text-base">
            At Dripping Dog, we're passionate about creating unique, high-quality clothing that 
            helps you express your individual style. Our journey began with a simple idea: to 
            combine comfort with cutting-edge design.
          </p>
          <p className="text-gray-300 mb-12 text-sm md:text-base">
            Every piece in our collection is carefully crafted with attention to detail and 
            a commitment to quality. We believe that great style shouldn't compromise on comfort, 
            which is why we use only the finest materials in our products.
          </p>
          <p className="text-gray-300 mb-12 text-sm md:text-base">
            Every piece in our collection is carefully crafted with attention to detail and 
            a commitment to quality. We believe that great style shouldn't compromise on comfort, 
            which is why we use only the finest materials in our products.
          </p>
          <div className="grid grid-cols-3 gap-4 md:gap-8 text-center">
            <div className="p-6 rounded-lg bg-gray-900">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">
                {customerCount}+
              </h3>
              <p className="text-gray-300 text-sm md:text-base">Happy Customers</p>
            </div>
            <div className="p-6 rounded-lg bg-gray-900">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">
                {designCount}+
              </h3>
              <p className="text-gray-300 text-sm md:text-base">Unique Designs</p>
            </div>
            <div className="p-6 rounded-lg bg-gray-900">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">
                {qualityCount}%
              </h3>
              <p className="text-gray-300 text-sm md:text-base">Quality Assured</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 