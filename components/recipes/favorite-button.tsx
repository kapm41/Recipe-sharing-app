"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

interface FavoriteButtonProps {
  recipeId: string;
  initialIsFavorited: boolean;
  disabled?: boolean;
}

export function FavoriteButton({
  recipeId,
  initialIsFavorited,
  disabled,
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    if (disabled || loading) return;
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    if (isFavorited) {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("recipe_id", recipeId);

      if (!error) setIsFavorited(false);
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("favorites").insert({
      user_id: user.id,
      recipe_id: recipeId,
    });

    if (!error) setIsFavorited(true);
    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={disabled || loading}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium shadow-sm ring-1 transition disabled:cursor-not-allowed disabled:opacity-50 ${
        isFavorited
          ? "bg-orange-500 text-white ring-orange-200 hover:bg-orange-600"
          : "bg-white/80 text-orange-700 ring-orange-100 hover:ring-orange-200"
      }`}
      aria-pressed={isFavorited}
    >
      <span className="text-sm leading-none">{isFavorited ? "★" : "☆"}</span>
      {isFavorited ? "Saved" : "Save"}
    </button>
  );
}


