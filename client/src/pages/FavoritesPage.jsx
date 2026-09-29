import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import RecipeCardSkeleton from '../components/RecipeCardSkeleton';
import authService from '../services/authService';

function getErrorMessage(error) {
  return error.response?.data?.message || 'Unable to load your favorites.';
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const profile = await authService.me();
        setFavorites(profile.favorites || []);
      } catch (requestError) {
        setError(getErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  return (
    <main className="app-shell favorites-page">
      <header className="page-header favorites-header">
        <div>
          <p className="eyebrow">Your saved recipes</p>
          <h1>Favorites</h1>
          <p className="page-subtitle">The recipes you want to make again.</p>
        </div>
      </header>

      {error && <div className="alert error-alert" role="alert">{error}</div>}
      {loading ? (
        <section className="recipe-grid favorites-grid" aria-label="Loading favorites">
          {Array.from({ length: 3 }, (_, index) => <RecipeCardSkeleton key={index} />)}
        </section>
      ) : favorites.length ? (
        <section className="recipe-grid favorites-grid" aria-label="Favorite recipes">
          {favorites.map((recipe) => <RecipeCard key={recipe._id} recipe={recipe} />)}
        </section>
      ) : (
        <div className="empty-state favorites-empty-state">
          <div className="favorites-illustration" aria-hidden="true">
            <svg viewBox="0 0 520 420" className="favorites-art" role="img" aria-label="Chef illustration">
              <g fill="none" stroke="#111111" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M78 96c24-42 63-66 110-63 19 2 36 14 48 27 17 18 32 20 35 19-1-16 7-31 20-42 14-11 31-16 50-15 31 2 55 18 72 42 18 25 23 56 9 80-9 16-27 28-44 27-17-1-31-13-37-29-1-3-2-5-3-8-4-16-16-29-30-36-28-15-74-13-100 8-23 18-35 46-50 74-16 30-49 43-78 43-19 0-32-6-42-17-16-20-18-48-3-67 9-12 21-20 35-24 10-4 19-8 26-17 15-19 13-43-5-61 7 0 18 3 30 8Z" fill="#111111"/>
                <path d="M160 72c-18 7-30 25-31 46-1 10 3 20 11 26 14 11 33 9 42-6 7-12 7-30 1-43-5-8-12-17-23-23Z" fill="#111111"/>
                <path d="M270 78c-13 3-27 14-34 27-8 16-9 35-2 51 7 16 22 27 39 30 18 4 38-2 50-17 12-15 17-35 13-54-4-19-20-34-38-39-9-2-19-2-28 2Z" fill="#111111"/>
                <path d="M234 86c-25 16-42 45-41 75 1 32 17 61 45 77 34 19 78 17 110-6 29-21 45-58 39-93-5-31-29-58-58-70-29-12-67-7-95 17Z" fill="#111111"/>
                <path d="M310 150c19-11 45-11 64 4 10 8 18 20 17 35-1 17-13 31-28 37-15 7-33 7-48-1-16-9-28-27-28-45 0-11 6-23 23-30Z" fill="#111111"/>
                <path d="M198 154c-16 24-16 56 0 79 20 30 60 38 92 20 30-17 43-56 28-90-13-29-46-45-77-38-14 3-28 11-43 29Z" fill="#f5f5f5"/>
                <path d="M179 190c16 14 31 18 54 15 25-4 39-17 49-34 12 19 18 41 17 63-2 31-26 59-57 67-32 8-69-7-85-37-16-29-13-63 22-74Z" fill="#f5f5f5"/>
                <path d="M232 245h64c20 0 37 16 37 35v18c0 23-18 41-41 41h-58c-22 0-40-18-40-40v-19c0-18 14-35 38-35Z" fill="#111111"/>
                <path d="M150 227c8-29 27-51 53-64 17-9 32-13 49-13 19 0 36 3 53 10 17 8 33 20 45 36-13-5-25-8-38-8-14 0-26 5-38 12-17 10-31 25-41 43-9 15-20 25-35 30-15 5-31 5-48 0Z" fill="#111111"/>
                <path d="M217 50c22 1 41 18 50 38l14 31-12-1-17-29-7 29h-33l-7-31-18 32-9-1 17-31c7-19 21-37 38-38Z" fill="#111111"/>
                <path d="M192 205c17 18 33 24 49 24 16 0 32-8 49-23" stroke="#111111" strokeWidth="10"/>
                <path d="M184 228c-10 10-17 23-20 38" stroke="#111111" strokeWidth="9"/>
                <path d="M290 228c11 13 17 28 17 44" stroke="#111111" strokeWidth="9"/>
                <path d="M232 170c8 8 20 13 32 13 12 0 23-4 31-12" stroke="#111111" strokeWidth="7"/>
                <circle cx="223" cy="171" r="6" fill="#111111"/>
                <circle cx="283" cy="171" r="6" fill="#111111"/>
                <circle cx="253" cy="194" r="6" fill="#111111"/>
                <path d="M75 289c35 12 69 15 101 11 30-4 57-17 81-35" stroke="#111111" strokeWidth="9"/>
                <path d="M92 240l-26 45-23-13 24-45 25 13Z" fill="#111111"/>
                <path d="M372 270c16-22 47-26 71-12 14 9 23 24 23 40 0 17-9 33-24 42-14 9-35 13-51 4-23-13-35-42-19-74Z" fill="#111111"/>
                <path d="M362 318c-25 13-42 25-57 47" stroke="#111111" strokeWidth="9"/>
                <path d="M440 314c18 14 30 29 39 46" stroke="#111111" strokeWidth="9"/>
                <path d="M328 120c-6-24-24-49-48-66" stroke="#111111" strokeWidth="8"/>
                <path d="M390 135c8-38 35-71 66-93" stroke="#111111" strokeWidth="8"/>
                <path d="M74 146c-18 8-29 24-33 41-5 19 1 40 18 52l17-16c-11-8-15-21-12-35 2-12 9-22 20-28l-10-14Z" fill="#111111"/>
                <path d="M454 198c10-4 22-2 31 4 10 8 15 21 14 33-1 13-9 25-21 31-12 7-29 7-40-1-7-6-11-14-12-23-1-11 4-22 12-30 5-5 12-10 16-14Z" fill="#111111"/>
                <path d="M198 322c-20 12-32 30-36 52" stroke="#111111" strokeWidth="9"/>
                <path d="M304 323c23 12 38 29 43 53" stroke="#111111" strokeWidth="9"/>
                <path d="M104 346c12 18 31 31 52 36" stroke="#111111" strokeWidth="9"/>
                <path d="M362 359c8 13 20 24 35 31" stroke="#111111" strokeWidth="9"/>
                <circle cx="118" cy="93" r="10" fill="#111111"/>
                <circle cx="412" cy="81" r="10" fill="#111111"/>
                <circle cx="455" cy="138" r="8" fill="#111111"/>
                <circle cx="86" cy="193" r="7" fill="#111111"/>
              </g>
            </svg>
          </div>
          <h2>No favorites yet</h2>
          <p>Save a recipe and it will appear here.</p>
          <Link className="primary-button" to="/">Browse recipes</Link>
        </div>
      )}
    </main>
  );
}