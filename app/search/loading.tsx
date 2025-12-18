import { PageHeaderSkeleton } from "../../components/ui/page-skeleton";
import { FilterSkeleton } from "../../components/ui/page-skeleton";
import { RecipeGridSkeleton } from "../../components/ui/recipe-card-skeleton";

export default function SearchLoading() {
  return (
    <div className="space-y-8">
      <PageHeaderSkeleton />
      <FilterSkeleton />
      <RecipeGridSkeleton count={9} />
    </div>
  );
}

