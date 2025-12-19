import { createSupabaseServerClient } from "../../../lib/supabaseServer";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FavoriteButton } from "../../../components/recipes/favorite-button";
import { PublishButton } from "../../../components/recipes/publish-button";
import { LikeButton } from "../../../components/recipes/like-button";
import { CommentForm } from "../../../components/recipes/comment-form";
import { CommentList } from "../../../components/recipes/comment-list";

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
  const supabaseAny = supabase as any;

  const { data: recipe, error } = await supabaseAny
    .from("recipes")
    .select(
      "id, author_id, title, description, ingredients, instructions, prep_time_minutes, cook_time_minutes, servings, difficulty, is_published, created_at"
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
  const { data: authorProfile } = await supabaseAny
    .from("profiles")
    .select("username, full_name")
    .eq("id", recipe.author_id)
    .single();

  const { data: tagMaps } = await supabaseAny
    .from("recipe_tag_map")
    .select("tag_id")
    .eq("recipe_id", id);

  const tagIds = (tagMaps ?? []).map((m: any) => m.tag_id);
  const { data: tags } =
    tagIds.length === 0
      ? { data: [] }
      : await supabaseAny
          .from("recipe_tags")
          .select("id, name")
          .in("id", tagIds)
          .order("name", { ascending: true });

  const { data: favoriteRow } =
    user
      ? await supabaseAny
          .from("favorites")
          .select("id")
          .eq("user_id", user.id)
          .eq("recipe_id", id)
          .maybeSingle()
      : { data: null };

  // Get like count and user's like status
  const { count: likeCount } = await supabaseAny
    .from("recipe_likes")
    .select("*", { count: "exact", head: true })
    .eq("recipe_id", id);

  const { data: userLike } =
    user
      ? await supabaseAny
          .from("recipe_likes")
          .select("id")
          .eq("recipe_id", id)
          .eq("user_id", user.id)
          .maybeSingle()
      : { data: null };

  // Get comments
  const { data: comments } = await supabaseAny
    .from("recipe_comments")
    .select("id, content, created_at, updated_at, user_id")
    .eq("recipe_id", id)
    .order("created_at", { ascending: true });

  // Get profiles for comment authors
  const userIds = comments?.map((c: any) => c.user_id) || [];
  const { data: profiles } =
    userIds.length > 0
      ? await supabaseAny
          .from("profiles")
          .select("id, username, full_name")
          .in("id", userIds)
      : { data: [] };

  // Transform comments to match CommentList interface
  const formattedComments =
    comments?.map((comment: any) => {
      const profile = profiles?.find((p: any) => p.id === comment.user_id);
      return {
        id: comment.id,
        content: comment.content,
        created_at: comment.created_at,
        updated_at: comment.updated_at,
        user_id: comment.user_id,
        profile: {
          username: profile?.username || null,
          full_name: profile?.full_name || null,
        },
      };
    }) || [];

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
            <LikeButton
              recipeId={id}
              initialLikeCount={likeCount || 0}
              initialIsLiked={Boolean(userLike)}
              disabled={!user}
            />
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
            {tags.map((t: any) => (
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
            Log in to like, save, and comment on recipes.
          </p>
        )}
      </header>

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-orange-100 bg-white/70 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-900">Ingredients</h2>
          {ingredients.length > 0 ? (
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-700">
              {ingredients.map((item: string, idx: number) => (
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
              {instructions.map((step: string, idx: number) => (
                <li key={`${idx}-${step}`}>{step}</li>
              ))}
            </ol>
          ) : (
            <p className="mt-3 text-sm text-zinc-600">No instructions yet.</p>
          )}
        </div>
      </section>

      {/* Comments Section */}
      <section className="space-y-6 rounded-2xl border border-orange-100 bg-white/70 p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">
            Comments ({formattedComments.length})
          </h2>
        </div>

        {user ? (
          <CommentForm recipeId={id} />
        ) : (
          <div className="rounded-lg border border-orange-100 bg-orange-50/50 p-4 text-center">
            <p className="text-xs text-zinc-600">
              <Link
                href="/login"
                className="font-medium text-orange-600 hover:text-orange-700"
              >
                Log in
              </Link>{" "}
              to join the conversation
            </p>
          </div>
        )}

        <CommentList
          comments={formattedComments}
          currentUserId={user?.id || null}
          recipeId={id}
        />
      </section>
    </div>
  );
}


