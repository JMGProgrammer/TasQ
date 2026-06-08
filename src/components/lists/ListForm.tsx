"use client";

import { useState, useRef } from "react";
import { Plus } from "lucide-react";

type Props = {
  onCreate: (name: string) => Promise<void>;
};

export function ListForm({ onCreate }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setLoading(true);
    try {
      await onCreate(trimmed);
      setName("");
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  if (!open) {
    return (
      <button
        onClick={handleOpen}
        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-secondary/60 hover:bg-secondary/10 hover:text-secondary transition-colors cursor-pointer"
      >
        <Plus size={16} />
        Nueva lista
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3">
      <input
        ref={inputRef}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit();
          if (e.key === "Escape") {
            setOpen(false);
            setName("");
          }
        }}
        onBlur={() => {
          if (!name.trim()) setOpen(false);
        }}
        placeholder="Nombre de la lista"
        disabled={loading}
        className="min-w-0 flex-1 rounded-lg border border-primary/30 bg-bg-primary px-2.5 py-1.5 text-sm outline-none focus:border-primary"
      />
      <button
        onClick={handleSubmit}
        disabled={loading || !name.trim()}
        className="rounded-lg bg-primary px-2.5 py-1.5 text-xs text-white transition-colors hover:brightness-110 disabled:opacity-50 cursor-pointer"
      >
        {loading ? "..." : "Crear"}
      </button>
    </div>
  );
}
