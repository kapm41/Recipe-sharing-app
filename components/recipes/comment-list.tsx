"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

interface Comment {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  profile: {
    username: string | null;
    full_name: string | null;
  };
}

interface CommentListProps {
  comments: Comment[];
  currentUserId: string | null;
  recipeId: string;
}

export function CommentList({
  comments,
  currentUserId,
  recipeId,
}: CommentListProps) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleDelete(commentId: number) {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from("recipe_comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;

      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to delete comment");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(commentId: number) {
    if (!editContent.trim() || loading) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from("recipe_comments")
        .update({ content: editContent.trim() })
        .eq("id", commentId);

      if (error) throw error;

      setEditingId(null);
      setEditContent("");
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to update comment");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(comment: Comment) {
    setEditingId(comment.id);
    setEditContent(comment.content);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditContent("");
  }

  if (comments.length === 0) {
    return (
      <div className="rounded-2xl border border-orange-100 bg-white/70 p-6 text-center shadow-sm">
        <p className="text-sm text-zinc-500">No comments yet. Be the first!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => {
        const isAuthor = currentUserId === comment.user_id;
        const isEditing = editingId === comment.id;
        const displayName =
          comment.profile.full_name ||
          comment.profile.username ||
          "Anonymous";

        return (
          <div
            key={comment.id}
            className="rounded-2xl border border-orange-100 bg-white/70 p-4 shadow-sm"
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-zinc-900">
                    {displayName}
                  </span>
                  {comment.created_at !== comment.updated_at && (
                    <span className="text-[10px] text-zinc-400">(edited)</span>
                  )}
                </div>
                <span className="text-[10px] text-zinc-500">
                  {new Date(comment.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              {isAuthor && !isEditing && (
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => startEdit(comment)}
                    disabled={loading}
                    className="rounded px-2 py-1 text-[10px] font-medium text-zinc-600 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(comment.id)}
                    disabled={loading}
                    className="rounded px-2 py-1 text-[10px] font-medium text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={3}
                  className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    disabled={loading}
                    className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdate(comment.id)}
                    disabled={!editContent.trim() || loading}
                    className="rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-zinc-700 whitespace-pre-wrap">
                {comment.content}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

