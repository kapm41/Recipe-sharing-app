import { PageHeaderSkeleton } from "../../components/ui/page-skeleton";
import { RecipeGridSkeleton } from "../../components/ui/recipe-card-skeleton";

export default function MyRecipesLoading() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <PageHeaderSkeleton />
        <div className="h-8 w-32 animate-pulse rounded-full bg-zinc-200" />
      </div>
      <RecipeGridSkeleton count={9} />
    </div>
  );
}

