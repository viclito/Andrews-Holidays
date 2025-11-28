"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-primary-600 text-white shadow-lg shadow-primary-600/20 hover:bg-primary-500 focus-visible:ring-primary-500",
        secondary:
          "bg-white text-primary-700 border border-primary-100 hover:bg-primary-50 focus-visible:ring-primary-200",
        outline:
          "border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 focus-visible:ring-slate-200",
        ghost: "text-slate-700 hover:bg-slate-100",
      },
      size: {
        xs: "h-8 px-3",
        sm: "h-9 px-4",
        md: "h-11 px-5",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

