import { createSupabaseServerClient } from "../../lib/supabaseServer";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getUserProfile } from "../../lib/auth";

export const metadata = {
  title: "Profile | RecipeShare",
  description: "Your RecipeShare profile",
};

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await getUserProfile(user.id);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-zinc-900">Profile</h1>
        <p className="text-sm text-zinc-600">
          Manage your account settings and view your profile information
        </p>
      </div>

      {/* Profile Info Card */}
      <div className="rounded-2xl border border-orange-100 bg-white/70 p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-500">
              Email
            </label>
            <p className="mt-1 text-sm text-zinc-900">{user.email}</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500">
              Username
            </label>
            <p className="mt-1 text-sm text-zinc-900">
              {profile?.username || "Not set"}
            </p>
          </div>

          {profile?.bio && (
            <div>
              <label className="block text-xs font-medium text-zinc-500">
                Bio
              </label>
              <p className="mt-1 text-sm text-zinc-600">{profile.bio}</p>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-zinc-500">
              Member since
            </label>
            <p className="mt-1 text-sm text-zinc-600">
              {profile?.created_at
                ? new Date(profile.created_at).toLocaleDateString()
                : "Recently"}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-900">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/dashboard"
            className="rounded-2xl border border-orange-100 bg-white/70 p-4 shadow-sm transition hover:border-orange-200 hover:shadow-md"
          >
            <h3 className="text-sm font-semibold text-zinc-900">
              Go to Dashboard
            </h3>
            <p className="mt-1 text-xs text-zinc-600">
              View your recipes and community recipes
            </p>
          </Link>

          <Link
            href="/recipes/new"
            className="rounded-2xl border border-orange-100 bg-white/70 p-4 shadow-sm transition hover:border-orange-200 hover:shadow-md"
          >
            <h3 className="text-sm font-semibold text-zinc-900">
              Create Recipe
            </h3>
            <p className="mt-1 text-xs text-zinc-600">
              Share a new recipe with the community
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

