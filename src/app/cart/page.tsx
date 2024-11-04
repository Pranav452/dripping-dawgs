'use client'

import { useCartStore } from '@/store/cart'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Package } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCartStore()
  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const shipping = total > 100 ? 0 : 10
  const subtotal = total
  const finalTotal = total + shipping

  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-md mx-auto text-center px-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ShoppingBag className="w-32 h-32 text-gray-300 mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Your Cart is Empty
            </h1>
            <p className="text-gray-600 mb-8 text-lg">
              Time to fill it with something extraordinary.
            </p>
            <Link href="/products">
              <Button className="bg-black text-white hover:bg-gray-800 transform hover:scale-105 transition-all duration-300 text-lg px-8 py-6 h-auto">
                Explore Collection <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-16 px-4 bg-gradient-to-b from-white to-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Your Shopping Cart
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="mb-8 border-0 shadow-lg">
              <ScrollArea className="h-[calc(100vh-400px)]">
                <div className="p-6 space-y-6">
                  {items.map((item) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={item.id}
                      className="flex gap-6 pb-6 border-b last:border-b-0 last:pb-0 group hover:bg-gray-50 p-4 rounded-lg transition-all duration-300"
                    >
                      <div className="relative h-40 w-40 flex-shrink-0 rounded-xl overflow-hidden group-hover:shadow-md transition-all duration-300">
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          fill
                          className="object-cover transform group-hover:scale-105 transition-all duration-500"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <h3 className="text-xl font-bold">{item.name}</h3>
                          <p className="text-lg text-gray-600 mt-1">${item.price.toFixed(2)}</p>
                          <div className="flex gap-4 mt-2">
                            {item.size && (
                              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                                Size: {item.size}
                              </span>
                            )}
                            {item.color && (
                              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                                Color: {item.color}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mt-4">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="rounded-full hover:bg-black hover:text-white transition-all duration-300"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="font-semibold text-lg w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="rounded-full hover:bg-black hover:text-white transition-all duration-300"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-300"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                        <p className="font-bold text-2xl">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 border-0 shadow-lg sticky top-8">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-sm text-gray-500">
                    Free shipping on orders over $100
                  </p>
                )}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-2xl font-bold">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Link href="/checkout" className="block">
                  <Button className="w-full bg-black text-white hover:bg-gray-800 h-14 text-lg font-semibold transform hover:scale-105 transition-all duration-300">
                    Checkout Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                
                <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                  <Package className="h-4 w-4" />
                  <span>Secure Checkout • Free Returns</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}