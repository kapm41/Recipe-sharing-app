"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

interface PublishButtonProps {
  recipeId: string;
}

export function PublishButton({ recipeId }: PublishButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePublish() {
    if (loading) return;
    setLoading(true);
    setError(null);

    const { error: updateError } = await supabase
      .from("recipes")
      .update({ is_published: true })
      .eq("id", recipeId);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    router.refresh();
    setLoading(false);
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={handlePublish}
        disabled={loading}
        className="inline-flex items-center rounded-full bg-orange-500 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Publishing..." : "Publish"}
      </button>
      {error && <p className="text-xs text-rose-600">{error}</p>}
    </div>
  );
}


