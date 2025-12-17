import { createSupabaseServerClient } from "../../lib/supabaseServer";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getUserProfile } from "../../lib/auth";
import { ProfileForm } from "../../components/profile/profile-form";

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

      <ProfileForm
        userEmail={user.email ?? ""}
        initialUsername={profile?.username ?? ""}
        initialFullName={profile?.full_name ?? ""}
        initialBio={profile?.bio ?? ""}
      />

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

