"use client";

import { useState, useCallback } from "react";
import type { Task, CreateTaskInput, UpdateTaskInput, TaskFilters } from "@/lib/types";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTasks = useCallback(async (filters?: TaskFilters) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters?.listId) params.set("listId", filters.listId);
      if (filters?.priority) params.set("priority", filters.priority);
      if (filters?.completed !== undefined)
        params.set("completed", String(filters.completed));
      const qs = params.toString();
      const res = await fetch(`/api/tasks${qs ? `?${qs}` : ""}`);
      if (res.ok) {
        const data: Task[] = await res.json();
        setTasks(data);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTask = useCallback(async (input: CreateTaskInput) => {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error(await res.text());
    const task: Task = await res.json();
    setTasks((prev) => [task, ...prev]);
    return task;
  }, []);

  const updateTask = useCallback(
    async (id: string, input: UpdateTaskInput) => {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error(await res.text());
      const updated: Task = await res.json();
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      return updated;
    },
    [],
  );

  const deleteTask = useCallback(async (id: string) => {
    const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(await res.text());
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleComplete = useCallback(
    async (id: string, current: boolean) => {
      return updateTask(id, { completed: !current });
    },
    [updateTask],
  );

  return {
    tasks,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete,
    isLoading,
  };
}
