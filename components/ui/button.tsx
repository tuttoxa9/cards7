import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all cursor-pointer disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-purple-400/50 aria-invalid:ring-red-500/30 aria-invalid:border-red-500",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg hover:from-purple-500 hover:to-purple-400 border border-purple-400/30 hover:shadow-xl hover:shadow-purple-500/20",
        destructive:
          "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg hover:from-red-500 hover:to-red-400 border border-red-400/30 hover:shadow-xl hover:shadow-red-500/20",
        outline:
          "border border-white/20 glass-strong text-white shadow-md hover:bg-white/20 hover:border-white/30 hover:shadow-lg",
        secondary:
          "glass text-white shadow-md hover:bg-white/10 border border-white/10",
        ghost:
          "text-white hover:bg-white/10 hover:text-white",
        link: "text-purple-400 underline-offset-4 hover:underline hover:text-purple-300",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-lg gap-1.5 px-3 has-[>svg]:px-2.5 text-xs",
        lg: "h-11 rounded-lg px-6 has-[>svg]:px-4 text-base",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
