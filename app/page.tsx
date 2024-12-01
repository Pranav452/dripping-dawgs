function HomePage() {
  return (
    <main>
      {/* Top Designs Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Top Designs</h2>
          {/* Your existing top designs content */}
        </div>
      </section>

      {/* Visual Separator */}
      <div className="w-full h-24 bg-gradient-to-b from-white to-gray-50" />

      {/* About Us Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">About Us</h2>
          {/* Your existing about us content */}
        </div>
      </section>
    </main>
  )
}

export default HomePage 