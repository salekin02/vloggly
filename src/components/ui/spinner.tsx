import * as React from "react"
import { cn } from "@/lib/utils"
import { type VariantProps, cva } from "class-variance-authority"

const spinnerVariants = cva("inline-block rounded-full border-current animate-spin align-middle", {
    variants: {
        variant: {
            default: "text-muted-foreground/70",
            primary: "text-primary",
            destructive: "text-destructive",
        },
        size: {
            default: "size-4 border-2 border-t-primary",
            sm: "size-3 border border-t-primary",
            lg: "size-6 border-2 border-t-primary",
            xl: "size-8 border-3 border-t-primary",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "default",
    },
})

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof spinnerVariants> {
    label?: string
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
    ({ className, variant, size, label = "Loading...", ...props }, ref) => {
        return (
            <div ref={ref} role="status" className={cn("relative", className)} {...props}>
                <div className={cn(spinnerVariants({ variant, size }))} />
                <span className="sr-only">{label}</span>
            </div>
        )
    },
)
Spinner.displayName = "Spinner"

export { Spinner, spinnerVariants }

