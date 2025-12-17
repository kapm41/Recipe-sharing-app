"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

interface ProfileFormProps {
  initialFullName: string;
  initialBio: string;
  initialUsername: string;
  userEmail: string;
}

export function ProfileForm({
  initialFullName,
  initialBio,
  initialUsername,
  userEmail,
}: ProfileFormProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState(initialFullName);
  const [bio, setBio] = useState(initialBio);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setLoading(true);
    setError(null);
    setSaved(false);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("You must be logged in to update your profile.");
      setLoading(false);
      return;
    }

    const { error: upsertError } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: fullName.trim() || null,
      bio: bio.trim() || null,
    });

    if (upsertError) {
      setError(upsertError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    setSaved(true);
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-orange-100 bg-white/70 p-6 shadow-sm">
      <div className="space-y-5">
        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {saved && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
            Profile saved.
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-zinc-500">
            Email
          </label>
          <p className="mt-1 text-sm text-zinc-900">{userEmail}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-zinc-700"
            >
              Full name
            </label>
            <input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              placeholder="e.g. Taylor Smith"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500">
              Username
            </label>
            <p className="mt-2 text-sm text-zinc-900">
              {initialUsername || "Not set"}
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              Username editing coming soon.
            </p>
          </div>
        </div>

        <div>
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-zinc-700"
          >
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="mt-1 block min-h-28 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            placeholder="Tell people a bit about you..."
          />
        </div>

        <div className="flex items-center justify-end border-t border-orange-100 pt-4">
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="inline-flex items-center rounded-full bg-orange-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}


