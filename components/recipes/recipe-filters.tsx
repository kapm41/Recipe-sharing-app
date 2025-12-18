"use client";

import { useState, useMemo } from "react";

interface Recipe {
  id: string;
  title: string;
  description: string | null;
  prep_time_minutes: number | null;
  cook_time_minutes: number | null;
  servings: number | null;
  difficulty: string | null;
  is_published: boolean;
  created_at: string;
}

interface RecipeFiltersProps {
  recipes: Recipe[];
  onFilteredChange: (filtered: Recipe[]) => void;
  showPublishedFilter?: boolean;
}

export function RecipeFilters({
  recipes,
  onFilteredChange,
  showPublishedFilter = false,
}: RecipeFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [maxTimeFilter, setMaxTimeFilter] = useState<string>("all");
  const [publishedFilter, setPublishedFilter] = useState<string>("all");

  const filteredRecipes = useMemo(() => {
    let filtered = [...recipes];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(query) ||
          (recipe.description &&
            recipe.description.toLowerCase().includes(query))
      );
    }

    // Difficulty filter
    if (difficultyFilter !== "all") {
      filtered = filtered.filter(
        (recipe) => recipe.difficulty === difficultyFilter
      );
    }

    // Max time filter
    if (maxTimeFilter !== "all") {
      const maxTime = parseInt(maxTimeFilter);
      filtered = filtered.filter((recipe) => {
        const totalTime =
          (recipe.prep_time_minutes || 0) + (recipe.cook_time_minutes || 0);
        return totalTime > 0 && totalTime <= maxTime;
      });
    }

    // Published status filter (for user's recipes)
    if (showPublishedFilter && publishedFilter !== "all") {
      const isPublished = publishedFilter === "published";
      filtered = filtered.filter(
        (recipe) => recipe.is_published === isPublished
      );
    }

    return filtered;
  }, [
    recipes,
    searchQuery,
    difficultyFilter,
    maxTimeFilter,
    publishedFilter,
    showPublishedFilter,
  ]);

  // Notify parent of filtered results
  useMemo(() => {
    onFilteredChange(filteredRecipes);
  }, [filteredRecipes, onFilteredChange]);

  return (
    <div className="space-y-4 rounded-2xl border border-orange-100 bg-white/70 p-4 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div className="sm:col-span-2">
          <label
            htmlFor="search"
            className="block text-xs font-medium text-zinc-700"
          >
            Search
          </label>
          <input
            id="search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or description..."
            className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        {/* Difficulty Filter */}
        <div>
          <label
            htmlFor="difficulty"
            className="block text-xs font-medium text-zinc-700"
          >
            Difficulty
          </label>
          <select
            id="difficulty"
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            <option value="all">All</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        {/* Max Time Filter */}
        <div>
          <label
            htmlFor="maxTime"
            className="block text-xs font-medium text-zinc-700"
          >
            Max Time
          </label>
          <select
            id="maxTime"
            value={maxTimeFilter}
            onChange={(e) => setMaxTimeFilter(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            <option value="all">Any time</option>
            <option value="15">15 min or less</option>
            <option value="30">30 min or less</option>
            <option value="60">1 hour or less</option>
            <option value="120">2 hours or less</option>
          </select>
        </div>
      </div>

      {/* Published Status Filter (only for user recipes) */}
      {showPublishedFilter && (
        <div>
          <label
            htmlFor="published"
            className="block text-xs font-medium text-zinc-700"
          >
            Status
          </label>
          <select
            id="published"
            value={publishedFilter}
            onChange={(e) => setPublishedFilter(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:w-auto"
          >
            <option value="all">All recipes</option>
            <option value="published">Published only</option>
            <option value="draft">Drafts only</option>
          </select>
        </div>
      )}

      {/* Results count */}
      <div className="text-xs text-zinc-500">
        Showing {filteredRecipes.length} of {recipes.length} recipes
      </div>
    </div>
  );
}

