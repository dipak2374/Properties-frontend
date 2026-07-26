import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { logout } from '../../redux/authSlice';

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/properties', label: 'Properties' },
  { to: '/all', label: 'All' },
  { to: '/agents', label: 'Agents' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const shouldReduceMotion = useReducedMotion();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeNavItems = [...navItems];

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <motion.header
        className="site-header"
        initial={shouldReduceMotion ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div className="brand logo-brand" whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }} whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}>
          <NavLink to="/" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <img src="/images/b-logo.png" alt="PropertyHub logo" className="brand-logo" />
            <div className="brand-copy">
              <img src="/images/br-logo.png" alt="PropertyHub logo" className="brands-logo" />
            </div>
          </NavLink>
        </motion.div>

        <nav className="site-nav desktop-nav" aria-label="Primary navigation">
          {activeNavItems.map((item) => (
            <motion.div key={item.to} whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.01 }}>
              <NavLink to={item.to} end={item.end} className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeMenu}>
                {item.label}
              </NavLink>
            </motion.div>
          ))}
        </nav>

        <div className="site-actions">
          <motion.button
            type="button"
            className="mobile-nav-toggle"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
          >
            ☰
          </motion.button>
          <motion.div whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }} whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}>
            <NavLink to="/wishlist" className="icon-button" aria-label="Wishlist" onClick={closeMenu}>♡</NavLink>
          </motion.div>
          <div className="desktop-auth" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {user ? (
              <>
                <motion.div whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }} whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}>
                  <NavLink to={user?.role === 'seller' || user?.role === 'agent' ? '/dashboard' : '/profile'} className="button button-secondary" onClick={closeMenu}>Profile</NavLink>
                </motion.div>
                <motion.button type="button" className="button button-secondary" onClick={() => dispatch(logout())} whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }} whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}>
                  Sign Out
                </motion.button>
              </>
            ) : (
              <motion.div whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }} whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}>
                <NavLink to="/login" className="button button-primary" onClick={closeMenu}>
                  Sign In
                </NavLink>
              </motion.div>
            )}
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileMenuOpen ? (
          <>
            <motion.button
              type="button"
              className="mobile-nav-backdrop"
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMenu}
              aria-label="Close navigation"
            />
            <motion.nav
              className="mobile-nav-panel"
              id="mobile-navigation"
              initial={shouldReduceMotion ? false : { x: '100%' }}
              animate={{ x: 0 }}
              exit={shouldReduceMotion ? undefined : { x: '100%' }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              aria-label="Mobile navigation"
            >
              <div className="mobile-nav-panel-header">
                <span>Menu</span>
                <button type="button" className="mobile-nav-close" onClick={closeMenu} aria-label="Close menu">✕</button>
              </div>
              {activeNavItems.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeMenu}>
                  {item.label}
                </NavLink>
              ))}
              
              <div className="mobile-auth-actions" style={{ marginTop: 'auto', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid #e2e8f0' }}>
                {user ? (
                  <>
                    <NavLink to={user?.role === 'seller' || user?.role === 'agent' ? '/dashboard' : '/profile'} className="button button-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={closeMenu}>Profile</NavLink>
                    <button type="button" className="button button-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => { dispatch(logout()); closeMenu(); }}>Sign Out</button>
                  </>
                ) : (
                  <NavLink to="/login" className="button button-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={closeMenu}>
                    <span className="button-icon-left" aria-hidden="true">🔑</span>
                    Sign In
                  </NavLink>
                )}
              </div>
            </motion.nav>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
