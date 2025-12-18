import { createSupabaseServerClient } from "../../lib/supabaseServer";
import { redirect } from "next/navigation";
import { RecipeGrid } from "../../components/recipes/recipe-grid";
import { RecipeCard } from "../../components/recipes/recipe-card";

export const metadata = {
  title: "Saved recipes | RecipeShare",
  description: "Your saved recipes",
};

export default async function SavedPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: favorites, error } = await supabase
    .from("favorites")
    .select("recipe_id, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  }

  const recipeIds = (favorites ?? []).map((f) => f.recipe_id);

  // Fetch recipes
  const { data: recipes, error: recipesError } =
    recipeIds.length === 0
      ? { data: [], error: null }
      : await supabase
          .from("recipes")
          .select(
            "id, title, description, prep_time_minutes, cook_time_minutes, servings, difficulty, created_at, is_published, author_id"
          )
          .in("id", recipeIds)
          .order("created_at", { ascending: false });

  if (recipesError) {
    console.error("Error fetching saved recipes:", recipesError);
  }

  // Fetch author profiles
  const authorIds = recipes?.map((r) => r.author_id) || [];
  const { data: profiles } =
    authorIds.length > 0
      ? await supabase
          .from("profiles")
          .select("id, username, full_name")
          .in("id", authorIds)
      : { data: [] };

  // Create a map for quick lookup
  const profileMap = new Map(
    profiles?.map((p) => [p.id, p]) || []
  );

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-zinc-900">Saved Recipes</h1>
        <p className="text-sm text-zinc-600">
          Recipes you&apos;ve favorited and saved for later.
        </p>
      </div>

      {recipes && recipes.length > 0 ? (
        <RecipeGrid>
          {recipes.map((recipe) => {
            const author = profileMap.get(recipe.author_id);
            const authorName =
              author?.full_name || author?.username || "Anonymous";

            return (
              <RecipeCard
                key={recipe.id}
                recipe={{
                  id: recipe.id,
                  title: recipe.title,
                  description: recipe.description,
                  prep_time_minutes: recipe.prep_time_minutes,
                  cook_time_minutes: recipe.cook_time_minutes,
                  servings: recipe.servings,
                  difficulty: recipe.difficulty,
                  is_published: recipe.is_published,
                  created_at: recipe.created_at,
                  author: authorName,
                }}
                showAuthor={true}
              />
            );
          })}
        </RecipeGrid>
      ) : (
        <div className="rounded-2xl border border-orange-100 bg-white/70 p-8 text-center">
          <p className="text-sm text-zinc-600">
            You haven&apos;t saved any recipes yet. Start exploring and save
            your favorites!
          </p>
        </div>
      )}
    </div>
  );
}


