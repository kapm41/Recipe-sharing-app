interface RecipeGridProps {
  children: React.ReactNode;
}

export function RecipeGrid({ children }: RecipeGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {children}
    </div>
  );
}

