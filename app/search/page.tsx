import { createSupabaseServerClient } from "../../lib/supabaseServer";
import { redirect } from "next/navigation";
import { FilterableRecipeList } from "../../components/recipes/filterable-recipe-list";

export const metadata = {
  title: "Search Recipes | RecipeShare",
  description: "Search and filter recipes",
};

interface SearchRecipe {
  id: string;
  title: string;
  description: string | null;
  prep_time_minutes: number | null;
  cook_time_minutes: number | null;
  servings: number | null;
  difficulty: string | null;
  is_published: boolean;
  created_at: string;
  author_id: string;
}

async function getAllPublishedRecipes() {
  const supabase = await createSupabaseServerClient();
  const supabaseAny = supabase as any;

  const { data, error } = await supabaseAny
    .from("recipes")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }

  return (data || []) as SearchRecipe[];
}

export default async function SearchPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const recipes = await getAllPublishedRecipes();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-zinc-900">
          Search Recipes
        </h1>
        <p className="text-sm text-zinc-600">
          Find recipes by searching titles, descriptions, or filtering by
          difficulty and time.
        </p>
      </div>

      {/* Search and Filter */}
      <FilterableRecipeList
        recipes={recipes.map((recipe) => ({
          id: recipe.id,
          title: recipe.title,
          description: recipe.description,
          prep_time_minutes: recipe.prep_time_minutes,
          cook_time_minutes: recipe.cook_time_minutes,
          servings: recipe.servings,
          difficulty: recipe.difficulty,
          is_published: true,
          created_at: recipe.created_at,
        }))}
        showAuthor={false}
        showPublishedFilter={false}
        emptyMessage="No recipes match your search or filters. Try adjusting your criteria."
        initialEmptyMessage="No recipes available yet. Be the first to share!"
      />
    </div>
  );
}

