import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import '../../styles/home.css';
import '../../styles/pages.css';
import { setAuth } from '../../redux/authSlice';
import { signIn } from '../../services/authService';
import { validateEmail, validatePassword, runValidators } from '../../utils/validate';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005/api';
const facebookEnabled = import.meta.env.VITE_FACEBOOK_ENABLED === 'true';
const appleEnabled = import.meta.env.VITE_APPLE_ENABLED === 'true';

const socialProviders = [
  { name: 'Google', provider: 'google', iconSrc: '/images/google.png', alt: 'Google logo' },
  { name: 'Facebook', provider: 'facebook', iconSrc: '/images/facebook.png', alt: 'Facebook logo' },
  { name: 'Apple', provider: 'apple', iconSrc: '/images/apple.png', alt: 'Apple logo' },
];

const features = [
  {
    icon: '🏠',
    title: 'Explore Properties',
    description: 'Discover verified properties that match your needs.',
  },
  {
    icon: '🤍',
    title: 'Save Your Favorites',
    description: 'Save and compare your favorite properties easily.',
  },
  {
    icon: '🔔',
    title: 'Get Instant Alerts',
    description: 'Receive instant notifications for new listings and price updates.',
  },
  {
    icon: '🛡️',
    title: 'Secure & Trusted',
    description: 'Your data is safe with us. We ensure 100% privacy and security.',
  },
];

const getPostLoginPath = (user, fallbackPath = '/') => {
  if (user?.role === 'admin') {
    return '/admin';
  }
  if (user?.role === 'seller' || user?.role === 'agent') {
    return '/dashboard';
  }
  return fallbackPath;
};

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();
  const fromPath = location.state?.from?.pathname || '/';
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Handle error param from redirect-based OAuth callback
    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get('error');
    if (oauthError) {
      setError(decodeURIComponent(oauthError));
      // Clean the URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const validateField = (name, value) => {
    if (name === 'email') return validateEmail(value);
    if (name === 'password') return validatePassword(value);
    return '';
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    if (touched[name]) {
      setFieldErrors((current) => ({ ...current, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setTouched((current) => ({ ...current, [name]: true }));
    setFieldErrors((current) => ({ ...current, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    // Mark all fields as touched and run all validators
    setTouched({ email: true, password: true });
    const { errors, hasError } = runValidators({
      email: () => validateEmail(formData.email),
      password: () => validatePassword(formData.password),
    });
    setFieldErrors(errors);
    if (hasError) return;

    setLoading(true);
    try {
      const response = await signIn({ email: formData.email, password: formData.password });
      if (response?.user && response?.token) {
        dispatch(setAuth({ user: response.user, token: response.token }));
        navigate(getPostLoginPath(response.user, fromPath), { replace: true });
      } else {
        throw new Error('Unable to sign you in.');
      }
    } catch (err) {
      setError(err.message || 'Unable to sign you in.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSSO = (provider) => {
    setError('');

    if (provider === 'google') {
      setLoading(true);
      // Redirect-based OAuth: navigate directly to backend login URL.
      // Google redirects back to /auth/callback on success.
      window.location.href = `${apiBaseUrl}/auth/google/login`;
      return;
    }

    if (provider === 'facebook') {
      if (!facebookEnabled) {
        setError('Facebook Sign In is not currently configured.');
        return;
      }
      setLoading(true);
      window.location.href = `${apiBaseUrl}/auth/facebook/login`;
      return;
    }

    if (provider === 'apple') {
      if (!appleEnabled) {
        setError('Apple Sign In is not currently configured.');
        return;
      }
      setLoading(true);
      window.location.href = `${apiBaseUrl}/auth/apple/login`;
      return;
    }

    setError(`Coming Soon: ${provider.charAt(0).toUpperCase() + provider.slice(1)} sign-in will be available shortly.`);
  };

  return (
    <div className="page-shell login-page">
      <main className="login-grid">
        <motion.section
          className="login-hero"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80)',
          }}
          initial={shouldReduceMotion ? false : { opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="login-hero-copy">
            <img src="/images/br-logo.png" alt="PropertyHub logo" className="auth-logo" />
            <h1>Welcome Back!</h1>
            <p>Glad to see you again. Login to your account and continue your journey to find the perfect property.</p>

            <div className="login-features">
              {features.map((feature, index) => (
                <motion.div key={feature.title} className="login-feature" initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06, duration: 0.35 }}>
                  <span>{feature.icon}</span>
                  <div>
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section className="auth-panel" initial={shouldReduceMotion ? false : { opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
          <motion.div className="auth-card" initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h2>Login</h2>
            <p>Enter your details to access your account.</p>
            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              <label>
                Email Address
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  aria-label="Email Address"
                  aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                  aria-invalid={Boolean(fieldErrors.email)}
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={fieldErrors.email ? 'input-invalid' : touched.email && formData.email ? 'input-valid' : ''}
                />
                {fieldErrors.email && (
                  <span id="email-error" className="field-error" role="alert">{fieldErrors.email}</span>
                )}
              </label>
              <label>
                Password
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  aria-label="Password"
                  aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                  aria-invalid={Boolean(fieldErrors.password)}
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={fieldErrors.password ? 'input-invalid' : touched.password && formData.password ? 'input-valid' : ''}
                />
                {fieldErrors.password && (
                  <span id="password-error" className="field-error" role="alert">{fieldErrors.password}</span>
                )}
              </label>
              <div className="auth-meta">
                <label className="checkbox-label">
                  <input type="checkbox" /> Remember me
                </label>
                <Link to="/forgot-password" className="text-link">Forgot Password?</Link>
              </div>
              {error ? <motion.p className="auth-error" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>{error}</motion.p> : null}
              <motion.button type="submit" className="button button-primary" disabled={loading} whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }} whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}>
                {loading ? 'Signing in...' : 'Login'}
              </motion.button>
            </form>

            <div className="auth-divider">
              <span>or continue with</span>
            </div>

            <div className="auth-socials">
              {socialProviders
                .filter((provider) => (provider.provider !== 'apple' || appleEnabled) && (provider.provider !== 'facebook' || facebookEnabled))
                .map((provider) => (
                  <motion.button
                    key={provider.provider}
                    type="button"
                    className="social-button"
                    onClick={() => handleSocialSSO(provider.provider)}
                    disabled={loading}
                    whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                  >
                  <span className={`social-icon ${provider.provider}`}>
                    {provider.iconSrc ? <img src={provider.iconSrc} alt={provider.alt || provider.name} /> : provider.icon}
                  </span>
                  <span>{provider.name}</span>
                </motion.button>
              ))}
            </div>

            <p className="auth-caption">
              Don't have an account? <Link to="/register">Register Now</Link>
            </p>
          </motion.div>

          <motion.div className="auth-note" initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.35 }}>
            <div>
              <strong>Your information is safe with us.</strong>
              <p>We never share your data with anyone.</p>
            </div>
          </motion.div>
        </motion.section>
      </main>
    </div>
  );
}
