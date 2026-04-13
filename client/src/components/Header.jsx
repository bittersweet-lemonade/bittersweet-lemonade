import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

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
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen(prev => !prev)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <nav className={`main-nav${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(false)}>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/our-story">Our Story</NavLink>
          <NavLink to="/blog">News</NavLink>
          <NavLink to="/team">Our Team</NavLink>
        </nav>
      </div>
    </header>
  );
}
