import type { List as PrismaList, Task as PrismaTask } from "@/generated/prisma/client";

export type List = PrismaList;
export type Task = PrismaTask;

export type CreateListInput = {
  name: string;
  color?: string;
};

export type UpdateListInput = {
  name?: string;
  color?: string;
};

export type CreateTaskInput = {
  listId: string;
  title: string;
  description?: string;
  dueDate?: string | null;
  priority?: "alta" | "media" | "baja";
  categories?: string[];
};

export type UpdateTaskInput = {
  title?: string;
  description?: string;
  dueDate?: string | null;
  priority?: "alta" | "media" | "baja";
  categories?: string[];
  completed?: boolean;
};

export type TaskFilters = {
  listId?: string;
  priority?: "alta" | "media" | "baja";
  completed?: boolean;
};
