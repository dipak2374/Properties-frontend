import { motion, useReducedMotion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { getBlogPostBySlug } from '../../data/blogPosts';
import '../../styles/home.css';
import '../../styles/pages.css';

export default function BlogDetails() {
  const { slug } = useParams();
  const shouldReduceMotion = useReducedMotion();
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return (
      <div className="page-shell">
        <main className="page-content">
          <div className="empty-state">The article you requested could not be found.</div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <main className="page-content blog-detail-shell">
        <motion.section className="page-head" initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <div>
            <p className="breadcrumb">Home / Blog / {post.title}</p>
            <h1>{post.title}</h1>
            <p>{post.excerpt}</p>
          </div>
          <Link to="/blog" className="button button-secondary">Back to Blog</Link>
        </motion.section>

        <motion.article className="blog-detail-card" initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <img src={post.image} alt={post.title} loading="lazy" />
          <div className="blog-detail-body">
            <div className="blog-meta">
              <span>{post.category}</span>
              <span>{post.readTime}</span>
              <span>By {post.author}</span>
            </div>
            {post.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </motion.article>
      </main>
    </div>
  );
}
