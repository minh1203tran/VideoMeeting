import React from "react"

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive"
  size?: "default" | "lg" | "sm" | "icon"
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"

    const variantStyles = {
      default: "bg-primary hover:bg-primary/90 text-primary-foreground",
      outline: "border border-border bg-transparent hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      destructive: "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
    }

    const sizeStyles = {
      default: "h-9 px-4 py-2",
      lg: "h-10 px-6 py-2",
      sm: "h-8 px-3 py-1 text-xs",
      icon: "h-9 w-9 p-0",
    }

    return (
      <button ref={ref} className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)} {...props} />
    )
  },
)

Button.displayName = "Button"
