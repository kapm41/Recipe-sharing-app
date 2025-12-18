export function PageHeaderSkeleton() {
  return (
    <div className="space-y-2">
      <div className="h-9 w-64 animate-pulse rounded bg-zinc-200" />
      <div className="h-5 w-96 animate-pulse rounded bg-zinc-200" />
    </div>
  );
}

export function FilterSkeleton() {
  return (
    <div className="space-y-4 rounded-2xl border border-orange-100 bg-white/70 p-4 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <div className="h-4 w-16 animate-pulse rounded bg-zinc-200" />
          <div className="mt-1 h-10 w-full animate-pulse rounded-lg bg-zinc-200" />
        </div>
        <div>
          <div className="h-4 w-20 animate-pulse rounded bg-zinc-200" />
          <div className="mt-1 h-10 w-full animate-pulse rounded-lg bg-zinc-200" />
        </div>
        <div>
          <div className="h-4 w-24 animate-pulse rounded bg-zinc-200" />
          <div className="mt-1 h-10 w-full animate-pulse rounded-lg bg-zinc-200" />
        </div>
      </div>
    </div>
  );
}

