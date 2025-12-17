import { createSupabaseServerClient } from "../../lib/supabaseServer";
import { RecipeGrid } from "../../components/recipes/recipe-grid";
import { RecipeCard } from "../../components/recipes/recipe-card";

export const metadata = {
  title: "Explore | RecipeShare",
  description: "Explore community recipes",
};

export default async function ExplorePage() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("recipes")
    .select(
      `
      id,
      title,
      description,
      prep_time_minutes,
      cook_time_minutes,
      servings,
      difficulty,
      created_at,
      is_published,
      author_id,
      profiles:author_id (username)
    `,
    )
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(24);

  if (error) {
    console.error(error);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-zinc-900">Explore</h1>
        <p className="text-sm text-zinc-600">Latest recipes from the community.</p>
      </div>

      {data && data.length > 0 ? (
        <RecipeGrid>
          {data.map((recipe: any) => (
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
                author: recipe.profiles?.username || "Anonymous",
              }}
              showAuthor
            />
          ))}
        </RecipeGrid>
      ) : (
        <div className="rounded-2xl border border-orange-100 bg-white/70 p-8 text-center">
          <p className="text-sm text-zinc-600">No recipes yet.</p>
        </div>
      )}
    </div>
  );
}


