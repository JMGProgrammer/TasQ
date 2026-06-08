"use client";

import type { Task } from "@/lib/types";
import { TaskItem } from "./TaskItem";
import { TaskItemSkeleton } from "@/components/ui/Skeleton";

type Props = {
  tasks: Task[];
  loading?: boolean;
  onToggle: (id: string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
};

export function TaskList({ tasks, loading, onToggle, onEdit, onDelete }: Props) {
  if (loading) {
    return (
      <div className="space-y-2">
        <TaskItemSkeleton />
        <TaskItemSkeleton />
        <TaskItemSkeleton />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-secondary/30">
        No hay tareas que mostrar
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={() => onToggle(task.id, task.completed)}
          onEdit={() => onEdit(task)}
          onDelete={() => onDelete(task.id)}
        />
      ))}
    </ul>
  );
}
