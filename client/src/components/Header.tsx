import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const navLink = ({ isActive }: { isActive: boolean }) =>
  `text-[0.88em] uppercase tracking-[0.08em] font-semibold transition-colors duration-200 py-1 border-b-2 ${
    isActive ? 'text-lemon border-lemon' : 'text-[#ccc] border-transparent hover:text-lemon-bright'
  }`;

const mobileNavLink = ({ isActive }: { isActive: boolean }) =>
  `text-[1rem] uppercase tracking-[0.08em] font-semibold py-3 border-b border-[#2a2000] transition-colors duration-200 ${
    isActive ? 'text-lemon' : 'text-[#ccc] hover:text-lemon'
  }`;

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => { setMenuOpen(false); }, [location]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <header className="bg-ink sticky top-0 z-[100] shadow-[0_2px_12px_rgba(0,0,0,0.4)] border-b-[3px] border-lemon px-[4vw]">
      <div className="flex justify-between items-center gap-4 max-w-[1200px] mx-auto min-h-[64px]">

        {/* Logo */}
        <Link to="/" className="flex items-center shrink-0 group">
          <img
            src="https://res.cloudinary.com/dx8zth9lo/image/upload/v1776052842/bittersweet-lemonade/2025/02/BittersweetLemonadeLogopng.png"
            alt="Bittersweet Lemonade Association"
            className="h-12 w-auto object-contain transition-opacity duration-200 group-hover:opacity-80"
          />
        </Link>

        {/* Mobile toggle */}
        <button
          className="sm:hidden bg-transparent border-none text-lemon text-[1.5rem] p-2 cursor-pointer"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(prev => !prev)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        {/* Desktop nav */}
        <nav className="hidden sm:flex gap-6 items-center">
          <NavLink to="/" end className={navLink}>Home</NavLink>
          <NavLink to="/our-story" className={navLink}>Our Story</NavLink>
          <NavLink to="/blog" className={navLink}>News</NavLink>
          <NavLink to="/team" className={navLink}>Our Team</NavLink>
          <NavLink to="/contact" className={navLink}>Contact</NavLink>
        </nav>

        {/* Backdrop */}
        {menuOpen && (
          <div
            className="sm:hidden fixed inset-0 bg-black/55 z-[199]"
            onClick={() => setMenuOpen(false)}
          />
        )}

        {/* Mobile drawer */}
        <nav
          className={`sm:hidden fixed top-0 right-0 bottom-0 w-[min(280px,80vw)] bg-ink border-l-[3px] border-lemon flex flex-col pt-20 px-8 pb-8 gap-1 z-[200] transition-transform duration-300 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          aria-hidden={!menuOpen}
        >
          <NavLink to="/" end className={mobileNavLink}>Home</NavLink>
          <NavLink to="/our-story" className={mobileNavLink}>Our Story</NavLink>
          <NavLink to="/blog" className={mobileNavLink}>News</NavLink>
          <NavLink to="/team" className={mobileNavLink}>Our Team</NavLink>
          <NavLink to="/contact" className={mobileNavLink}>Contact</NavLink>
        </nav>
      </div>
    </header>
  );
}
