import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Meta from '../components/Meta';
import { Post } from '../types';

function SkeletonCard() {
  return (
    <div className="post-card skeleton-card">
      <div className="skeleton-img" />
      <div className="post-card-body">
        <div className="skeleton-line short" />
        <div className="skeleton-line" />
        <div className="skeleton-line medium" />
        <div className="skeleton-line short" style={{ marginTop: '1rem' }} />
      </div>
    </div>
  );
}

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/posts')
      .then(r => r.json())
      .then((data: Post[]) => { setPosts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Meta
        title="News"
        description="Events, performances, and updates from the Bittersweet Lemonade Association. Read about our charity concerts, fundraising milestones, and community highlights."
        path="/blog"
      />

      <div className="page-header">
        <h1>News</h1>
        <p>Events, performances, and updates from Bittersweet Lemonade</p>
      </div>

      <section className="section">
        <div className="container">
          <div className="posts-grid">
            {loading
              ? [1, 2, 3].map(i => <SkeletonCard key={i} />)
              : posts.map(post => (
                  <article key={post.id} className="post-card">
                    {post.featuredImage && (
                      <div className="post-card-image">
                        <img
                          src={post.featuredImage.replace('/upload/', '/upload/f_auto,q_auto/')}
                          alt={post.title}
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="post-card-body">
                      <div className="post-card-meta">
                        {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                      <h3>{post.title}</h3>
                      <p className="post-excerpt">{post.excerpt}</p>
                      <Link to={`/blog/${post.slug}`} className="post-card-link">Read More →</Link>
                    </div>
                  </article>
                ))
            }
          </div>
        </div>
      </section>
    </>
  );
}
