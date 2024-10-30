export function OurServices() {
  const services = [
    {
      title: "Custom Designs",
      description: "Get unique, personalized designs tailored to your style and preferences",
      icon: "🎨"
    },
    {
      title: "Premium Quality",
      description: "All our products are made with the highest quality materials for lasting comfort",
      icon: "⭐"
    },
    {
      title: "Fast Shipping",
      description: "Quick and reliable shipping to get your favorite designs to you faster",
      icon: "🚚"
    },
    {
      title: "24/7 Support",
      description: "Our customer service team is always here to help with any questions",
      icon: "💬"
    }
  ]

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Our Services</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We provide comprehensive services to ensure you get the best shopping experience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((service, index) => (
          <div 
            key={index}
            className="p-6 rounded-lg border hover:shadow-lg transition-shadow duration-300"
          >
            <div className="text-4xl mb-4">{service.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
            <p className="text-gray-600">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
} 