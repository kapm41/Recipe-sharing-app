import { PageHeaderSkeleton } from "../../components/ui/page-skeleton";
import { RecipeGridSkeleton } from "../../components/ui/recipe-card-skeleton";

export default function SavedLoading() {
  return (
    <div className="space-y-8">
      <PageHeaderSkeleton />
      <RecipeGridSkeleton count={9} />
    </div>
  );
}

