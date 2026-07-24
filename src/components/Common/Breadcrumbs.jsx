import { Link, useLocation } from 'react-router-dom';
import './Breadcrumbs.css';

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav className="breadcrumb-nav" aria-label="breadcrumb">
      <Link to="/" className="breadcrumb-link">Home</Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        
        const displayName = decodeURIComponent(value)
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        return (
          <span key={to} className="breadcrumb-item">
            <span className="breadcrumb-separator">/</span>
            {isLast ? (
              <span className="breadcrumb-current">{displayName}</span>
            ) : (
              <Link to={to} className="breadcrumb-link">{displayName}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
