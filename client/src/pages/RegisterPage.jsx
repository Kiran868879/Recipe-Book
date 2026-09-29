import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext';

function getApiErrors(error) {
  const response = error.response?.data;

  if (response?.errors?.length) {
    return response.errors.map((item) => item.msg || item.message).join(' ');
  }

  return response?.message || 'Unable to create your account.';
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
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
      const data = await authService.register(form);
      register(data, data.token);
      navigate('/', { replace: true });
    } catch (requestError) {
      setError(getApiErrors(requestError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-card" aria-labelledby="register-heading">
        <p className="eyebrow">Recipe Book</p>
        <h1 id="register-heading">Create your account</h1>
        <p className="auth-intro">Keep your recipes organized in one delicious place.</p>

        {error && <div className="form-error" role="alert">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} required />

          <label htmlFor="register-email">Email</label>
          <input
            id="register-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="register-password">Password</label>
          <input
            id="register-password"
            name="password"
            type="password"
            minLength="6"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button className="auth-submit" type="submit" disabled={submitting}>
            {submitting ? <><span className="spinner" aria-hidden="true" /> Creating account...</> : 'Create account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
}
