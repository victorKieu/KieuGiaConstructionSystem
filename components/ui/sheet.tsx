"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-white p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  },
)

interface SheetProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof sheetVariants> {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const Sheet = React.forwardRef<HTMLDivElement, SheetProps>(
  ({ className, children, side = "right", open, onOpenChange, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(open || false)

    React.useEffect(() => {
      if (open !== undefined) {
        setIsOpen(open)
      }
    }, [open])

    const handleOpenChange = (value: boolean) => {
      setIsOpen(value)
      onOpenChange?.(value)
    }

    return (
      <>
        {isOpen && <div className="fixed inset-0 z-50 bg-black/20" onClick={() => handleOpenChange(false)} />}
        <div
          ref={ref}
          data-state={isOpen ? "open" : "closed"}
          className={cn(sheetVariants({ side }), className)}
          {...props}
          style={{
            display: isOpen ? "flex" : "none",
            flexDirection: "column",
            ...props.style,
          }}
        >
          {children}
        </div>
      </>
    )
  },
)
Sheet.displayName = "Sheet"

const SheetTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ onClick, asChild, children, ...props }, ref) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      ref,
      onClick: (e: React.MouseEvent) => {
        handleClick(e as React.MouseEvent<HTMLButtonElement>)
        if (typeof children.props.onClick === "function") {
          children.props.onClick(e)
        }
      },
    })
  }

  return (
    <button ref={ref} onClick={handleClick} {...props}>
      {children}
    </button>
  )
})
SheetTrigger.displayName = "SheetTrigger"

const SheetContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col overflow-auto", className)} {...props}>
      {children}
    </div>
  ),
)
SheetContent.displayName = "SheetContent"

const SheetHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
  ),
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
      {...props}
    />
  ),
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-lg font-semibold text-foreground", className)} {...props} />
  ),
)
SheetTitle.displayName = "SheetTitle"

const SheetDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
)
SheetDescription.displayName = "SheetDescription"

export { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription }
