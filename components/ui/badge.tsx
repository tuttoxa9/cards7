import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:ring-2 focus-visible:ring-purple-400/50 transition-all overflow-hidden shadow-md",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-purple-600 to-purple-500 text-white border-purple-400/30 [a&]:hover:from-purple-500 [a&]:hover:to-purple-400 shadow-lg",
        secondary:
          "glass text-white border-white/20 [a&]:hover:bg-white/20",
        destructive:
          "bg-gradient-to-r from-red-600 to-red-500 text-white border-red-400/30 [a&]:hover:from-red-500 [a&]:hover:to-red-400 shadow-lg",
        outline:
          "text-white border-white/30 glass [a&]:hover:bg-white/10 [a&]:hover:border-white/40",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
