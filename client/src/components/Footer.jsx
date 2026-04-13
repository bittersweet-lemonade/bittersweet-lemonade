import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const SocialIcon = ({ service }) => {
  const icons = {
    facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>,
    instagram: <><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></>,
    youtube: <><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></>,
    tiktok: <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>,
    discord: <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {icons[service] || null}
    </svg>
  );
};

export default function Footer() {
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    fetch('/api/posts')
      .then(r => r.json())
      .then(data => setRecentPosts(data.slice(0, 5)))
      .catch(() => {});
  }, []);

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Column 1: Get in Touch */}
          <div className="footer-section">
            <img
              src="https://res.cloudinary.com/dx8zth9lo/image/upload/v1776052842/bittersweet-lemonade/2025/02/BittersweetLemonadeLogopng.png"
              alt="Bittersweet Lemonade Association"
              style={{ height: 52, width: 'auto', marginBottom: '1.25rem' }}
            />
            <h2>Get in touch!</h2>
            <p>Questions, membership, partnerships, or just to say hello. Reach out any time.</p>
            <div style={{ marginTop: '1rem' }}>
              <h4>info@bittersweet-lemonade.com</h4>
            </div>
          </div>

          {/* Column 2: Posts */}
          <div className="footer-section">
            <h2>Posts</h2>
            <div className="footer-posts">
              {recentPosts.map(post => (
                <Link key={post.id} to={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              ))}
              {recentPosts.length === 0 && (
                <Link to="/blog">View all posts</Link>
              )}
            </div>
          </div>

          {/* Column 3: Socials */}
          <div className="footer-section">
            <h2>Socials</h2>
            <div className="footer-socials">
              <a href="https://www.instagram.com/bittersweetlemonade.official/" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><SocialIcon service="instagram" /> @bittersweetlemonade.official</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Bittersweet Lemonade. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
