export default function ProfileLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="h-9 w-32 animate-pulse rounded bg-zinc-200" />
        <div className="h-5 w-96 animate-pulse rounded bg-zinc-200" />
      </div>
      <div className="space-y-4 rounded-2xl border border-orange-100 bg-white/70 p-6 shadow-sm">
        <div className="h-4 w-16 animate-pulse rounded bg-zinc-200" />
        <div className="h-5 w-64 animate-pulse rounded bg-zinc-200" />
        <div className="h-4 w-20 animate-pulse rounded bg-zinc-200" />
        <div className="h-5 w-48 animate-pulse rounded bg-zinc-200" />
      </div>
      <div className="space-y-4">
        <div className="h-6 w-32 animate-pulse rounded bg-zinc-200" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-24 w-full animate-pulse rounded-2xl bg-zinc-200" />
          <div className="h-24 w-full animate-pulse rounded-2xl bg-zinc-200" />
        </div>
      </div>
    </div>
  );
}

