"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Difficulty = "Easy" | "Medium" | "Hard";

interface RecipeTagRow {
  id: number;
  name: string;
}

function normalizeTagName(input: string) {
  return input.trim().replace(/\s+/g, " ");
}

export function CreateRecipeForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("Easy");
  const [prepTime, setPrepTime] = useState<number | "">("");
  const [cookTime, setCookTime] = useState<number | "">("");
  const [servings, setServings] = useState<number | "">("");

  const [ingredientsText, setIngredientsText] = useState("");
  const [instructionsText, setInstructionsText] = useState("");

  const [isPublished, setIsPublished] = useState(false);

  const [allTags, setAllTags] = useState<RecipeTagRow[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [newTagInput, setNewTagInput] = useState("");

  const ingredients = useMemo(() => {
    return ingredientsText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
  }, [ingredientsText]);

  const instructions = useMemo(() => {
    return instructionsText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
  }, [instructionsText]);

  useEffect(() => {
    let isMounted = true;

    async function loadTags() {
      const { data, error: tagError } = await supabase
        .from("recipe_tags")
        .select("id, name")
        .order("name", { ascending: true });

      if (!isMounted) return;
      if (tagError) {
        // Tags are optional for now; just surface the error in-console
        console.error(tagError);
        return;
      }
      setAllTags((data ?? []) as RecipeTagRow[]);
    }

    loadTags();
    return () => {
      isMounted = false;
    };
  }, []);

  async function handleAddTag() {
    setError(null);
    const name = normalizeTagName(newTagInput);
    if (!name) return;

    // If tag already loaded, just select it
    const existing = allTags.find((t) => t.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      setSelectedTagIds((prev) =>
        prev.includes(existing.id) ? prev : [...prev, existing.id],
      );
      setNewTagInput("");
      return;
    }

    setLoading(true);
    const { data, error: insertError } = await supabase
      .from("recipe_tags")
      .insert({ name })
      .select("id, name")
      .single();

    if (insertError || !data) {
      setError(insertError?.message ?? "Failed to create tag");
      setLoading(false);
      return;
    }

    const newTag = data as RecipeTagRow;
    setAllTags((prev) => [...prev, newTag].sort((a, b) => a.name.localeCompare(b.name)));
    setSelectedTagIds((prev) => [...prev, newTag.id]);
    setNewTagInput("");
    setLoading(false);
  }

  async function handleSubmit() {
    setError(null);
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("You must be logged in to create a recipe.");
      setLoading(false);
      return;
    }

    if (!title.trim()) {
      setError("Title is required.");
      setLoading(false);
      return;
    }

    const { data: recipe, error: recipeError } = await supabase
      .from("recipes")
      .insert({
        author_id: user.id,
        title: title.trim(),
        description: description.trim() || null,
        difficulty,
        prep_time_minutes: prepTime === "" ? null : prepTime,
        cook_time_minutes: cookTime === "" ? null : cookTime,
        servings: servings === "" ? null : servings,
        ingredients,
        instructions,
        is_published: isPublished,
      })
      .select("id")
      .single();

    if (recipeError || !recipe) {
      setError(recipeError?.message ?? "Failed to create recipe.");
      setLoading(false);
      return;
    }

    if (selectedTagIds.length > 0) {
      const { error: mapError } = await supabase.from("recipe_tag_map").insert(
        selectedTagIds.map((tagId) => ({
          recipe_id: recipe.id,
          tag_id: tagId,
        })),
      );

      if (mapError) {
        setError(mapError.message);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    router.push(`/recipes/${recipe.id}`);
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-orange-100 bg-white/70 p-6 shadow-sm">
      <div className="space-y-6">
        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-zinc-700">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              placeholder="e.g. One-Pan Lemon Chicken"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-zinc-700">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block min-h-24 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              placeholder="What makes this recipe great?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:col-span-1">
            <div>
              <label className="block text-sm font-medium text-zinc-700">
                Prep
              </label>
              <input
                inputMode="numeric"
                value={prepTime}
                onChange={(e) =>
                  setPrepTime(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                placeholder="min"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700">
                Cook
              </label>
              <input
                inputMode="numeric"
                value={cookTime}
                onChange={(e) =>
                  setCookTime(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                placeholder="min"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700">
                Servings
              </label>
              <input
                inputMode="numeric"
                value={servings}
                onChange={(e) =>
                  setServings(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                placeholder="#"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Ingredients
            </label>
            <textarea
              value={ingredientsText}
              onChange={(e) => setIngredientsText(e.target.value)}
              className="mt-1 block min-h-40 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              placeholder={"One per line\n- 2 eggs\n- 1 tbsp olive oil"}
            />
            <p className="mt-1 text-xs text-zinc-500">
              Stored as a structured list (JSON) in the database.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Instructions
            </label>
            <textarea
              value={instructionsText}
              onChange={(e) => setInstructionsText(e.target.value)}
              className="mt-1 block min-h-40 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              placeholder={"One step per line\n1. Preheat oven...\n2. Mix..."}
            />
            <p className="mt-1 text-xs text-zinc-500">
              Stored as a structured list (JSON) in the database.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900">Tags</h3>
              <p className="text-xs text-zinc-600">
                Select existing tags or create a new one.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                className="w-48 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                placeholder="Add tag (e.g. Italian)"
              />
              <button
                type="button"
                onClick={handleAddTag}
                disabled={loading || !newTagInput.trim()}
                className="rounded-lg border border-orange-100 bg-white px-3 py-2 text-sm font-medium text-orange-700 shadow-sm transition hover:border-orange-200 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {allTags.length === 0 ? (
              <span className="text-xs text-zinc-500">No tags yet.</span>
            ) : (
              allTags.map((tag) => {
                const active = selectedTagIds.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() =>
                      setSelectedTagIds((prev) =>
                        prev.includes(tag.id)
                          ? prev.filter((id) => id !== tag.id)
                          : [...prev, tag.id],
                      )
                    }
                    className={`rounded-full px-3 py-1 text-xs font-medium ring-1 transition ${
                      active
                        ? "bg-orange-500 text-white ring-orange-200"
                        : "bg-white/80 text-orange-700 ring-orange-100 hover:ring-orange-200"
                    }`}
                  >
                    {tag.name}
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-orange-100 pt-4">
          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-orange-600 focus:ring-orange-500"
            />
            Publish to community
          </label>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex items-center rounded-full bg-orange-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Saving..." : isPublished ? "Publish recipe" : "Save draft"}
          </button>
        </div>
      </div>
    </div>
  );
}


