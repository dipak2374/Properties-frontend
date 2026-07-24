import { motion } from 'framer-motion';

export default function DownloadApp() {
  return (
    <section className="download-app-section">
      <div className="download-app-container">
        <motion.div 
          className="download-app-content"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
        >
          <h2>PropertyHub in your pocket.</h2>
          <p>Download our mobile app to search properties, contact agents, and schedule viewings on the go. Available for iOS and Android.</p>
          <div className="app-buttons">
            <a className="button button-secondary" href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer">App Store</a>
            <a className="button button-secondary" href="https://play.google.com/store" target="_blank" rel="noopener noreferrer">Google Play</a>
          </div>
        </motion.div>
        <motion.div 
          className="download-app-image"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
        >
          <div className="phone-mockup">
            <img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=400&q=80" alt="App interface" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
