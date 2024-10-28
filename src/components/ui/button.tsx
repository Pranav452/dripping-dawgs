import * as React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'outline' | 'default'
  size?: 'default' | 'icon'
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? 'span' : 'button'
    return (
      <Comp
        ref={ref}
        className={`inline-flex items-center justify-center rounded-md font-medium transition-colors
          ${size === 'icon' ? 'h-10 w-10' : 'px-4 py-2'}
          ${variant === 'outline' ? 'border border-input bg-background hover:bg-accent hover:text-accent-foreground' : 'bg-primary text-primary-foreground hover:bg-primary/90'}
          ${className}`}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
