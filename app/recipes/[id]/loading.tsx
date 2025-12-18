export default function RecipeDetailLoading() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <header className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div className="h-9 w-3/4 animate-pulse rounded bg-zinc-200" />
            <div className="h-5 w-full animate-pulse rounded bg-zinc-200" />
          </div>
          <div className="flex gap-2">
            <div className="h-9 w-20 animate-pulse rounded-full bg-zinc-200" />
            <div className="h-9 w-20 animate-pulse rounded-full bg-zinc-200" />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="h-6 w-16 animate-pulse rounded-full bg-zinc-200" />
          <div className="h-5 w-32 animate-pulse rounded bg-zinc-200" />
          <div className="h-5 w-24 animate-pulse rounded bg-zinc-200" />
        </div>
      </header>

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-orange-100 bg-white/70 p-5 shadow-sm">
          <div className="h-6 w-24 animate-pulse rounded bg-zinc-200" />
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-zinc-200" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-200" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-zinc-200" />
          </div>
        </div>
        <div className="space-y-4 rounded-2xl border border-orange-100 bg-white/70 p-5 shadow-sm">
          <div className="h-6 w-28 animate-pulse rounded bg-zinc-200" />
          <div className="space-y-3">
            <div className="h-4 w-full animate-pulse rounded bg-zinc-200" />
            <div className="h-4 w-full animate-pulse rounded bg-zinc-200" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-200" />
          </div>
        </div>
      </section>
    </div>
  );
}

