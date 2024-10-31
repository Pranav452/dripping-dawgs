export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 md:py-8">
        <div className="flex flex-col md:flex-row md:justify-between gap-6 md:gap-0">
          <div>
            <h3 className="text-lg font-bold">Dripping Dawgs</h3>
            <p className="mt-2 text-sm text-gray-600">
              Premium Clothing Store
            </p>
          </div>
          <div className="grid grid-cols-2 md:flex gap-8">
            <div>
              <h4 className="font-semibold mb-2">Shop</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>New Arrivals</li>
                <li>Best Sellers</li>
                <li>Sale</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Support</li>
                <li>Shipping</li>
                <li>Returns</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
