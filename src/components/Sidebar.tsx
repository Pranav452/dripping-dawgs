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
            className="text-3xl font-normal tracking-wide hover:text-yellow-400 transition-colors font-dancing-script"
            style={{ fontFamily: 'Dancing Script, cursive' }}
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
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    <Link 
                      href={item.href}
                      className="flex items-center"
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      <span>{item.label}</span>
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