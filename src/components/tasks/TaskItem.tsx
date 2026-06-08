"use client";

import { type Task } from "@/lib/types";
import { formatDate } from "@/lib/utils";

type Props = {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

const priorityLabel: Record<string, string> = {
  alta: "Alta",
  media: "Media",
  baja: "Baja",
};

const priorityColor: Record<string, string> = {
  alta: "text-danger bg-danger/10",
  media: "text-warning bg-warning/10",
  baja: "text-success bg-success/10",
};

export function TaskItem({ task, onToggle, onEdit, onDelete }: Props) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-bg-primary px-4 py-3">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={onToggle}
        className="mt-1 h-4 w-4 shrink-0 accent-primary cursor-pointer"
      />
      <div className="min-w-0 flex-1">
        <p
          className={`text-sm ${
            task.completed
              ? "text-secondary/40 line-through"
              : "text-secondary"
          }`}
        >
          {task.title}
        </p>
        {task.description && (
          <p className="mt-0.5 text-xs text-secondary/40 line-clamp-2">
            {task.description}
          </p>
        )}
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${priorityColor[task.priority] || "text-secondary/40 bg-secondary/10"}`}
          >
            {priorityLabel[task.priority] || task.priority}
          </span>
          {task.dueDate && (
            <span className="text-[10px] text-secondary/40">
              {formatDate(task.dueDate)}
            </span>
          )}
          {task.categories?.map((cat) => (
            <span
              key={cat}
              className="rounded-full bg-secondary/10 px-2 py-0.5 text-[10px] text-secondary/60"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>
      <div className="flex shrink-0 gap-1">
        <button
          onClick={onEdit}
          className="rounded px-1.5 py-1 text-xs text-secondary/40 hover:bg-secondary/10 hover:text-secondary transition-colors cursor-pointer"
        >
          Editar
        </button>
        <button
          onClick={onDelete}
          className="rounded px-1.5 py-1 text-xs text-danger/60 hover:bg-danger/10 hover:text-danger transition-colors cursor-pointer"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
