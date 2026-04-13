import { Link } from 'react-router-dom';

export default function TopBar() {
  return (
    <div className="topbar">
      <div className="topbar-inner container">
        <span className="topbar-contact">Student-Led Non-Profit · info@bittersweetlemonade.com</span>
        <nav className="topbar-nav">
          <Link to="/blog">News</Link>
          <a href="https://discord.gg" target="_blank" rel="noreferrer">Discord</a>
        </nav>
      </div>
    </div>
  );
}
