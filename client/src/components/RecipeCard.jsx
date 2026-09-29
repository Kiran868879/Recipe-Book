import { Link } from 'react-router-dom';

export default function RecipeCard({ recipe }) {
  return (
    <article className="recipe-card">
      {recipe.image ? (
        <img className="recipe-card-image" src={recipe.image} alt={recipe.title} />
      ) : (
        <div className="recipe-card-image recipe-card-placeholder" aria-hidden="true">🍲</div>
      )}
      <div className="recipe-card-body">
        <p className="recipe-card-category">{recipe.category?.name || 'Uncategorized'}</p>
        <h3>{recipe.title}</h3>
        <p className="recipe-card-meta">{recipe.cookingTime} minutes</p>
        <Link className="text-link" to={`/recipes/${recipe._id}`}>View recipe</Link>
      </div>
    </article>
  );
}
