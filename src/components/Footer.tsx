export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-bold">Dripping Dawgs</h3>
            <p className="mt-2 text-sm text-gray-600">
              Premium Clothing Store
            </p>
          </div>
          <div className="flex gap-8">
            <div>
              <h4 className="font-semibold">Shop</h4>
              <ul className="mt-2 space-y-2 text-sm text-gray-600">
                <li>New Arrivals</li>
                <li>Best Sellers</li>
                <li>Sale</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Contact</h4>
              <ul className="mt-2 space-y-2 text-sm text-gray-600">
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
