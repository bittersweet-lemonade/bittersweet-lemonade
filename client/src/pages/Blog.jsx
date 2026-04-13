import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/posts')
      .then(r => r.json())
      .then(data => { setPosts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="page-header">
        <h1>News</h1>
        <p>Events, performances, and updates from Bittersweet Lemonade</p>
      </div>

      <section className="section">
        <div className="container">
          {loading ? (
            <div className="loading">Loading…</div>
          ) : (
            <div className="posts-grid">
              {posts.map(post => (
                <article key={post.id} className="post-card">
                  {post.featuredImage && (
                    <div className="post-card-image">
                      <img src={post.featuredImage} alt={post.title} loading="lazy" />
                    </div>
                  )}
                  <div className="post-card-body">
                    <div className="post-card-meta">
                      {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <Link to={`/blog/${post.slug}`} className="post-card-link">Read More →</Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
