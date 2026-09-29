export default function RecipeCardSkeleton() {
  return (
    <article className="recipe-card skeleton-card" aria-hidden="true">
      <div className="recipe-card-image skeleton-block" />
      <div className="recipe-card-body">
        <div className="skeleton-line skeleton-category" />
        <div className="skeleton-line skeleton-title" />
        <div className="skeleton-line skeleton-meta" />
        <div className="skeleton-line skeleton-link" />
      </div>
    </article>
  );
}