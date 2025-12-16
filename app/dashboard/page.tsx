import { createSupabaseServerClient } from "../../lib/supabaseServer";
import { redirect } from "next/navigation";
import Link from "next/link";
import { RecipeGrid } from "../../components/recipes/recipe-grid";
import { RecipeCard } from "../../components/recipes/recipe-card";

export const metadata = {
  title: "Dashboard | RecipeShare",
  description: "Your RecipeShare dashboard",
};

async function getPublishedRecipes() {
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
      author_id,
      profiles:author_id (
        username
      )
    `
    )
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(12);

  if (error) {
    console.error("Error fetching published recipes:", error);
    return [];
  }

  return data || [];
}

async function getUserRecipes(userId: string) {
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
      is_published,
      created_at
    `
    )
    .eq("author_id", userId)
    .order("created_at", { ascending: false })
    .limit(12);

  if (error) {
    console.error("Error fetching user recipes:", error);
    return [];
  }

  return data || [];
}

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [publishedRecipes, userRecipes] = await Promise.all([
    getPublishedRecipes(),
    getUserRecipes(user.id),
  ]);

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-zinc-900">Dashboard</h1>
        <p className="text-sm text-zinc-600">
          Discover recipes from the community and manage your own creations
        </p>
      </div>

      {/* User's Recipes Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-zinc-900">My Recipes</h2>
          <Link
            href="/recipes/new"
            className="inline-flex items-center rounded-full bg-orange-500 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-orange-600"
          >
            + Create Recipe
          </Link>
        </div>
        {userRecipes.length > 0 ? (
          <RecipeGrid>
            {userRecipes.map((recipe) => (
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
              You haven&apos;t created any recipes yet.{" "}
              <Link
                href="/recipes/new"
                className="font-medium text-orange-600 hover:text-orange-700"
              >
                Create your first recipe
              </Link>
            </p>
          </div>
        )}
      </section>

      {/* Community Recipes Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-zinc-900">
          Community Recipes
        </h2>
        {publishedRecipes.length > 0 ? (
          <RecipeGrid>
            {publishedRecipes.map((recipe: any) => (
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
                showAuthor={true}
              />
            ))}
          </RecipeGrid>
        ) : (
          <div className="rounded-2xl border border-orange-100 bg-white/70 p-8 text-center">
            <p className="text-sm text-zinc-600">
              No recipes from the community yet. Be the first to share!
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

