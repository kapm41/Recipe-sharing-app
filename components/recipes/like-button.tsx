"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

interface LikeButtonProps {
  recipeId: string;
  initialLikeCount: number;
  initialIsLiked: boolean;
  disabled?: boolean;
}

export function LikeButton({
  recipeId,
  initialLikeCount,
  initialIsLiked,
  disabled = false,
}: LikeButtonProps) {
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [loading, setLoading] = useState(false);

  // Sync with real-time updates
  useEffect(() => {
    const channel = supabase
      .channel(`recipe-likes-${recipeId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "recipe_likes",
          filter: `recipe_id=eq.${recipeId}`,
        },
        async () => {
          // Refetch like count and status
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) return;

          const { count } = await supabase
            .from("recipe_likes")
            .select("*", { count: "exact", head: true })
            .eq("recipe_id", recipeId);

          const { data: userLike } = await supabase
            .from("recipe_likes")
            .select("id")
            .eq("recipe_id", recipeId)
            .eq("user_id", user.id)
            .maybeSingle();

          setLikeCount(count || 0);
          setIsLiked(Boolean(userLike));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [recipeId]);

  async function handleToggleLike() {
    if (disabled || loading) return;

    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Please log in to like recipes");
        setLoading(false);
        return;
      }

      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from("recipe_likes")
          .delete()
          .eq("recipe_id", recipeId)
          .eq("user_id", user.id);

        if (error) throw error;

        setLikeCount((prev) => Math.max(0, prev - 1));
        setIsLiked(false);
      } else {
        // Like
        const { error } = await supabase
          .from("recipe_likes")
          .insert({
            recipe_id: recipeId,
            user_id: user.id,
          });

        if (error) throw error;

        setLikeCount((prev) => prev + 1);
        setIsLiked(true);
      }
    } catch (err: any) {
      alert(err.message || "Failed to update like");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggleLike}
      disabled={disabled || loading}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium shadow-sm transition focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
        isLiked
          ? "border-rose-200 bg-rose-50 text-rose-700 hover:border-rose-300 hover:bg-rose-100"
          : "border-orange-200 bg-white/80 text-orange-700 hover:border-orange-300 hover:bg-white"
      }`}
    >
      <svg
        className={`h-3.5 w-3.5 ${isLiked ? "fill-rose-600" : "fill-none"}`}
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span>{likeCount}</span>
    </button>
  );
}

