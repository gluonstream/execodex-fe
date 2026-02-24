import { motion } from 'framer-motion';
import { Shield, Share2, Zap, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export function LandingPage() {
  return (
    <div className="landing-container">
      <div className="landing-content-wrapper">
        <section className="hero">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-content"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="logo-glow"
            >
              <h1 className="glitch-text" data-text="S4V3">S<span className="logo-alt">4</span>V<span className="logo-alt">3</span></h1>
            </motion.div>
            
            <p className="hero-subtitle">
              Secure. Anonymous. Reactive.
              <br />
              The ultimate way to share and save your digital assets.
            </p>
            
            <div className="cta-group">
              <Link to="/vault" className="cta-button primary">
                Access Your Vault
              </Link>
              <Link to="/about" className="cta-button secondary">
                Learn More
              </Link>
            </div>
          </motion.div>
        </section>

        <section className="features-grid">
          <FeatureCard 
            icon={<Shield size={32} />}
            title="End-to-End Privacy"
            description="Your files are your business. We ensure they stay that way with cutting-edge encryption."
            delay={0.2}
          />
          <FeatureCard 
            icon={<Share2 size={32} />}
            title="Instant Sharing"
            description="Generate secure, expiring links in seconds. Share anything with anyone, anywhere."
            delay={0.4}
          />
          <FeatureCard 
            icon={<Zap size={32} />}
            title="Lightning Fast"
            description="Optimized for speed. Upload and download at the limit of your connection."
            delay={0.6}
          />
          <FeatureCard 
            icon={<Lock size={32} />}
            title="Secure by Design"
            description="Built on robust infrastructure, designed to protect your data against all threats."
            delay={0.8}
          />
        </section>

        <footer className="landing-footer">
          <p>&copy; {new Date().getFullYear()} muonstream - Built with passion and mathematics.</p>
        </footer>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -10, transition: { duration: 0.2 } }}
      className="feature-card"
    >
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </motion.div>
  );
}
