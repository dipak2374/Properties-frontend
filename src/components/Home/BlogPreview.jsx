import { motion } from 'framer-motion';
import { blogPreviews } from '../../data/homeMockData';

export default function BlogPreview() {
  return (
    <section className="blog-preview-section">
      <div className="section-headline">
        <h2>Latest from our Blog</h2>
        <a href="/blog">Read More Articles</a>
      </div>
      <div className="blog-grid">
        {blogPreviews.map((post, i) => (
          <motion.article 
            key={post.id} 
            className="blog-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <div className="blog-image">
              <img src={post.image} alt={post.title} />
              <span className="blog-category">{post.category}</span>
            </div>
            <div className="blog-content">
              <p className="blog-date">{post.date}</p>
              <h3>{post.title}</h3>
              <a href={`/blog/${post.id}`} className="read-more">Read Full Article →</a>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
