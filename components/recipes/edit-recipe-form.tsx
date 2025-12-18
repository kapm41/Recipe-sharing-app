"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { DeleteRecipeButton } from "./delete-recipe-button";

type Difficulty = "Easy" | "Medium" | "Hard";

interface RecipeTagRow {
  id: number;
  name: string;
}

interface EditRecipeFormProps {
  recipeId: string;
  initialData: {
    title: string;
    description: string | null;
    ingredients: string[];
    instructions: string[];
    prep_time_minutes: number | null;
    cook_time_minutes: number | null;
    servings: number | null;
    difficulty: Difficulty | null;
    is_published: boolean;
  };
  initialTagIds: number[];
}

function normalizeTagName(input: string) {
  return input.trim().replace(/\s+/g, " ");
}

export function EditRecipeForm({
  recipeId,
  initialData,
  initialTagIds,
}: EditRecipeFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(initialData.title);
  const [description, setDescription] = useState(initialData.description || "");
  const [difficulty, setDifficulty] = useState<Difficulty>(
    initialData.difficulty || "Easy"
  );
  const [prepTime, setPrepTime] = useState<number | "">(
    initialData.prep_time_minutes ?? ""
  );
  const [cookTime, setCookTime] = useState<number | "">(
    initialData.cook_time_minutes ?? ""
  );
  const [servings, setServings] = useState<number | "">(
    initialData.servings ?? ""
  );

  const [ingredientsText, setIngredientsText] = useState(
    initialData.ingredients.join("\n")
  );
  const [instructionsText, setInstructionsText] = useState(
    initialData.instructions.join("\n")
  );

  const [isPublished, setIsPublished] = useState(initialData.is_published);

  const [allTags, setAllTags] = useState<RecipeTagRow[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>(initialTagIds);
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
    async function loadTags() {
      const { data, error } = await supabase
        .from("recipe_tags")
        .select("id, name")
        .order("name", { ascending: true });

      if (error) {
        console.error("Error loading tags:", error);
        return;
      }

      setAllTags(data || []);
    }

    loadTags();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!title.trim()) {
      setError("Title is required");
      setLoading(false);
      return;
    }

    if (ingredients.length === 0) {
      setError("At least one ingredient is required");
      setLoading(false);
      return;
    }

    if (instructions.length === 0) {
      setError("At least one instruction step is required");
      setLoading(false);
      return;
    }

    try {
      // Update the recipe
      const { error: updateError } = await supabase
        .from("recipes")
        .update({
          title: title.trim(),
          description: description.trim() || null,
          ingredients,
          instructions,
          prep_time_minutes: prepTime === "" ? null : Number(prepTime),
          cook_time_minutes: cookTime === "" ? null : Number(cookTime),
          servings: servings === "" ? null : Number(servings),
          difficulty,
          is_published: isPublished,
          updated_at: new Date().toISOString(),
        })
        .eq("id", recipeId);

      if (updateError) throw updateError;

      // Handle tags
      const normalizedNewTag = normalizeTagName(newTagInput);
      let newTagId: number | null = null;

      if (normalizedNewTag) {
        // Check if tag already exists
        const existingTag = allTags.find(
          (t) => normalizeTagName(t.name) === normalizedNewTag
        );

        if (existingTag) {
          newTagId = existingTag.id;
        } else {
          // Create new tag
          const { data: newTag, error: tagError } = await supabase
            .from("recipe_tags")
            .insert({ name: normalizedNewTag })
            .select("id")
            .single();

          if (tagError) throw tagError;
          newTagId = newTag.id;
        }
      }

      // Update tag mappings
      const finalTagIds = newTagId
        ? [...selectedTagIds.filter((id) => id !== newTagId), newTagId]
        : selectedTagIds;

      // Remove all existing tag mappings
      await supabase
        .from("recipe_tag_map")
        .delete()
        .eq("recipe_id", recipeId);

      // Insert new tag mappings
      if (finalTagIds.length > 0) {
        const { error: mapError } = await supabase
          .from("recipe_tag_map")
          .insert(
            finalTagIds.map((tagId) => ({
              recipe_id: recipeId,
              tag_id: tagId,
            }))
          );

        if (mapError) throw mapError;
      }

      // Redirect to recipe detail page
      router.push(`/recipes/${recipeId}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to update recipe");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-zinc-700"
        >
          Title <span className="text-rose-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          placeholder="e.g., Creamy Tuscan Pasta"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-zinc-700"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          placeholder="A brief description of your recipe..."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label
            htmlFor="difficulty"
            className="block text-sm font-medium text-zinc-700"
          >
            Difficulty
          </label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="prepTime"
            className="block text-sm font-medium text-zinc-700"
          >
            Prep time (minutes)
          </label>
          <input
            id="prepTime"
            type="number"
            min="0"
            value={prepTime}
            onChange={(e) =>
              setPrepTime(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        <div>
          <label
            htmlFor="cookTime"
            className="block text-sm font-medium text-zinc-700"
          >
            Cook time (minutes)
          </label>
          <input
            id="cookTime"
            type="number"
            min="0"
            value={cookTime}
            onChange={(e) =>
              setCookTime(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="servings"
          className="block text-sm font-medium text-zinc-700"
        >
          Servings
        </label>
        <input
          id="servings"
          type="number"
          min="1"
          value={servings}
          onChange={(e) =>
            setServings(e.target.value === "" ? "" : Number(e.target.value))
          }
          className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
        />
      </div>

      <div>
        <label
          htmlFor="ingredients"
          className="block text-sm font-medium text-zinc-700"
        >
          Ingredients <span className="text-rose-500">*</span>
        </label>
        <p className="mt-1 text-xs text-zinc-500">
          Enter one ingredient per line
        </p>
        <textarea
          id="ingredients"
          value={ingredientsText}
          onChange={(e) => setIngredientsText(e.target.value)}
          required
          rows={8}
          className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-zinc-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          placeholder="2 cups flour&#10;1 tsp salt&#10;3 eggs"
        />
      </div>

      <div>
        <label
          htmlFor="instructions"
          className="block text-sm font-medium text-zinc-700"
        >
          Instructions <span className="text-rose-500">*</span>
        </label>
        <p className="mt-1 text-xs text-zinc-500">
          Enter one step per line
        </p>
        <textarea
          id="instructions"
          value={instructionsText}
          onChange={(e) => setInstructionsText(e.target.value)}
          required
          rows={10}
          className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-zinc-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          placeholder="Preheat oven to 350°F&#10;Mix dry ingredients&#10;Bake for 25 minutes"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">Tags</label>
        <p className="mt-1 text-xs text-zinc-500">
          Select existing tags or create a new one
        </p>

        <div className="mt-2 space-y-3">
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <label
                  key={tag.id}
                  className="flex cursor-pointer items-center gap-2 rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-xs transition hover:border-orange-300 hover:bg-orange-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedTagIds.includes(tag.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTagIds([...selectedTagIds, tag.id]);
                      } else {
                        setSelectedTagIds(
                          selectedTagIds.filter((id) => id !== tag.id)
                        );
                      }
                    }}
                    className="h-3 w-3 rounded border-zinc-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span>{tag.name}</span>
                </label>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              placeholder="Create new tag..."
              className="block flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="isPublished"
          type="checkbox"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
          className="h-4 w-4 rounded border-zinc-300 text-orange-600 focus:ring-orange-500"
        />
        <label
          htmlFor="isPublished"
          className="text-sm font-medium text-zinc-700"
        >
          Publish to community
        </label>
      </div>

      <div className="space-y-4 border-t border-orange-100 pt-6">
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save changes"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            disabled={loading}
            className="rounded-lg border border-zinc-300 bg-white px-6 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
        </div>

        <div className="border-t border-rose-100 pt-4">
          <DeleteRecipeButton recipeId={recipeId} recipeTitle={title} />
        </div>
      </div>
    </form>
  );
}

