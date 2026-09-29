import { Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
  return (
    <main className="auth-shell">
      <section className="auth-card" aria-labelledby="forgot-password-heading">
        <p className="eyebrow">Reset access</p>
        <h1 id="forgot-password-heading">Forgot your password?</h1>
        <p className="auth-intro">
          Enter your email address and we&apos;ll help you get back into your account.
        </p>

        <form className="auth-form">
          <label htmlFor="reset-email">Email</label>
          <input id="reset-email" name="email" type="email" placeholder="you@example.com" />

          <button className="auth-submit" type="submit">Send reset link</button>
        </form>

        <p className="auth-switch">
          <Link to="/login">Back to sign in</Link>
        </p>
      </section>
    </main>
  );
}
