export default function NewRecipeLoading() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div className="space-y-2">
        <div className="h-9 w-48 animate-pulse rounded bg-zinc-200" />
        <div className="h-5 w-96 animate-pulse rounded bg-zinc-200" />
      </div>
      <div className="space-y-6 rounded-2xl border border-orange-100 bg-white/70 p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <div className="h-4 w-16 animate-pulse rounded bg-zinc-200" />
            <div className="mt-1 h-10 w-full animate-pulse rounded-lg bg-zinc-200" />
          </div>
          <div className="sm:col-span-2">
            <div className="h-4 w-24 animate-pulse rounded bg-zinc-200" />
            <div className="mt-1 h-24 w-full animate-pulse rounded-lg bg-zinc-200" />
          </div>
          <div>
            <div className="h-4 w-20 animate-pulse rounded bg-zinc-200" />
            <div className="mt-1 h-10 w-full animate-pulse rounded-lg bg-zinc-200" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <div className="h-4 w-12 animate-pulse rounded bg-zinc-200" />
              <div className="mt-1 h-10 w-full animate-pulse rounded-lg bg-zinc-200" />
            </div>
            <div>
              <div className="h-4 w-12 animate-pulse rounded bg-zinc-200" />
              <div className="mt-1 h-10 w-full animate-pulse rounded-lg bg-zinc-200" />
            </div>
            <div>
              <div className="h-4 w-16 animate-pulse rounded bg-zinc-200" />
              <div className="mt-1 h-10 w-full animate-pulse rounded-lg bg-zinc-200" />
            </div>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className="h-4 w-20 animate-pulse rounded bg-zinc-200" />
            <div className="mt-1 h-40 w-full animate-pulse rounded-lg bg-zinc-200" />
          </div>
          <div>
            <div className="h-4 w-24 animate-pulse rounded bg-zinc-200" />
            <div className="mt-1 h-40 w-full animate-pulse rounded-lg bg-zinc-200" />
          </div>
        </div>
        <div className="h-10 w-32 animate-pulse rounded-full bg-zinc-200" />
      </div>
    </div>
  );
}

