"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { RecipeGrid } from "./recipe-grid";
import { RecipeCard } from "./recipe-card";
import { RecipeFilters } from "./recipe-filters";

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
  author?: string;
}

interface FilterableRecipeListProps {
  recipes: Recipe[];
  showAuthor?: boolean;
  showPublishedFilter?: boolean;
  emptyMessage: string | ReactNode;
  initialEmptyMessage?: string | ReactNode;
}

export function FilterableRecipeList({
  recipes,
  showAuthor = false,
  showPublishedFilter = false,
  emptyMessage,
  initialEmptyMessage,
}: FilterableRecipeListProps) {
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>(recipes);
  const hasInitialRecipes = recipes.length > 0;

  return (
    <>
      {hasInitialRecipes && (
        <RecipeFilters
          recipes={recipes}
          onFilteredChange={setFilteredRecipes}
          showPublishedFilter={showPublishedFilter}
        />
      )}

      {filteredRecipes.length > 0 ? (
        <RecipeGrid>
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              showAuthor={showAuthor}
            />
          ))}
        </RecipeGrid>
      ) : (
        <div className="rounded-2xl border border-orange-100 bg-white/70 p-8 text-center">
          <p className="text-sm text-zinc-600">
            {hasInitialRecipes ? emptyMessage : initialEmptyMessage || emptyMessage}
          </p>
        </div>
      )}
    </>
  );
}

