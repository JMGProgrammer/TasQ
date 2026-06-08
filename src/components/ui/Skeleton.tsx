export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-border ${className}`}
    />
  );
}

export function TaskItemSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-secondary/10 bg-white px-4 py-3">
      <Skeleton className="h-4 w-4 rounded" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="h-3 w-2/5" />
      </div>
      <Skeleton className="h-4 w-12" />
    </div>
  );
}
