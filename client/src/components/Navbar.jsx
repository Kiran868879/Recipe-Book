import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { token, user, logout } = useAuth();

  return (
    <nav className="app-nav">
      <Link className="brand-link" to={token ? '/' : '/recipes'}><span className="brand-mark" aria-hidden="true">RB</span> Recipe Book</Link>
      <div className="nav-links">
        <Link to={token ? '/' : '/recipes'}>Recipes</Link>
        {token ? (
          <>
            <Link to="/favorites">Favorites</Link>
            <Link to="/categories">Categories</Link>
            <span className="nav-user">{user?.name || 'Chef'}</span>
            <button className="nav-logout" type="button" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Sign in</Link>
            <Link to="/register">Create account</Link>
          </>
        )}
      </div>
    </nav>
  );
}