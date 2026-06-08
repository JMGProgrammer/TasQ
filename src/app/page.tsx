"use client";

import { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { useLists } from "@/hooks/useLists";
import { useTasks } from "@/hooks/useTasks";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { TaskFilters } from "@/components/tasks/TaskFilters";
import { TaskForm, type TaskFormData } from "@/components/tasks/TaskForm";
import { TaskList } from "@/components/tasks/TaskList";
import type { List, Task } from "@/lib/types";

export default function Home() {
  const toast = useToast();
  const { lists, activeList, setActiveList, fetchLists, createList, deleteList } =
    useLists();
  const { tasks, fetchTasks, createTask, updateTask, deleteTask, toggleComplete, isLoading: tasksLoading } =
    useTasks();

  const [priorityFilter, setPriorityFilter] = useState("");
  const [completedFilter, setCompletedFilter] = useState("");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "list" | "task";
    id: string;
  } | null>(null);

  const handleFetchTasks = useCallback(() => {
    fetchTasks({
      listId: activeList?.id,
      priority: (priorityFilter || undefined) as "alta" | "media" | "baja" | undefined,
      completed:
        completedFilter === "true"
          ? true
          : completedFilter === "false"
            ? false
            : undefined,
    });
  }, [fetchTasks, activeList?.id, priorityFilter, completedFilter]);

  const handleSelectList = (list: List) => {
    setActiveList(list);
    setPriorityFilter("");
    setCompletedFilter("");
  };

  const handleCreateTask = async (data: TaskFormData) => {
    if (!activeList) return;
    const categories = data.categories
      ? data.categories.split(",").map((c) => c.trim()).filter(Boolean)
      : [];
    await createTask({
      listId: activeList.id,
      title: data.title,
      description: data.description || undefined,
      dueDate: data.dueDate || null,
      priority: data.priority as "alta" | "media" | "baja",
      categories,
    });
    toast.show("Tarea creada", "success");
    handleFetchTasks();
  };

  const handleEditTask = async (data: TaskFormData) => {
    if (!editingTask) return;
    const categories = data.categories
      ? data.categories.split(",").map((c) => c.trim()).filter(Boolean)
      : [];
    await updateTask(editingTask.id, {
      title: data.title,
      description: data.description || undefined,
      dueDate: data.dueDate || null,
      priority: data.priority as "alta" | "media" | "baja",
      categories,
    });
    toast.show("Tarea actualizada", "success");
    setEditingTask(null);
    handleFetchTasks();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    try {
      if (deleteConfirm.type === "list") {
        await deleteList(deleteConfirm.id);
        toast.show("Lista eliminada", "success");
      } else {
        await deleteTask(deleteConfirm.id);
        toast.show("Tarea eliminada", "success");
        handleFetchTasks();
      }
    } catch {
      toast.show("Error al eliminar", "error");
    }
    setDeleteConfirm(null);
  };

  return (
    <>
      <AppLayout
        lists={lists}
        activeList={activeList}
        onSelectList={handleSelectList}
        onCreateList={async (name) => {
          try {
            await createList({ name });
            toast.show("Lista creada", "success");
          } catch {
            toast.show("Error al crear lista", "error");
          }
        }}
        onFetchLists={fetchLists}
      >
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-secondary">
              {activeList?.name}
            </h2>
            <div className="flex items-center gap-2">
              <Button onClick={() => setShowTaskForm(true)}>
                <Plus size={15} />
                Nueva tarea
              </Button>
              <Button
                variant="ghost"
                onClick={() =>
                  activeList &&
                  setDeleteConfirm({ type: "list", id: activeList.id })
                }
              >
                Eliminar lista
              </Button>
            </div>
          </div>

          <TaskFilters
            priority={priorityFilter}
            completed={completedFilter}
            onPriorityChange={(v) => { setPriorityFilter(v); setTimeout(handleFetchTasks, 0); }}
            onCompletedChange={(v) => { setCompletedFilter(v); setTimeout(handleFetchTasks, 0); }}
          />

          <TaskList
            tasks={tasks}
            loading={tasksLoading}
            onToggle={async (id, completed) => {
              await toggleComplete(id, completed);
              handleFetchTasks();
            }}
            onEdit={(task) => setEditingTask(task)}
            onDelete={(id) => setDeleteConfirm({ type: "task", id })}
          />
        </div>
      </AppLayout>

      <TaskForm
        open={showTaskForm}
        onClose={() => setShowTaskForm(false)}
        onSubmit={handleCreateTask}
        title="Nueva tarea"
      />

      {editingTask && (
        <TaskForm
          open
          onClose={() => setEditingTask(null)}
          onSubmit={handleEditTask}
          title="Editar tarea"
          initial={{
            title: editingTask.title,
            description: editingTask.description,
            dueDate: editingTask.dueDate
              ? editingTask.dueDate.toString().split("T")[0]
              : "",
            priority: editingTask.priority,
            categories: editingTask.categories?.join(", "),
          }}
        />
      )}

      <ConfirmModal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDeleteConfirm}
        title={
          deleteConfirm?.type === "list"
            ? "Eliminar lista"
            : "Eliminar tarea"
        }
        message={
          deleteConfirm?.type === "list"
            ? "Se eliminará la lista y todas sus tareas. ¿Estás seguro?"
            : "¿Estás seguro de eliminar esta tarea?"
        }
      />
    </>
  );
}
