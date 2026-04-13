import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Meta from '../components/Meta';
import { Post } from '../types';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    fetch(`/api/posts/${slug}`)
      .then(r => {
        if (!r.ok) { setNotFound(true); return null; }
        return r.json() as Promise<Post>;
      })
      .then(data => { if (data) setPost(data); setLoading(false); })
      .catch(() => { setLoading(false); setNotFound(true); });
  }, [slug]);

  if (loading) return (
    <>
      <Meta title="Loading…" path={`/blog/${slug}`} />
      <div className="loading">Loading…</div>
    </>
  );

  if (notFound) return (
    <>
      <Meta title="Post Not Found" path={`/blog/${slug}`} />
      <div className="not-found">
        <h2>Post Not Found</h2>
        <p>That post doesn't exist or has been removed.</p>
        <Link to="/blog" className="btn btn-primary">Back to Blog</Link>
      </div>
    </>
  );

  if (!post) return null;

  return (
    <>
      <Meta
        title={post.title}
        description={post.excerpt}
        image={post.featuredImage ?? undefined}
        path={`/blog/${post.slug}`}
      />

      <div className="single-post">
        <Link to="/blog" className="back-link">← Back to Blog</Link>
        <div className="single-post-meta">
          {post.category} · {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        <h1>{post.title}</h1>
        {post.featuredImage && (
          <div className="single-post-featured">
            <img
              src={post.featuredImage.replace('/upload/', '/upload/f_auto,q_auto/')}
              alt={post.title}
            />
          </div>
        )}
        <div
          className="single-post-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </>
  );
}
