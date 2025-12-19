import { createSupabaseServerClient } from "../../lib/supabaseServer";
import { RecipeGrid } from "../../components/recipes/recipe-grid";
import { RecipeCard } from "../../components/recipes/recipe-card";

export const metadata = {
  title: "Explore | RecipeShare",
  description: "Explore community recipes",
};

export default async function ExplorePage() {
  const supabase = await createSupabaseServerClient();
  const supabaseAny = supabase as any;

  const { data: recipes, error } = await supabaseAny
    .from("recipes")
    .select(
      "id, title, description, prep_time_minutes, cook_time_minutes, servings, difficulty, created_at, is_published, author_id"
    )
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(24);

  if (error) {
    console.error(error);
  }

  // Fetch author profiles separately
  const authorIds = recipes?.map((r: any) => r.author_id) || [];
  const { data: profiles } =
    authorIds.length > 0
      ? await supabase
          .from("profiles")
          .select("id, username, full_name")
          .in("id", authorIds)
      : { data: [] };

  // Create a map for quick lookup
  const profileMap = new Map(
    profiles?.map((p: any) => [p.id, p]) || []
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-zinc-900">Explore</h1>
        <p className="text-sm text-zinc-600">Latest recipes from the community.</p>
      </div>

      {recipes && recipes.length > 0 ? (
        <RecipeGrid>
          {recipes.map((recipe: any) => {
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
                  is_published: true,
                  created_at: recipe.created_at,
                  author: authorName,
                }}
                showAuthor
              />
            );
          })}
        </RecipeGrid>
      ) : (
        <div className="rounded-2xl border border-orange-100 bg-white/70 p-8 text-center">
          <p className="text-sm text-zinc-600">No recipes yet.</p>
        </div>
      )}
    </div>
  );
}


