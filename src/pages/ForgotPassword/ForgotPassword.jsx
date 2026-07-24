import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import '../../styles/home.css';
import '../../styles/pages.css';
import { validateEmail } from '../../utils/validate';

export default function ForgotPassword() {
  const shouldReduceMotion = useReducedMotion();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (event) => {
    setEmail(event.target.value);
    if (touched) {
      setEmailError(validateEmail(event.target.value));
    }
  };

  const handleBlur = () => {
    setTouched(true);
    setEmailError(validateEmail(email));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError('');
    setTouched(true);

    const error = validateEmail(email);
    setEmailError(error);
    if (error) return;

    setLoading(true);
    try {
      // API call placeholder — replace with actual service call when available
      await new Promise((resolve) => setTimeout(resolve, 900));
      setSubmitted(true);
    } catch {
      setServerError('Unable to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell login-page">
      <main className="login-grid">
        <section
          className="login-hero"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1200&q=80)',
          }}
        >
          <div className="login-hero-copy">
            <img src="/images/br-logo.png" alt="PropertyHub logo" className="auth-logo" />
            <h1>Forgot password?</h1>
            <p>Enter your email below and we'll send you instructions to reset your password instantly.</p>
            <div className="login-features">
              <div className="login-feature">
                <span>📧</span>
                <div>
                  <h4>Email verification</h4>
                  <p>Receive a secure link to reset your account password.</p>
                </div>
              </div>
              <div className="login-feature">
                <span>⏱️</span>
                <div>
                  <h4>Fast recovery</h4>
                  <p>Get back into your account quickly and safely.</p>
                </div>
              </div>
              <div className="login-feature">
                <span>🔒</span>
                <div>
                  <h4>Protected access</h4>
                  <p>Your reset request is protected by secure account verification.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="auth-panel">
          <div className="auth-card">
            <h2>Reset your password</h2>
            <p>We will send a reset link to your registered email address.</p>

            {submitted ? (
              <motion.div
                className="form-success"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                <div className="form-success-icon">✓</div>
                <h3>Check your inbox!</h3>
                <p>
                  We've sent a password reset link to <strong>{email}</strong>. Check your spam folder if you don't see it.
                </p>
                <Link to="/login" className="button button-primary" style={{ marginTop: '0.5rem' }}>
                  Back to Login
                </Link>
              </motion.div>
            ) : (
              <form className="auth-form" onSubmit={handleSubmit} noValidate>
                <label>
                  Email Address
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    aria-label="Email Address"
                    aria-describedby={emailError ? 'forgot-email-error' : undefined}
                    aria-invalid={Boolean(emailError)}
                    value={email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={emailError ? 'input-invalid' : touched && email ? 'input-valid' : ''}
                  />
                  {emailError && (
                    <span id="forgot-email-error" className="field-error" role="alert">{emailError}</span>
                  )}
                </label>
                {serverError && (
                  <motion.p className="auth-error" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
                    {serverError}
                  </motion.p>
                )}
                <motion.button
                  type="submit"
                  className="button button-primary"
                  disabled={loading}
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
                >
                  {loading ? 'Sending...' : 'Send reset link'}
                </motion.button>
              </form>
            )}

            <p className="auth-caption">
              Remember your password? <Link to="/login">Back to login</Link>
            </p>
          </div>
          <div className="auth-note">
            <div>
              <strong>Need help?</strong>
              <p>Contact support if you have trouble accessing your account.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
