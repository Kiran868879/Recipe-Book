import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import RecipeCardSkeleton from '../components/RecipeCardSkeleton';
import recipeService from '../services/recipeService';
import categoryService from '../services/categoryService';
import { useAuth } from '../context/AuthContext';

function getErrorMessage(error) {
  const response = error.response?.data;
  if (response?.errors?.length) return response.errors.map((item) => item.msg).join(' ');
  return response?.message || 'Unable to load recipes.';
}

export default function DashboardPage() {
  const { token } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [quickOnly, setQuickOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await categoryService.list();
        setCategories(result.data || []);
      } catch (requestError) {
        setError(getErrorMessage(requestError));
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadRecipes = async () => {
      setLoading(true);
      setError('');

      try {
        let result;
        if (quickOnly) {
          result = await recipeService.quick({ page });
        } else if (categoryId) {
          result = await recipeService.byCategory({ categoryId, page });
        } else if (searchQuery) {
          result = await recipeService.search({ query: searchQuery, page });
        } else {
          result = await recipeService.list({ page });
        }
        setRecipes(result.data || []);
        setTotalPages(result.totalPages || 1);
        setTotalCount(result.totalCount || 0);
      } catch (requestError) {
        setError(getErrorMessage(requestError));
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, [categoryId, page, quickOnly, searchQuery]);

  const handleSearch = (event) => {
    event.preventDefault();
    setCategoryId('');
    setQuickOnly(false);
    setPage(1);
    setSearchQuery(searchInput.trim());
  };

  const handleCategoryChange = (event) => {
    setSearchInput('');
    setSearchQuery('');
    setQuickOnly(false);
    setCategoryId(event.target.value);
    setPage(1);
  };

  return (
    <main className="app-shell">
      <header className="dashboard-hero">
        <div className="hero-copy">
          <p className="eyebrow">{token ? 'Your kitchen shelf' : 'Recipe collection'}</p>
          <h1>Make room for<br /><em>something delicious.</em></h1>
          <p className="page-subtitle">A shared collection of recipes worth repeating, from quick weekday wins to slow Sunday projects.</p>
          <div className="hero-actions">
            {token ? (
              <>
                <Link className="primary-button" to="/recipes/new">Add a recipe <span aria-hidden="true">+</span></Link>
                <Link className="hero-text-link" to="/favorites">Open your favorites <span aria-hidden="true">→</span></Link>
              </>
            ) : <Link className="primary-button" to="/register">Join to add a recipe <span aria-hidden="true">+</span></Link>}
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="chef-card chef-card-one" />
          <div className="chef-card chef-card-two" />
          <div className="chef-card chef-card-three" />
          <div className="hero-art-label">Tonight's cue</div>
          <div className="hero-art-title">Keep it<br /><strong>fresh.</strong></div>
          <div className="hero-art-lines" />
          <div className="hero-art-meta"><span /> Ready when you are</div>
        </div>
      </header>

      <section className="collection-strip" aria-label="Recipe collection summary">
        <div><strong>{totalCount}</strong><span>recipes saved</span></div>
        <div><strong>{categories.length}</strong><span>categories</span></div>
        <div><strong>30</strong><span>minute quick filter</span></div>
      </section>

      <section className="toolbar-section" aria-label="Recipe filters">
        <div className="section-heading"><span>Browse the shelf</span><small>Search, sort, and find your next favorite.</small></div>
        <div className="toolbar">
        <form className="search-form" onSubmit={handleSearch}>
          <input
            aria-label="Search recipes"
            placeholder="Search by title or ingredient"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <button className="secondary-button" type="submit">Search</button>
        </form>
        <select aria-label="Filter by category" value={categoryId} onChange={handleCategoryChange}>
          <option value="">All categories</option>
          {categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}
        </select>
        <label className="quick-filter">
          <input
            type="checkbox"
            checked={quickOnly}
            onChange={(event) => {
              setQuickOnly(event.target.checked);
              setCategoryId('');
              setSearchInput('');
              setSearchQuery('');
              setPage(1);
            }}
          />
          Quick recipes under 30 min
        </label>
        </div>
      </section>

      {error && <div className="alert error-alert" role="alert">{error}</div>}
      {loading ? (
        <section className="recipe-grid" aria-label="Loading recipes">
          {Array.from({ length: 6 }, (_, index) => <RecipeCardSkeleton key={index} />)}
        </section>
      ) : recipes.length ? (
        <section className="recipe-grid" aria-label="Recipes">
          {recipes.map((recipe) => <RecipeCard key={recipe._id} recipe={recipe} />)}
        </section>
      ) : (
        <div className="empty-state">
          <h2>No recipes found</h2>
          <p>{token ? 'Try a different search or add your first recipe.' : 'Try a different search, or sign in to contribute a recipe.'}</p>
          {token ? <Link className="primary-button" to="/recipes/new">Create a recipe</Link> : <Link className="primary-button" to="/login">Sign in</Link>}
        </div>
      )}

      {!loading && totalPages > 1 && (
        <nav className="pagination" aria-label="Recipe pages">
          <button className="secondary-button" type="button" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>Previous</button>
          <span>Page {page} of {totalPages}</span>
          <button className="secondary-button" type="button" disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)}>Next</button>
        </nav>
      )}
    </main>
  );
}
