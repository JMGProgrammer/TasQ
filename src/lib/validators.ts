const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const HEX_COLOR_RE = /^#[0-9a-f]{6}$/i;
const PRIORITIES = ["alta", "media", "baja"] as const;

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export function validateString(
  value: unknown,
  field: string,
  min: number,
  max: number,
): ValidationResult<string> {
  if (typeof value !== "string") {
    return { success: false, error: `${field} debe ser un texto` };
  }
  if (value.length < min) {
    return {
      success: false,
      error: `${field} debe tener al menos ${min} caracteres`,
    };
  }
  if (value.length > max) {
    return {
      success: false,
      error: `${field} debe tener máximo ${max} caracteres`,
    };
  }
  return { success: true, data: value };
}

export function validateUuid(
  value: unknown,
  field: string,
): ValidationResult<string> {
  if (typeof value !== "string" || !UUID_RE.test(value)) {
    return { success: false, error: `${field} no es un UUID válido` };
  }
  return { success: true, data: value };
}

export function validatePriority(
  value: unknown,
  field: string,
): ValidationResult<string> {
  if (typeof value !== "string" || !PRIORITIES.includes(value as "alta" | "media" | "baja")) {
    return {
      success: false,
      error: `${field} debe ser uno de: ${PRIORITIES.join(", ")}`,
    };
  }
  return { success: true, data: value };
}

export function validateColor(
  value: unknown,
  field: string,
): ValidationResult<string> {
  if (typeof value !== "string" || !HEX_COLOR_RE.test(value)) {
    return {
      success: false,
      error: `${field} debe ser un color hex válido (#RRGGBB)`,
    };
  }
  return { success: true, data: value };
}

export function validateDate(
  value: unknown,
  field: string,
): ValidationResult<string | null> {
  if (value === null || value === undefined) {
    return { success: true, data: null };
  }
  if (typeof value !== "string") {
    return { success: false, error: `${field} debe ser una fecha ISO` };
  }
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return { success: false, error: `${field} no es una fecha válida` };
  }
  return { success: true, data: value };
}

export function validateCategories(
  value: unknown,
  field: string,
): ValidationResult<string[]> {
  if (!Array.isArray(value)) {
    return { success: false, error: `${field} debe ser un arreglo` };
  }
  if (value.length > 10) {
    return {
      success: false,
      error: `${field} debe tener máximo 10 elementos`,
    };
  }
  for (const item of value) {
    if (typeof item !== "string") {
      return {
        success: false,
        error: `Cada elemento de ${field} debe ser texto`,
      };
    }
    if (item.length > 50) {
      return {
        success: false,
        error: `Cada elemento de ${field} debe tener máximo 50 caracteres`,
      };
    }
  }
  return { success: true, data: value };
}

export function validateListInput(body: Record<string, unknown>) {
  const name = validateString(body.name, "name", 1, 100);
  if (!name.success) return name;

  if (body.color !== undefined) {
    const color = validateColor(body.color, "color");
    if (!color.success) return color;
  }

  return { success: true as const, data: { name: name.data, color: (body.color as string | undefined) ?? "#3B82F6" } };
}

export function validateUpdateListInput(body: Record<string, unknown>) {
  if (Object.keys(body).length === 0) {
    return { success: false as const, error: "Body no puede estar vacío" };
  }

  if (body.name !== undefined) {
    const name = validateString(body.name, "name", 1, 100);
    if (!name.success) return name;
  }
  if (body.color !== undefined) {
    const color = validateColor(body.color, "color");
    if (!color.success) return color;
  }

  return { success: true as const, data: body as { name?: string; color?: string } };
}

export function validateCreateTaskInput(body: Record<string, unknown>) {
  const listId = validateUuid(body.listId, "listId");
  if (!listId.success) return listId;

  const title = validateString(body.title, "title", 1, 200);
  if (!title.success) return title;

  if (body.description !== undefined) {
    const desc = validateString(body.description, "description", 0, 2000);
    if (!desc.success) return desc;
  }
  if (body.dueDate !== undefined) {
    const date = validateDate(body.dueDate, "dueDate");
    if (!date.success) return date;
  }
  if (body.priority !== undefined) {
    const priority = validatePriority(body.priority, "priority");
    if (!priority.success) return priority;
  }
  if (body.categories !== undefined) {
    const cats = validateCategories(body.categories, "categories");
    if (!cats.success) return cats;
  }

  return {
    success: true as const,
    data: {
      listId: listId.data,
      title: title.data,
      description: body.description as string | undefined,
      dueDate: body.dueDate as string | null | undefined,
      priority: body.priority as "alta" | "media" | "baja" | undefined,
      categories: body.categories as string[] | undefined,
    },
  };
}

export function validateUpdateTaskInput(body: Record<string, unknown>) {
  if (Object.keys(body).length === 0) {
    return { success: false as const, error: "Body no puede estar vacío" };
  }

  if (body.title !== undefined) {
    const title = validateString(body.title, "title", 1, 200);
    if (!title.success) return title;
  }
  if (body.description !== undefined) {
    const desc = validateString(body.description, "description", 0, 2000);
    if (!desc.success) return desc;
  }
  if (body.dueDate !== undefined) {
    const date = validateDate(body.dueDate, "dueDate");
    if (!date.success) return date;
  }
  if (body.priority !== undefined) {
    const priority = validatePriority(body.priority, "priority");
    if (!priority.success) return priority;
  }
  if (body.completed !== undefined) {
    if (typeof body.completed !== "boolean") {
      return { success: false as const, error: "completed debe ser booleano" };
    }
  }
  if (body.categories !== undefined) {
    const cats = validateCategories(body.categories, "categories");
    if (!cats.success) return cats;
  }

  return {
    success: true as const,
    data: body as {
      title?: string;
      description?: string;
      dueDate?: string | null;
      priority?: "alta" | "media" | "baja";
      categories?: string[];
      completed?: boolean;
    },
  };
}
