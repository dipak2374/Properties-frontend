import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/home.css';
import '../../styles/pages.css';
import { setAuth } from '../../redux/authSlice';
import { signUp } from '../../services/authService';
import {
  validateEmail,
  validateName,
  validatePhone,
  validateStrongPassword,
  validateConfirmPassword,
  getPasswordStrength,
  runValidators,
} from '../../utils/validate';

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
    icon: '🏡',
    title: 'Find your dream home',
    description: 'Create an account and get started with curated listings.',
  },
  {
    icon: '❤️',
    title: 'Save favorites',
    description: 'Keep track of properties you love and compare them later.',
  },
  {
    icon: '🔔',
    title: 'Receive alerts',
    description: 'Get notified when new properties match your preferences.',
  },
  {
    icon: '🔒',
    title: 'Secure access',
    description: 'Your account is protected with encrypted login and data privacy.',
  },
];

const STRENGTH_MAX = 5;

function PasswordStrengthMeter({ password }) {
  if (!password) return null;
  const { score, label, color } = getPasswordStrength(password);

  return (
    <div className="password-strength" aria-live="polite" aria-label={`Password strength: ${label}`}>
      <div className="password-strength-bars">
        {Array.from({ length: STRENGTH_MAX }).map((_, index) => (
          <div
            key={index}
            className="password-strength-bar"
            style={{ background: index < score ? color : undefined }}
          />
        ))}
      </div>
      <span className="password-strength-label" style={{ color }}>
        {label}
      </span>
    </div>
  );
}

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', role: 'user', profilePicture: null });
  const [profilePicturePreview, setProfilePicturePreview] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [touched, setTouched] = useState({ name: false, email: false, phone: false, password: false, confirmPassword: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getPopupBlockedMessage = (provider) => {
      if (provider === 'apple') {
        return 'Popup blocked. Please allow popups and try Apple Sign In again.';
      }
      if (provider === 'facebook') {
        return 'Popup blocked. Please allow popups and try Facebook sign in again.';
      }
      return 'Popup blocked. Please allow popups and try again.';
    };

    const handleAuthMessage = (event) => {
      // Only accept messages from our API server origin
      const apiOrigin = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005/api').replace(/\/api\/?$/, '');
      if (event.origin !== apiOrigin) return;

      const type = event.data?.type;
      if (!type || typeof type !== 'string' || !type.startsWith('propertyhub-') || !type.endsWith('-auth')) {
        return;
      }

      const provider = type.split('-')[1] || 'provider';
      if (event.data?.error) {
        const message = provider === 'apple'
          ? `Apple Sign In failed. ${event.data.error}`
          : event.data.error;
        setError(message);
        setLoading(false);
        return;
      }

      const { payload } = event.data;
      if (payload?.user && payload?.token) {
        dispatch(setAuth({ user: payload.user, token: payload.token }));
        const targetPath = (payload.user?.role === 'seller' || payload.user?.role === 'agent') ? '/dashboard' : '/';
        navigate(targetPath);
        setLoading(false);
      }
    };

    window.addEventListener('message', handleAuthMessage);
    return () => window.removeEventListener('message', handleAuthMessage);
  }, [dispatch, navigate]);

  useEffect(() => {
    return () => {
      if (profilePicturePreview) {
        URL.revokeObjectURL(profilePicturePreview);
      }
    };
  }, [profilePicturePreview]);

  const validateField = (name, value) => {
    if (name === 'name') return validateName(value);
    if (name === 'email') return validateEmail(value);
    if (name === 'phone') return validatePhone(value);
    if (name === 'password') return validateStrongPassword(value);
    if (name === 'confirmPassword') return validateConfirmPassword(formData.password, value);
    return '';
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextValue = name === 'phone' ? value.replace(/\D/g, '').slice(0, 10) : value;
    setFormData((current) => ({ ...current, [name]: nextValue }));
    if (touched[name]) {
      setFieldErrors((current) => ({ ...current, [name]: validateField(name, nextValue) }));
    }
    // Re-validate confirmPassword whenever password changes
    if (name === 'password' && touched.confirmPassword) {
      setFieldErrors((current) => ({
        ...current,
        confirmPassword: validateConfirmPassword(value, formData.confirmPassword),
      }));
    }
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files?.[0] || null;

    if (profilePicturePreview) {
      URL.revokeObjectURL(profilePicturePreview);
    }

    setFormData((current) => ({ ...current, profilePicture: file }));
    setProfilePicturePreview(file ? URL.createObjectURL(file) : '');
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
    setTouched({ name: true, email: true, phone: true, password: true, confirmPassword: true });
    const { errors, hasError } = runValidators({
      name: () => validateName(formData.name),
      email: () => validateEmail(formData.email),
      phone: () => validatePhone(formData.phone),
      password: () => validateStrongPassword(formData.password),
      confirmPassword: () => validateConfirmPassword(formData.password, formData.confirmPassword),
    });
    setFieldErrors(errors);
    if (hasError) return;

    setLoading(true);
    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('email', formData.email);
      payload.append('phone', formData.phone);
      payload.append('password', formData.password);
      payload.append('role', formData.role);
      if (formData.role === 'seller' && formData.profilePicture) {
        payload.append('profilePicture', formData.profilePicture);
      }

      const response = await signUp(payload);
      if (response?.user && response?.token) {
        dispatch(setAuth({ user: response.user, token: response.token }));
        const targetPath = (response.user?.role === 'seller' || response.user?.role === 'agent') ? '/dashboard' : '/';
        navigate(targetPath);
      } else {
        throw new Error('Unable to create your account.');
      }
    } catch (err) {
      setError(err.message || 'Unable to create your account.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSSO = (provider) => {
    setError('');

    if (provider === 'google') {
      setLoading(true);
      const popup = window.open(`${apiBaseUrl}/auth/google/login`, 'propertyhub-google', 'width=560,height=700');
      if (!popup) {
        setError('Popup blocked. Please allow popups and try again.');
        setLoading(false);
      }
      return;
    }

    if (provider === 'facebook') {
      if (!facebookEnabled) {
        setError('Facebook Sign In is not currently configured.');
        return;
      }
      setLoading(true);
      const popup = window.open(`${apiBaseUrl}/auth/facebook/login`, 'propertyhub-facebook', 'width=560,height=700');
      if (!popup) {
        setError('Popup blocked. Please allow popups and try again.');
        setLoading(false);
      }
      return;
    }

    if (provider === 'apple') {
      if (!appleEnabled) {
        setError('Apple Sign In is not currently configured.');
        return;
      }
      setLoading(true);
      const popup = window.open(`${apiBaseUrl}/auth/apple/login`, 'propertyhub-apple', 'width=560,height=700');
      if (!popup) {
        setError(getPopupBlockedMessage(provider));
        setLoading(false);
      }
      return;
    }

    setError(`Coming Soon: ${provider.charAt(0).toUpperCase() + provider.slice(1)} sign-up will be available shortly.`);
  };

  const inputClass = (field) => {
    if (fieldErrors[field]) return 'input-invalid';
    if (touched[field] && formData[field]) return 'input-valid';
    return '';
  };

  return (
    <div className="page-shell login-page register-page">
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
            <h1>Create your account</h1>
            <p>Join PropertyHub to manage saved homes, track listings, and make better property decisions.</p>

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
            <h2>Register</h2>
            <p>Enter your details to create a PropertyHub account.</p>
            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              <label>
                Account Type
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    color: '#1e293b',
                    outline: 'none',
                    fontSize: '0.9rem',
                    marginTop: '0.25rem'
                  }}
                >
                  <option value="user">Regular User (Buyer)</option>
                  <option value="seller">Real Estate Agent (Seller)</option>
                </select>
              </label>
              <label>
                Full Name
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  aria-label="Full Name"
                  aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                  aria-invalid={Boolean(fieldErrors.name)}
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClass('name')}
                />
                {fieldErrors.name && (
                  <span id="name-error" className="field-error" role="alert">{fieldErrors.name}</span>
                )}
              </label>
              {formData.role === 'seller' && (
                <label>
                  Agent Profile Picture
                  <div className="profile-picture-field">
                    <div className="profile-picture-preview">
                      {profilePicturePreview ? (
                        <img src={profilePicturePreview} alt="Agent profile preview" />
                      ) : (
                        <span>{formData.name ? formData.name.charAt(0).toUpperCase() : 'A'}</span>
                      )}
                    </div>
                    <input
                      type="file"
                      name="profilePicture"
                      accept="image/*"
                      aria-label="Agent Profile Picture"
                      onChange={handleProfilePictureChange}
                    />
                  </div>
                </label>
              )}
              <label>
                Email Address
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  aria-label="Email Address"
                  aria-describedby={fieldErrors.email ? 'reg-email-error' : undefined}
                  aria-invalid={Boolean(fieldErrors.email)}
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClass('email')}
                />
                {fieldErrors.email && (
                  <span id="reg-email-error" className="field-error" role="alert">{fieldErrors.email}</span>
                )}
              </label>
              <label>
                Phone Number
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  inputMode="numeric"
                  maxLength={10}
                  pattern="[0-9]{10}"
                  aria-label="Phone Number"
                  aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
                  aria-invalid={Boolean(fieldErrors.phone)}
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClass('phone')}
                />
                {fieldErrors.phone && (
                  <span id="phone-error" className="field-error" role="alert">{fieldErrors.phone}</span>
                )}
              </label>
              <label>
                Password
                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  aria-label="Password"
                  aria-describedby={fieldErrors.password ? 'reg-password-error' : 'password-strength-hint'}
                  aria-invalid={Boolean(fieldErrors.password)}
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClass('password')}
                />
                <PasswordStrengthMeter password={formData.password} />
                {fieldErrors.password && (
                  <span id="reg-password-error" className="field-error" role="alert">{fieldErrors.password}</span>
                )}
              </label>
              <label>
                Confirm Password
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  aria-label="Confirm Password"
                  aria-describedby={fieldErrors.confirmPassword ? 'confirm-error' : undefined}
                  aria-invalid={Boolean(fieldErrors.confirmPassword)}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClass('confirmPassword')}
                />
                {fieldErrors.confirmPassword && (
                  <span id="confirm-error" className="field-error" role="alert">{fieldErrors.confirmPassword}</span>
                )}
              </label>
              <div className="auth-meta">
                <label className="checkbox-label">
                  <input type="checkbox" required /> I agree to the Privacy Policy
                </label>
              </div>
              {error ? <motion.p className="auth-error" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>{error}</motion.p> : null}
              <motion.button type="submit" className="button button-primary" disabled={loading} whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }} whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}>
                {loading ? 'Creating account...' : 'Create account'}
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
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </motion.div>

          <motion.div className="auth-note" initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.35 }}>
            <div>
              <strong>Start saving your favorite properties.</strong>
              <p>We keep your information private and secure.</p>
            </div>
          </motion.div>
        </motion.section>
      </main>
    </div>
  );
}
