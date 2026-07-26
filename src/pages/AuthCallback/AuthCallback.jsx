import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuth } from '../../redux/authSlice';
import PageLoader from '../../components/Common/PageLoader';

/**
 * /auth/callback
 * Handles the redirect-based Google OAuth flow.
 * The backend redirects here with ?token=...&user=... after successful Google login.
 * On error the backend redirects with ?error=...
 */
export default function AuthCallback() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');
    const error = searchParams.get('error');

    if (error) {
      navigate(`/login?error=${encodeURIComponent(error)}`, { replace: true });
      return;
    }

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        dispatch(setAuth({ user, token }));
        const role = user?.role;
        if (role === 'admin') navigate('/admin', { replace: true });
        else if (role === 'seller' || role === 'agent') navigate('/dashboard', { replace: true });
        else navigate('/', { replace: true });
      } catch {
        navigate('/login?error=Invalid+authentication+response', { replace: true });
      }
      return;
    }

    // No token or error — redirect back to login
    navigate('/login', { replace: true });
  }, [dispatch, navigate, searchParams]);

  return <PageLoader label="Signing you in with Google…" />;
}
