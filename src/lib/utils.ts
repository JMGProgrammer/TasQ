export function formatDate(date: Date | string | null): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("es-AR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function isOverdue(date: Date | string | null): boolean {
  if (!date) return false;
  const d = typeof date === "string" ? new Date(date) : date;
  return d < new Date();
}

export function sortByPriority(
  tasks: { priority: string }[],
): { priority: string }[] {
  const order: Record<string, number> = { alta: 0, media: 1, baja: 2 };
  return [...tasks].sort(
    (a, b) => (order[a.priority] ?? 1) - (order[b.priority] ?? 1),
  );
}
