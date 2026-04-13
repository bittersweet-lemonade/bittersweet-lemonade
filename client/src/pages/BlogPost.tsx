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
        <Link to="/blog" className="btn-primary">Back to Blog</Link>
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

      <div className="max-w-[800px] mx-auto py-16 px-[4vw]">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-[0.82rem] uppercase tracking-[0.05em] mb-8 text-lemon-dark font-bold hover:text-ink transition-colors duration-200"
        >
          ← Back to Blog
        </Link>

        <div className="text-[0.82rem] uppercase tracking-[0.05em] text-lemon-dark font-bold mb-4">
          {post.category} · {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>

        <h1 className="text-[clamp(2rem,5vw,3.5rem)] mb-6 text-ink">{post.title}</h1>

        {post.featuredImage && (
          <div className="aspect-[16/9] overflow-hidden mb-8 border-[1.5px] border-brand-border">
            <img
              src={post.featuredImage.replace('/upload/', '/upload/f_auto,q_auto/')}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div
          className="text-[1.05rem] leading-[1.8] text-ink-mid [&_p]:mb-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </>
  );
}
