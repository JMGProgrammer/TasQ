"use client";

import { useState, useEffect, createContext, useContext, type ReactNode, useCallback } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

type ToastType = "success" | "error";

type ToastData = {
  id: number;
  message: string;
  type: ToastType;
};

type ToastContext = {
  show: (message: string, type?: ToastType) => void;
};

const Ctx = createContext<ToastContext | null>(null);

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const show = useCallback((message: string, type: ToastType = "success") => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const remove = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <Ctx.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={remove} />
        ))}
      </div>
    </Ctx.Provider>
  );
}

function ToastItem({ toast, onRemove }: { toast: ToastData; onRemove: (id: number) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 3000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const Icon = toast.type === "success" ? CheckCircle : XCircle;
  const colors =
    toast.type === "success"
      ? "border-success/30 bg-success/10 text-success"
      : "border-danger/30 bg-danger/10 text-danger";

  return (
    <div
      className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm shadow-sm ${colors}`}
    >
      <Icon size={16} />
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToast debe usarse dentro de ToastProvider");
  return ctx;
}
