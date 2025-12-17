import { createSupabaseServerClient } from "../../../lib/supabaseServer";
import { redirect } from "next/navigation";
import { CreateRecipeForm } from "../../../components/recipes/create-recipe-form";

export const metadata = {
  title: "Create recipe | RecipeShare",
  description: "Create and publish a new recipe",
};

export default async function NewRecipePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-zinc-900">
          Create a recipe
        </h1>
        <p className="text-sm text-zinc-600">
          Save as a draft or publish to the community.
        </p>
      </div>

      <CreateRecipeForm />
    </div>
  );
}


