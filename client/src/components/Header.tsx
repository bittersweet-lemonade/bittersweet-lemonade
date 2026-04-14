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
          className="sm:hidden bg-transparent border-none text-lemon p-2 cursor-pointer"
          aria-label="Open navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(prev => !prev)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
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
          className={`sm:hidden fixed top-0 right-0 bottom-0 w-[min(280px,80vw)] bg-ink border-l-[3px] border-lemon flex flex-col z-[200] transition-transform duration-300 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          aria-hidden={!menuOpen}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-[#2a2000]">
            <span className="text-lemon text-[0.7rem] font-bold uppercase tracking-[0.12em]">Menu</span>
            <button
              className="text-lemon bg-transparent border-none text-[1.4rem] cursor-pointer leading-none p-1"
              aria-label="Close navigation"
              onClick={() => setMenuOpen(false)}
            >
              ✕
            </button>
          </div>

          {/* Nav links */}
          <div className="flex flex-col px-8 pt-4 flex-1">
            <NavLink to="/" end className={mobileNavLink}>Home</NavLink>
            <NavLink to="/our-story" className={mobileNavLink}>Our Story</NavLink>
            <NavLink to="/blog" className={mobileNavLink}>News</NavLink>
            <NavLink to="/team" className={mobileNavLink}>Our Team</NavLink>
            <NavLink to="/contact" className={mobileNavLink}>Contact</NavLink>
          </div>

          {/* Social links at bottom */}
          <div className="px-8 py-6 border-t border-[#2a2000] flex gap-5 items-center">
            <a
              href="https://www.instagram.com/bittersweetlemonade.official/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="text-lemon-dark hover:text-lemon transition-colors duration-200"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a
              href="mailto:info@bittersweet-lemonade.com"
              aria-label="Email"
              className="text-lemon-dark hover:text-lemon transition-colors duration-200"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
