"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full rounded-lg border border-border bg-bg-primary px-3 py-2 text-sm outline-none placeholder:text-secondary/40 focus:border-primary focus:ring-1 focus:ring-primary ${className}`}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
