"use client";

import { type ReactNode } from "react";

type Props = {
  active?: boolean;
  color: string;
  children: ReactNode;
  onClick: () => void;
};

export function ListNavItem({ active, color, children, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors cursor-pointer ${
        active
          ? "bg-primary/10 text-primary font-medium"
          : "text-secondary hover:bg-secondary/10"
      }`}
    >
      <span
        className="h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="truncate">{children}</span>
    </button>
  );
}
