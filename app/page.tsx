import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="flex flex-1 flex-col gap-10">
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <p className="inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-orange-700 shadow-sm ring-1 ring-orange-100 backdrop-blur">
            New · RecipeShare MVP in progress
          </p>
          <div className="space-y-4">
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl lg:text-6xl">
              Share the recipes{" "}
              <span className="bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                your friends always ask for.
              </span>
            </h1>
            <p className="mx-auto max-w-xl text-balance text-base text-zinc-700 sm:text-lg">
              A community-driven recipe hub where home cooks and creators can
              publish dishes, discover new favorites, and save go-to meals in
              one beautiful place.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            >
              Get started with a recipe
            </Link>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full border border-orange-100 bg-white/80 px-6 py-2.5 text-sm font-medium text-orange-700 shadow-sm transition hover:border-orange-200 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            >
              Browse community dishes
            </button>
          </div>

          <dl className="mx-auto mt-4 flex max-w-2xl flex-wrap justify-center gap-6 text-xs text-zinc-600 sm:text-sm">
            <div>
              <dt className="font-medium text-zinc-900">For home cooks</dt>
              <dd>Save weeknight staples and special-occasion favorites.</dd>
            </div>
            <div>
              <dt className="font-medium text-zinc-900">For creators</dt>
              <dd>Publish, tag, and share recipes in minutes.</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Feature highlights */}
      <section className="mt-16 space-y-8 border-t border-orange-100 pt-10">
        <div className="space-y-2">
          <h2 className="text-base font-semibold tracking-tight text-zinc-900">
            Built for how you actually cook
          </h2>
          <p className="max-w-2xl text-sm text-zinc-600">
            This is the starting point for RecipeShare. Next, we&apos;ll connect
            Supabase for authentication, recipe storage, search, and favorites.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <FeatureCard
            title="Structured recipes"
            description="Ingredients, steps, and timing captured in a clean, readable layout."
          />
          <FeatureCard
            title="Smart discovery"
            description="Search by title or ingredients and filter by cuisine, time, or difficulty."
          />
          <FeatureCard
            title="Save your favorites"
            description="Soon you&apos;ll be able to bookmark go-to dishes from any creator."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-orange-100 pt-6 text-xs text-zinc-500">
        <p>RecipeShare · MVP UI only · Next.js + Tailwind</p>
        <p>Supabase integration coming in the next steps.</p>
      </footer>
    </>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
}

function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-col rounded-2xl border border-orange-100 bg-white/70 p-4 text-sm shadow-sm">
      <h3 className="mb-2 text-sm font-semibold text-zinc-900">{title}</h3>
      <p className="text-xs text-zinc-600">{description}</p>
    </div>
  );
}

