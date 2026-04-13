import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close drawer on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="header-inner container">
        <Link to="/" className="site-logo-link">
          <img
            src="https://res.cloudinary.com/dx8zth9lo/image/upload/v1776052842/bittersweet-lemonade/2025/02/BittersweetLemonadeLogopng.png"
            alt="Bittersweet Lemonade Association"
            className="site-logo"
          />
        </Link>

        <button
          className="nav-toggle"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(prev => !prev)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        {/* Desktop nav */}
        <nav className="main-nav desktop-nav">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/our-story">Our Story</NavLink>
          <NavLink to="/blog">News</NavLink>
          <NavLink to="/team">Our Team</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>

        {/* Mobile drawer backdrop */}
        {menuOpen && (
          <div className="nav-backdrop" onClick={() => setMenuOpen(false)} />
        )}

        {/* Mobile drawer */}
        <nav className={`mobile-nav${menuOpen ? ' open' : ''}`} aria-hidden={!menuOpen}>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/our-story">Our Story</NavLink>
          <NavLink to="/blog">News</NavLink>
          <NavLink to="/team">Our Team</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
      </div>
    </header>
  );
}
