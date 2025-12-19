import { createSupabaseServerClient } from "../../lib/supabaseServer";
import { redirect } from "next/navigation";
import Link from "next/link";
import { RecipeGrid } from "../../components/recipes/recipe-grid";
import { RecipeCard } from "../../components/recipes/recipe-card";

export const metadata = {
  title: "My recipes | RecipeShare",
  description: "Your recipes",
};

export default async function MyRecipesPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const supabaseAny = supabase as any;

  const { data, error } = await supabaseAny
    .from("recipes")
    .select(
      "id, title, description, prep_time_minutes, cook_time_minutes, servings, difficulty, created_at, is_published"
    )
    .eq("author_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-zinc-900">My recipes</h1>
          <p className="text-sm text-zinc-600">
            Drafts and published recipes you&apos;ve created.
          </p>
        </div>
        <Link
          href="/recipes/new"
          className="inline-flex items-center rounded-full bg-orange-500 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-orange-600"
        >
          + Create Recipe
        </Link>
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
                is_published: recipe.is_published,
                created_at: recipe.created_at,
              }}
              showAuthor={false}
            />
          ))}
        </RecipeGrid>
      ) : (
        <div className="rounded-2xl border border-orange-100 bg-white/70 p-8 text-center">
          <p className="text-sm text-zinc-600">
            You haven&apos;t created any recipes yet.
          </p>
        </div>
      )}
    </div>
  );
}


