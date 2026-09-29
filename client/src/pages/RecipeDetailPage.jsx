import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import recipeService from '../services/recipeService';
import { useAuth } from '../context/AuthContext';

function getErrorMessage(error) {
  return error.response?.data?.message || 'Unable to load this recipe.';
}

export default function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { token, user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState(location.state?.notice || '');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        setRecipe(await recipeService.getById(id));
      } catch (requestError) {
        setError(getErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [id]);

  const ownerId = recipe?.createdBy?._id || recipe?.createdBy;
  const isOwner = Boolean(user?._id && ownerId && String(user._id) === String(ownerId));
  const backPath = token ? '/' : '/recipes';

  const handleFavorite = async () => {
    setActionLoading(true);
    setError('');
    try {
      await recipeService.favorite(id);
      setNotice('Recipe saved to your favorites.');
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this recipe?')) return;
    setActionLoading(true);
    setError('');
    try {
      await recipeService.remove(id);
      navigate(backPath, { replace: true, state: { notice: 'Recipe deleted.' } });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
      setActionLoading(false);
    }
  };

  if (loading) return <main className="loading-state"><span className="spinner dark-spinner" /> Loading recipe...</main>;
  if (error && !recipe) return <main className="app-shell"><div className="alert error-alert" role="alert">{error}</div><Link className="back-link" to={backPath}>Back to recipes</Link></main>;
  if (!recipe) return <main className="app-shell"><div className="empty-state"><h2>Recipe not found</h2><Link className="primary-button" to={backPath}>Back to recipes</Link></div></main>;

  return (
    <main className="app-shell narrow-shell">
      <Link className="back-link" to={backPath}>← Back to recipes</Link>
      {notice && <div className="alert success-alert" role="status">{notice}</div>}
      {error && <div className="alert error-alert" role="alert">{error}</div>}
      <article className="recipe-detail">
        {recipe.image && <img className="detail-image" src={recipe.image} alt={recipe.title} />}
        <p className="eyebrow">{recipe.category?.name || 'Recipe'}</p>
        <h1>{recipe.title}</h1>
        <p className="detail-time">Ready in {recipe.cookingTime} minutes</p>

        <div className="detail-actions">
          {token && <button className="primary-button" type="button" onClick={handleFavorite} disabled={actionLoading}>Save to favorites</button>}
          {isOwner && <Link className="secondary-button" to={`/recipes/${id}/edit`}>Edit recipe</Link>}
          {isOwner && <button className="danger-button" type="button" onClick={handleDelete} disabled={actionLoading}>Delete</button>}
        </div>

        <div className="detail-columns">
          <section><h2>Ingredients</h2><ul>{recipe.ingredients.map((ingredient, index) => <li key={`${ingredient}-${index}`}>{ingredient}</li>)}</ul></section>
          <section><h2>Steps</h2><ol>{recipe.steps.map((step, index) => <li key={`${step}-${index}`}>{step}</li>)}</ol></section>
        </div>
      </article>
    </main>
  );
}
