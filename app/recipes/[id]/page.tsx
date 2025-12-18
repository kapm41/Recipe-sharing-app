import { createSupabaseServerClient } from "../../../lib/supabaseServer";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FavoriteButton } from "../../../components/recipes/favorite-button";
import { PublishButton } from "../../../components/recipes/publish-button";

export const metadata = {
  title: "Recipe | RecipeShare",
  description: "View recipe details",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RecipeDetailPage(props: PageProps) {
  const { id } = await props.params;
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Allow viewing published recipes without auth, but favorites require auth.
  const { data: recipe, error } = await supabase
    .from("recipes")
    .select(
      `
      id,
      author_id,
      title,
      description,
      ingredients,
      instructions,
      prep_time_minutes,
      cook_time_minutes,
      servings,
      difficulty,
      is_published,
      created_at
    `,
    )
    .eq("id", id)
    .single();

  if (error || !recipe) {
    redirect("/dashboard");
  }

  // If the recipe is a draft, only the author can view it
  if (!recipe.is_published && (!user || user.id !== recipe.author_id)) {
    redirect("/dashboard");
  }

  // Get author profile
  const { data: authorProfile } = await supabase
    .from("profiles")
    .select("username, full_name")
    .eq("id", recipe.author_id)
    .single();

  const { data: tagMaps } = await supabase
    .from("recipe_tag_map")
    .select("tag_id")
    .eq("recipe_id", id);

  const tagIds = (tagMaps ?? []).map((m) => m.tag_id);
  const { data: tags } =
    tagIds.length === 0
      ? { data: [] }
      : await supabase
          .from("recipe_tags")
          .select("id, name")
          .in("id", tagIds)
          .order("name", { ascending: true });

  const { data: favoriteRow } =
    user
      ? await supabase
          .from("favorites")
          .select("id")
          .eq("user_id", user.id)
          .eq("recipe_id", id)
          .maybeSingle()
      : { data: null };

  const ingredients = Array.isArray(recipe.ingredients)
    ? (recipe.ingredients as string[])
    : [];
  const instructions = Array.isArray(recipe.instructions)
    ? (recipe.instructions as string[])
    : [];

  const totalTime =
    (recipe.prep_time_minutes ?? 0) + (recipe.cook_time_minutes ?? 0);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <header className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-zinc-900">
              {recipe.title}
            </h1>
            {recipe.description && (
              <p className="text-sm text-zinc-600">{recipe.description}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {user && user.id === recipe.author_id && (
              <>
                {!recipe.is_published && <PublishButton recipeId={id} />}
                <Link
                  href={`/recipes/${id}/edit`}
                  className="inline-flex items-center rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-xs font-medium text-orange-700 shadow-sm transition hover:border-orange-300 hover:bg-white"
                >
                  Edit
                </Link>
              </>
            )}
            <FavoriteButton
              recipeId={id}
              initialIsFavorited={Boolean(favoriteRow)}
              disabled={!user}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-600">
          {recipe.difficulty && (
            <span className="rounded-full bg-zinc-50 px-2 py-1 text-zinc-700 ring-1 ring-zinc-200">
              {recipe.difficulty}
            </span>
          )}
          {totalTime > 0 && <span>Total time: {totalTime} min</span>}
          {recipe.servings && <span>Serves: {recipe.servings}</span>}
          {!recipe.is_published && (
            <span className="rounded-full bg-amber-50 px-2 py-1 text-amber-700 ring-1 ring-amber-200">
              Draft
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
          <span>
            By{" "}
            <span className="font-medium text-zinc-700">
              {authorProfile?.full_name ||
                authorProfile?.username ||
                "Anonymous"}
            </span>
          </span>
          <span>•</span>
          <span>
            Created{" "}
            {new Date(recipe.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {tags.map((t) => (
              <span
                key={t.id}
                className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-orange-700 ring-1 ring-orange-100"
              >
                {t.name}
              </span>
            ))}
          </div>
        )}

        {!user && (
          <p className="text-xs text-zinc-500">
            Log in to save this recipe to your favorites.
          </p>
        )}
      </header>

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-orange-100 bg-white/70 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-900">Ingredients</h2>
          {ingredients.length > 0 ? (
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-700">
              {ingredients.map((item, idx) => (
                <li key={`${idx}-${item}`}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-zinc-600">No ingredients yet.</p>
          )}
        </div>

        <div className="rounded-2xl border border-orange-100 bg-white/70 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-900">Instructions</h2>
          {instructions.length > 0 ? (
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-zinc-700">
              {instructions.map((step, idx) => (
                <li key={`${idx}-${step}`}>{step}</li>
              ))}
            </ol>
          ) : (
            <p className="mt-3 text-sm text-zinc-600">No instructions yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}


