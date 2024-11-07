'use client'
import { Home, ShoppingBag, Heart, User, X, Package } from "lucide-react"
import Link from "next/link"
import { useContext } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContext
} from "@/components/ui/sidebar"

// Add the logoStyles to match the header
const logoStyles = {
  fontFamily: 'Akira',
  letterSpacing: '0.2em',
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
}

// Add styles for navigation items
const navStyles = {
  fontFamily: 'Akira',
  letterSpacing: '0.1em',
  fontSize: '0.9rem'
}

const sidebarItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: ShoppingBag, label: "Products", href: "/products" },
  { icon: Heart, label: "Wishlist", href: "/wishlist" },
  { icon: User, label: "Profile", href: "/profile" },
  { icon: Package, label: "Cart", href: "/cart" },
]

export function AppSidebar() {
  const context = useContext(SidebarContext)

  if (!context) {
    throw new Error('AppSidebar must be used within a SidebarProvider')
  }

  const { setIsOpen } = context

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className="text-1xl tracking-wider hover:text-yellow-400 transition-colors uppercase"
            style={logoStyles}
          >
            DrippingDog
          </Link>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-yellow-400 hover:text-black rounded-md transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <div style={navStyles}>
              NAVIGATION
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    <Link 
                      href={item.href}
                      className="flex items-center hover:text-black transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      <span style={navStyles}>
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
} 