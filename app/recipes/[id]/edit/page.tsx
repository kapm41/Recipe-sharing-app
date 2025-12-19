import { createSupabaseServerClient } from "../../../../lib/supabaseServer";
import { redirect } from "next/navigation";
import { EditRecipeForm } from "../../../../components/recipes/edit-recipe-form";

export const metadata = {
  title: "Edit recipe | RecipeShare",
  description: "Edit your recipe",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditRecipePage(props: PageProps) {
  const { id } = await props.params;
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const supabaseAny = supabase as any;

  const { data: recipe, error } = await supabaseAny
    .from("recipes")
    .select(
      "id, author_id, title, description, ingredients, instructions, prep_time_minutes, cook_time_minutes, servings, difficulty, is_published"
    )
    .eq("id", id)
    .single();

  if (error || !recipe) {
    redirect("/dashboard");
  }

  // Only the author can edit
  if (user.id !== recipe.author_id) {
    redirect(`/recipes/${id}`);
  }

  const { data: tagMaps } = await supabaseAny
    .from("recipe_tag_map")
    .select("tag_id")
    .eq("recipe_id", id);

  const tagIds = (tagMaps ?? []).map((m: any) => m.tag_id);

  const ingredients = Array.isArray(recipe.ingredients)
    ? (recipe.ingredients as string[])
    : [];
  const instructions = Array.isArray(recipe.instructions)
    ? (recipe.instructions as string[])
    : [];

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-zinc-900">Edit recipe</h1>
        <p className="text-sm text-zinc-600">
          Update your recipe details below.
        </p>
      </div>

      <EditRecipeForm
        recipeId={id}
        initialData={{
          title: recipe.title,
          description: recipe.description,
          ingredients,
          instructions,
          prep_time_minutes: recipe.prep_time_minutes,
          cook_time_minutes: recipe.cook_time_minutes,
          servings: recipe.servings,
          difficulty: recipe.difficulty as "Easy" | "Medium" | "Hard" | null,
          is_published: recipe.is_published,
        }}
        initialTagIds={tagIds}
      />
    </div>
  );
}

