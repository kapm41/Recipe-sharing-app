export function RecipeCardSkeleton() {
  return (
    <div className="rounded-2xl border border-orange-100 bg-white/70 p-4 shadow-sm">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="h-5 w-3/4 animate-pulse rounded bg-zinc-200" />
          <div className="h-5 w-16 animate-pulse rounded-full bg-zinc-200" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-zinc-200" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-zinc-200" />
        </div>
        <div className="flex items-center gap-4">
          <div className="h-3 w-16 animate-pulse rounded bg-zinc-200" />
          <div className="h-3 w-20 animate-pulse rounded bg-zinc-200" />
        </div>
      </div>
    </div>
  );
}

export function RecipeGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <RecipeCardSkeleton key={i} />
      ))}
    </div>
  );
}

