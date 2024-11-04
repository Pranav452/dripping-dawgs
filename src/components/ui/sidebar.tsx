"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"

export const SidebarContext = React.createContext<{
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}>({
  isOpen: false,
  setIsOpen: () => null,
})

export function SidebarProvider({
  children,
  defaultOpen = false,
}: {
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function Sidebar({ children }: { children: React.ReactNode }) {
  const { isOpen, setIsOpen } = React.useContext(SidebarContext)

  const handleBackdropClick = () => {
    setIsOpen(false)
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
      )}
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-black text-white transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {children}
      </div>
    </>
  )
}

export function SidebarTrigger({ children, className, ...props }: React.ComponentProps<"button">) {
  const { setIsOpen } = React.useContext(SidebarContext)

  return (
    <button
      onClick={() => setIsOpen(true)}
      className={cn("focus:outline-none", className)}
      {...props}
    >
      {children}
    </button>
  )
}

export function SidebarHeader({ children }: { children: React.ReactNode }) {
  return <div className="p-6 border-b border-gray-800">{children}</div>
}

export function SidebarContent({ children }: { children: React.ReactNode }) {
  return <div className="p-6">{children}</div>
}

export function SidebarGroup({ children }: { children: React.ReactNode }) {
  return <div className="space-y-4">{children}</div>
}

export function SidebarGroupLabel({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">{children}</h3>
}

export function SidebarGroupContent({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1">{children}</div>
}

export function SidebarMenu({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1">{children}</div>
}

export function SidebarMenuItem({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

export function SidebarMenuButton({
  children,
  className,
  asChild = false,
  ...props
}: {
  children: React.ReactNode
  className?: string
  asChild?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const Comp = asChild ? Slot : "button"
  
  return (
    <Comp
      className={cn(
        "flex w-full items-center rounded-md px-4 py-2.5 text-sm font-medium transition-colors",
        "hover:bg-yellow-400 hover:text-black",
        "focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  )
}
