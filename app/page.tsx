export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="flex flex-1 flex-col gap-10 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-6">
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
            <p className="max-w-xl text-balance text-base text-zinc-700 sm:text-lg">
              A community-driven recipe hub where home cooks and creators can
              publish dishes, discover new favorites, and save go-to meals in
              one beautiful place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            >
              Get started with a recipe
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full border border-orange-100 bg-white/80 px-6 py-2.5 text-sm font-medium text-orange-700 shadow-sm transition hover:border-orange-200 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            >
              Browse community dishes
            </button>
            <p className="w-full text-xs text-zinc-500 sm:w-auto">
              No account yet – Supabase auth coming next.
            </p>
          </div>

          <dl className="mt-4 flex flex-wrap gap-6 text-xs text-zinc-600 sm:text-sm">
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

        {/* Preview panel */}
        <div className="mt-10 flex flex-1 justify-center lg:mt-0 lg:justify-end">
          <div className="w-full max-w-md rounded-3xl bg-white/90 p-4 shadow-xl ring-1 ring-orange-100 backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-900">
                Sample recipes
              </h2>
              <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-600">
                Draft UI
              </span>
            </div>
            <div className="grid gap-3">
              <RecipeCard
                title="One-Pot Creamy Tuscan Pasta"
                difficulty="Easy"
                prepTime="15 min"
                tags={["Weeknight", "Comfort"]}
              />
              <RecipeCard
                title="Charred Miso Salmon Bowls"
                difficulty="Medium"
                prepTime="25 min"
                tags={["Meal prep", "High protein"]}
              />
              <RecipeCard
                title="Small-Batch Brown Butter Cookies"
                difficulty="Easy"
                prepTime="20 min"
                tags={["Baking", "Dessert"]}
              />
            </div>
          </div>
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

interface RecipeCardProps {
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  prepTime: string;
  tags: string[];
}

function RecipeCard({ title, difficulty, prepTime, tags }: RecipeCardProps) {
  const difficultyColor =
    difficulty === "Easy"
      ? "bg-emerald-50 text-emerald-700"
      : difficulty === "Medium"
        ? "bg-amber-50 text-amber-700"
        : "bg-rose-50 text-rose-700";

  return (
    <article className="rounded-2xl border border-orange-100 bg-orange-50/60 p-3 text-xs shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${difficultyColor}`}
        >
          {difficulty}
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-600">
        <p>Prep {prepTime}</p>
        <p className="text-zinc-500">Serves 2–4</p>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-medium text-orange-700"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
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

