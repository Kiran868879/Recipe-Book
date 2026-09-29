import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const data = await authService.login(form);
      login(data, data.token);
      navigate('/', { replace: true });
    } catch (requestError) {
      if (requestError.response?.status === 401) {
        setError('Invalid credentials');
      } else {
        setError(requestError.response?.data?.message || 'Unable to sign in.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-card" aria-labelledby="login-heading">
        <p className="eyebrow">Welcome back</p>
        <h1 id="login-heading">Sign in to Recipe Book</h1>
        <p className="auth-intro">Pick up where your next great meal begins.</p>

        {error && <div className="form-error" role="alert">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <div className="auth-actions">
            <Link className="auth-forgot-link" to="/forgot-password">Forgot password?</Link>
          </div>

          <button className="auth-submit" type="submit" disabled={submitting}>
            {submitting ? <><span className="spinner" aria-hidden="true" /> Signing in...</> : 'Sign in'}
          </button>
        </form>

        <p className="auth-switch">
          New to Recipe Book? <Link to="/register">Create an account</Link>
        </p>
      </section>
    </main>
  );
}
