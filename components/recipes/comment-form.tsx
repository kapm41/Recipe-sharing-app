"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

interface CommentFormProps {
  recipeId: string;
  onCommentAdded?: () => void;
}

export function CommentForm({ recipeId, onCommentAdded }: CommentFormProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || loading) return;

    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Please log in to comment");
        setLoading(false);
        return;
      }

      const { error } = await supabase.from("recipe_comments").insert({
        recipe_id: recipeId,
        user_id: user.id,
        content: content.trim(),
      });

      if (error) throw error;

      setContent("");
      onCommentAdded?.();
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to post comment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        rows={3}
        className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
        required
      />
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!content.trim() || loading}
          className="rounded-lg bg-orange-500 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post comment"}
        </button>
      </div>
    </form>
  );
}

