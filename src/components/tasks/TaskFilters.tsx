"use client";

import { Select } from "@/components/ui/Select";

type Props = {
  priority: string;
  completed: string;
  onPriorityChange: (value: string) => void;
  onCompletedChange: (value: string) => void;
};

export function TaskFilters({
  priority,
  completed,
  onPriorityChange,
  onCompletedChange,
}: Props) {
  return (
    <div className="flex items-center gap-3">
      <Select
        value={priority}
        onChange={(e) => onPriorityChange(e.target.value)}
      >
        <option value="">Todas las prioridades</option>
        <option value="alta">Alta</option>
        <option value="media">Media</option>
        <option value="baja">Baja</option>
      </Select>
      <Select
        value={completed}
        onChange={(e) => onCompletedChange(e.target.value)}
      >
        <option value="">Todos los estados</option>
        <option value="false">Pendientes</option>
        <option value="true">Completadas</option>
      </Select>
    </div>
  );
}
