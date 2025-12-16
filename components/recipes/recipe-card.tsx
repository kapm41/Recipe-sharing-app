import Link from "next/link";

interface Recipe {
  id: string;
  title: string;
  description: string | null;
  prep_time_minutes: number | null;
  cook_time_minutes: number | null;
  servings: number | null;
  difficulty: "Easy" | "Medium" | "Hard" | null;
  is_published: boolean;
  created_at: string;
  author?: string;
}

interface RecipeCardProps {
  recipe: Recipe;
  showAuthor?: boolean;
}

export function RecipeCard({ recipe, showAuthor = true }: RecipeCardProps) {
  const difficultyColor =
    recipe.difficulty === "Easy"
      ? "bg-emerald-50 text-emerald-700"
      : recipe.difficulty === "Medium"
        ? "bg-amber-50 text-amber-700"
        : recipe.difficulty === "Hard"
          ? "bg-rose-50 text-rose-700"
          : "bg-zinc-50 text-zinc-700";

  const totalTime =
    (recipe.prep_time_minutes || 0) + (recipe.cook_time_minutes || 0);

  return (
    <Link
      href={`/recipes/${recipe.id}`}
      className="group block rounded-2xl border border-orange-100 bg-white/70 p-4 shadow-sm transition hover:border-orange-200 hover:shadow-md"
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="flex-1 text-base font-semibold text-zinc-900 group-hover:text-orange-600">
            {recipe.title}
          </h3>
          {recipe.difficulty && (
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${difficultyColor}`}
            >
              {recipe.difficulty}
            </span>
          )}
        </div>

        {recipe.description && (
          <p className="line-clamp-2 text-xs text-zinc-600">
            {recipe.description}
          </p>
        )}

        <div className="flex items-center gap-4 text-[11px] text-zinc-500">
          {totalTime > 0 && (
            <span className="flex items-center gap-1">
              <svg
                className="h-3 w-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {totalTime} min
            </span>
          )}
          {recipe.servings && (
            <span className="flex items-center gap-1">
              <svg
                className="h-3 w-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Serves {recipe.servings}
            </span>
          )}
        </div>

        {showAuthor && recipe.author && (
          <div className="flex items-center gap-2 border-t border-orange-100 pt-2">
            <span className="text-[10px] text-zinc-500">
              by <span className="font-medium text-zinc-700">{recipe.author}</span>
            </span>
          </div>
        )}

        {!recipe.is_published && (
          <div className="flex items-center gap-2 border-t border-orange-100 pt-2">
            <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
              Draft
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

