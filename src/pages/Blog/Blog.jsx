import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { blogPosts } from '../../data/blogPosts';
import '../../styles/home.css';
import '../../styles/pages.css';

export default function Blog() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="page-shell">
      <main className="page-content">
        <motion.section className="page-head" initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <div>
            <p className="breadcrumb">Home / Blog</p>
            <h1>Property Insights</h1>
            <p>Explore expert guidance, market trends, and practical advice for buyers, renters, and investors.</p>
          </div>
          <Link to="/pricing" className="button button-primary">View Pricing</Link>
        </motion.section>

        <div className="blog-grid">
          {blogPosts.map((post, index) => (
            <motion.article key={post.slug} className="blog-card" initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }} whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
              <img src={post.image} alt={post.title} loading="lazy" />
              <div className="blog-card-body">
                <div className="blog-meta">
                  <span>{post.category}</span>
                  <span>{post.readTime}</span>
                </div>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <Link to={`/blog/${post.slug}`} className="button button-secondary">Read Article</Link>
              </div>
            </motion.article>
          ))}
        </div>
      </main>
    </div>
  );
}
