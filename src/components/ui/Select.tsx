"use client";

import { forwardRef, type SelectHTMLAttributes } from "react";

type Props = SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, Props>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`w-full rounded-lg border border-border bg-bg-primary px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary ${className}`}
        {...props}
      >
        {children}
      </select>
    );
  },
);

Select.displayName = "Select";
