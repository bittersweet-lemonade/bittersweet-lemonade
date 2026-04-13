import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const footerH2 = 'font-heading text-[clamp(1.2rem,2.5vw,1.8rem)] uppercase text-lemon pb-3 mb-6 border-b border-[#3a3000] tracking-[0.05em] leading-tight';

export default function Footer() {
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch('/api/posts')
      .then(r => r.json())
      .then((data: Post[]) => setRecentPosts(data.slice(0, 5)))
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-ink text-[#FFF3A3] pt-[3vw] pb-[2vw] px-[4vw] border-t-[3px] border-lemon">
      <div className="max-w-[1200px] mx-auto">

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[2fr_1fr_1fr] gap-[2vw]">

          {/* Brand + contact */}
          <div className="sm:col-span-2 md:col-auto">
            <img
              src="https://res.cloudinary.com/dx8zth9lo/image/upload/v1776052842/bittersweet-lemonade/2025/02/BittersweetLemonadeLogopng.png"
              alt="Bittersweet Lemonade Association"
              className="h-[52px] w-auto mb-5"
            />
            <h2 className={footerH2}>Get in touch!</h2>
            <p className="text-[#bfaa50] text-[0.9rem]">
              Questions, membership, partnerships, or just to say hello. Reach out any time.
            </p>
            <div className="mt-4">
              <p className="text-[#bfaa50] text-[0.9rem] mb-0">info@bittersweet-lemonade.com</p>
            </div>
          </div>

          {/* Recent posts */}
          <div>
            <h2 className={footerH2}>Posts</h2>
            <div className="flex flex-col">
              {recentPosts.map(post => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="block text-[#9e8a30] text-[0.85rem] py-[0.3rem] border-b border-[#2a2000] hover:text-lemon transition-colors duration-200"
                >
                  {post.title}
                </Link>
              ))}
              {recentPosts.length === 0 && (
                <Link to="/blog" className="text-[#9e8a30] text-[0.85rem] hover:text-lemon transition-colors duration-200">
                  View all posts
                </Link>
              )}
            </div>
          </div>

          {/* Socials */}
          <div>
            <h2 className={footerH2}>Socials</h2>
            <div className="flex flex-col gap-2">
              <a
                href="https://www.instagram.com/bittersweetlemonade.official/"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-[0.6rem] text-[#9e8a30] text-[0.85rem] uppercase tracking-[0.05em] hover:text-lemon transition-colors duration-200"
              >
                <InstagramIcon /> @bittersweetlemonade.official
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-[#2a2000] text-center text-[#5a4e10] text-[0.8rem]">
          <p className="mb-0">&copy; {new Date().getFullYear()} Bittersweet Lemonade. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
