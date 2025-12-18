import { PageHeaderSkeleton } from "../../components/ui/page-skeleton";
import { RecipeGridSkeleton } from "../../components/ui/recipe-card-skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-12">
      <PageHeaderSkeleton />

      {/* My Recipes Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-7 w-32 animate-pulse rounded bg-zinc-200" />
          <div className="h-8 w-32 animate-pulse rounded-full bg-zinc-200" />
        </div>
        <RecipeGridSkeleton count={3} />
      </section>

      {/* Community Recipes Section */}
      <section className="space-y-4">
        <div className="h-7 w-48 animate-pulse rounded bg-zinc-200" />
        <RecipeGridSkeleton count={6} />
      </section>
    </div>
  );
}

