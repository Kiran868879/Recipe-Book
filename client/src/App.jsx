import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import RecipeFormPage from './pages/RecipeFormPage';
import CategoryManagerPage from './pages/CategoryManagerPage';
import FavoritesPage from './pages/FavoritesPage';
import LandingPage from './pages/LandingPage';
import Navbar from './components/Navbar';

export default function App() {
  const { token } = useAuth();

  return (
    <div className="app-root">
      <div className="app-vfx" aria-hidden="true" />
      <Routes>
      <Route path="/login" element={token ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/register" element={token ? <Navigate to="/" replace /> : <RegisterPage />} />
      <Route path="/forgot-password" element={token ? <Navigate to="/" replace /> : <ForgotPasswordPage />} />
      <Route path="/" element={token ? <HomePage /> : <LandingPage />} />
      <Route path="/recipes" element={<><Navbar /><DashboardPage /></>} />

      <Route
        path="/recipes/:id"
        element={
          <>
            <Navbar />
            <RecipeDetailPage />
          </>
        }
      />
      <Route
        path="/recipes/new"
        element={
          <PrivateRoute>
            <>
              <Navbar />
              <RecipeFormPage />
            </>
          </PrivateRoute>
        }
      />
      <Route
        path="/recipes/:id/edit"
        element={
          <PrivateRoute>
            <>
              <Navbar />
              <RecipeFormPage />
            </>
          </PrivateRoute>
        }
      />
      <Route
        path="/favorites"
        element={
          <PrivateRoute>
            <>
              <Navbar />
              <FavoritesPage />
            </>
          </PrivateRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <PrivateRoute>
            <>
              <Navbar />
              <CategoryManagerPage />
            </>
          </PrivateRoute>
        }
      />
      </Routes>
    </div>
  );
}
