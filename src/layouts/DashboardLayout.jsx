import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import '../styles/dashboard.css';

const sidebarItems = [
  { name: 'Dashboard', path: '/dashboard', icon: '📊' },
  { name: 'My Properties', path: '/dashboard/properties', icon: '🏢' },
  { name: 'Appointments', path: '/dashboard/appointment', icon: '📅' },
  { name: 'Messages', path: '/messages', icon: '💬' },
  { name: 'Reviews', path: '/dashboard/reviews', icon: '⭐' },
  { name: 'Analytics', path: '/dashboard/analytics', icon: '📈' },
  { name: 'Earnings', path: '/dashboard/earnings', icon: '💰' },
  { name: 'Profile', path: '/profile', icon: '👤' },
  { name: 'Settings', path: '/dashboard/settings', icon: '⚙️' },
];

export default function DashboardLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth?.user) || { name: 'Agent User', email: 'agent@propertyhub.com' };
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="dashboard-container">
      {/* Mobile Sidebar Backdrop Overlay */}
      {sidebarOpen && (
        <div 
          className="dashboard-sidebar-backdrop" 
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Left Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-logo">
          <span>🏠 PropertyHub</span>
          <button 
            type="button" 
            className="sidebar-close-btn" 
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>
        <nav className="sidebar-menu">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              end={item.path === '/dashboard'}
              onClick={closeSidebar}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
          <button
            type="button"
            onClick={handleLogout}
            className="sidebar-link"
            style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left', marginTop: 'auto' }}
          >
            <span className="sidebar-link-icon">🚪</span>
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Content Area */}
      <div className="dashboard-content-area">
        {/* Top Navbar */}
        <header className="dashboard-topnav">
          <div className="topnav-left">
            <button 
              type="button" 
              className="dashboard-menu-toggle" 
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation menu"
            >
              ☰
            </button>
            <div className="topnav-search">
              <label htmlFor="dashboard-topnav-search" style={{ display: 'none' }}>Search listings</label>
              <input
                id="dashboard-topnav-search"
                type="text"
                placeholder="Search listings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search"
              />
            </div>
          </div>

          <div className="topnav-actions">
            <div className="topnav-button-group">
              <button type="button" className="topnav-icon-btn" aria-label="Messages: 0 new messages">
                💬
                <span className="notification-badge" />
              </button>
              <button type="button" className="topnav-icon-btn" aria-label="Notifications: 0 new notifications">
                🔔
                <span className="notification-badge" />
              </button>
            </div>

            <div className="user-avatar-wrap">
              <div className="user-avatar">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="user-meta">
                <span>{user.name || 'User'}</span>
                <span>{user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Agent'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main View */}
        <main className="dashboard-main-view">
          <AnimatePresence mode="wait">
            <motion.div
              key={useLocation().pathname}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="dashboard-main-content"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}