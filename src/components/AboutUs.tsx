import Image from 'next/image'

export function AboutUs() {
  return (
    <section className="bg-gray-50"><br /><br /><br /><br />
      <div className="mx-auto max-w-7xl px-4 pb-8 md:pb-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">About Dripping Dawgs</h2>
          <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
            At Dripping Dawgs, we're passionate about creating unique, high-quality clothing that 
            helps you express your individual style. Our journey began with a simple idea: to 
            combine comfort with cutting-edge design.
          </p>
          <p className="text-gray-600 mb-6 text-sm md:text-base">
            Every piece in our collection is carefully crafted with attention to detail and 
            a commitment to quality. We believe that great style shouldn't compromise on comfort, 
            which is why we use only the finest materials in our products.
          </p>
          <div className="grid grid-cols-3 gap-4 md:gap-8 text-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-black mb-1 md:mb-2">1000+</h3>
              <p className="text-gray-600 text-sm md:text-base">Happy Customers</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-black mb-2">50+</h3>
              <p className="text-gray-600">Unique Designs</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-black mb-2">100%</h3>
              <p className="text-gray-600">Quality Assured</p>
            </div>
          </div><br /><br /><br />
        </div>
      </div>
    </section>
  )
} 