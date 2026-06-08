"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

const base =
  "inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-white hover:brightness-110",
  secondary: "bg-secondary/10 text-secondary hover:bg-secondary/20",
  danger: "bg-danger text-white hover:brightness-110",
  ghost: "hover:bg-secondary/10 text-secondary",
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ variant = "primary", className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
