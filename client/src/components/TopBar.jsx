import { Link } from 'react-router-dom';

export default function TopBar() {
  return (
    <div className="topbar">
      <div className="topbar-inner container">
        <span className="topbar-contact">Student Led Nonprofit · info@bittersweet-lemonade.com</span>
        <nav className="topbar-nav">
          <Link to="/blog">Latest Updates</Link>
          <a href="https://www.instagram.com/bittersweetlemonade.official/" target="_blank" rel="noreferrer">Instagram</a>
        </nav>
      </div>
    </div>
  );
}
