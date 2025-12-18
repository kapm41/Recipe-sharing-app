"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

interface DeleteRecipeButtonProps {
  recipeId: string;
  recipeTitle: string;
}

export function DeleteRecipeButton({
  recipeId,
  recipeTitle,
}: DeleteRecipeButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleDelete() {
    setLoading(true);

    try {
      const { error } = await supabase
        .from("recipes")
        .delete()
        .eq("id", recipeId);

      if (error) throw error;

      // Redirect to dashboard after successful deletion
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to delete recipe");
      setLoading(false);
      setShowConfirm(false);
    }
  }

  if (showConfirm) {
    return (
      <div className="rounded-lg border border-rose-200 bg-rose-50 p-4">
        <p className="mb-3 text-sm font-medium text-rose-900">
          Are you sure you want to delete &quot;{recipeTitle}&quot;?
        </p>
        <p className="mb-4 text-xs text-rose-700">
          This action cannot be undone. The recipe and all associated data will
          be permanently deleted.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Yes, delete"}
          </button>
          <button
            type="button"
            onClick={() => setShowConfirm(false)}
            disabled={loading}
            className="rounded-lg border border-rose-300 bg-white px-4 py-2 text-xs font-medium text-rose-700 shadow-sm transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setShowConfirm(true)}
      className="rounded-lg border border-rose-300 bg-white px-4 py-2 text-xs font-medium text-rose-700 shadow-sm transition hover:border-rose-400 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
    >
      Delete recipe
    </button>
  );
}

