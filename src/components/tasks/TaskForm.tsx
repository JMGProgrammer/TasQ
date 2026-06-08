"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";

type TaskFormData = {
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  categories: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => Promise<void>;
  initial?: Partial<TaskFormData>;
  title: string;
};

export function TaskForm({ open, onClose, onSubmit, initial, title }: Props) {
  const [form, setForm] = useState<TaskFormData>({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    dueDate: initial?.dueDate ?? "",
    priority: initial?.priority ?? "media",
    categories: initial?.categories ?? "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      await onSubmit(form);
      setForm({ title: "", description: "", dueDate: "", priority: "media", categories: "" });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs text-secondary/60">Título *</label>
          <Input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            placeholder="¿Qué hay que hacer?"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-secondary/60">Descripción</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Detalles opcionales..."
            rows={3}
            className="w-full rounded-lg border border-border bg-bg-primary px-3 py-2 text-sm outline-none placeholder:text-secondary/40 focus:border-primary focus:ring-1 focus:ring-primary resize-none"
          />
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="mb-1 block text-xs text-secondary/60">Fecha límite</label>
            <Input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-xs text-secondary/60">Prioridad</label>
            <Select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </Select>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs text-secondary/60">
            Categorías (separadas por coma)
          </label>
          <Input
            value={form.categories}
            onChange={(e) => setForm({ ...form, categories: e.target.value })}
            placeholder="ej: frontend, bug"
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !form.title.trim()}
          >
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export type { TaskFormData };
