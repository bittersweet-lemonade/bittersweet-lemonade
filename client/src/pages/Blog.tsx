import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Meta from '../components/Meta';
import { Post } from '../types';

function SkeletonCard() {
  return (
    <div className="border-[1.5px] border-brand-border bg-white overflow-hidden">
      <div className="skeleton w-full aspect-[16/9]" />
      <div className="p-6">
        <div className="skeleton h-[12px] w-[45%] mb-3 rounded-sm" />
        <div className="skeleton h-[14px] w-full mb-2 rounded-sm" />
        <div className="skeleton h-[14px] w-[70%] mb-2 rounded-sm" />
        <div className="skeleton h-[12px] w-[45%] mt-4 rounded-sm" />
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
        description="Concert recaps, fundraising milestones, and community updates from Bittersweet Lemonade — Vancouver, BC's youth charity music association."
        image="https://res.cloudinary.com/dx8zth9lo/image/upload/f_auto,q_auto,w_1200,h_630,c_fill,g_auto/v1776052809/bittersweet-lemonade/2025/10/DSC07731.jpg"
        path="/blog"
        breadcrumb="News"
      />

      <div className="page-header">
        <h1>News</h1>
        <p>Events, performances, and updates from Bittersweet Lemonade</p>
      </div>

      <section className="py-20 px-[4vw]">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-8">
            {loading
              ? [1, 2, 3].map(i => <SkeletonCard key={i} />)
              : posts.map(post => (
                  <article
                    key={post.id}
                    className="border-[1.5px] border-brand-border bg-white overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(196,154,0,0.18)]"
                  >
                    {post.featuredImage && (
                      <div className="aspect-[16/9] overflow-hidden bg-lemon-mid">
                        <img
                          src={post.featuredImage.replace('/upload/', '/upload/f_auto,q_auto/')}
                          alt={post.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="text-[0.78rem] uppercase tracking-[0.06em] text-lemon-dark font-bold mb-2">
                        {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                      <h3 className="text-[1.1rem] mb-2 leading-[1.3] text-ink">{post.title}</h3>
                      <p className="text-[0.9rem] text-ink-muted mb-4 post-excerpt">{post.excerpt}</p>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="text-[0.8rem] uppercase tracking-[0.05em] font-bold text-lemon-dark border-b border-lemon-dark hover:text-lemon-bright hover:border-lemon-bright transition-colors duration-200"
                      >
                        Read More →
                      </Link>
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
