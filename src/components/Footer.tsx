import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Youtube, Twitter, Facebook, Mail, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image src="/LOGO.png" alt="DrippingDog Logo" width={200} height={60} className="dark:invert" />
            </Link>
            <p className="text-sm text-gray-400">
              Elevate your style with premium streetwear that speaks volumes. DrippingDog: Where fashion meets attitude.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <Instagram size={24} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <Youtube size={24} />
                <span className="sr-only">YouTube</span>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <Twitter size={24} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <Facebook size={24} />
                <span className="sr-only">Facebook</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:gap-4">
            <div>
              <h4 className="font-bold text-lg mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/new-arrivals" className="hover:text-primary transition-colors">New Arrivals</Link></li>
                <li><Link href="/best-sellers" className="hover:text-primary transition-colors">Best Sellers</Link></li>
                <li><Link href="/sale" className="hover:text-primary transition-colors">Sale</Link></li>
                <li><Link href="/collections" className="hover:text-primary transition-colors">Collections</Link></li>
                <li><Link href="/accessories" className="hover:text-primary transition-colors">Accessories</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
                <li><Link href="/shipping" className="hover:text-primary transition-colors">Shipping</Link></li>
                <li><Link href="/returns" className="hover:text-primary transition-colors">Returns</Link></li>
                <li><Link href="/size-guide" className="hover:text-primary transition-colors">Size Guide</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-2xl">GET IN TOUCH</h4>
            <p className="text-sm text-gray-400">Have questions or need assistance? We're here to help!</p>
            <Link 
              href="/contact" 
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-full text-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Contact Us <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <div className="mt-4">
              <h5 className="font-semibold mb-2">Stay Dripping</h5>
              <form className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Input type="email" placeholder="Enter your email" className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 flex-grow" />
                <Button type="submit" variant="secondary" className="w-full sm:w-auto">
                  <Mail className="mr-2 h-4 w-4" /> Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 text-center sm:text-left mb-4 sm:mb-0">
            &copy; {currentYear} DrippingDog. All rights reserved.
          </p>
          <div>
            <ul className="flex flex-wrap justify-center sm:justify-end space-x-4 text-sm text-gray-500">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
} 