import { motion } from 'framer-motion';
import { Cpu, Network, Database, Layout, Terminal, Github, Users } from 'lucide-react';

export function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="about-container">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="glass-panel about-content-wrapper"
      >
        <motion.section variants={itemVariants} className="about-hero">
          <h2 className="glitch-text" data-text="About S4V3">About S<span className="logo-alt">4</span>V<span className="logo-alt">3</span></h2>
          <p className="about-lead">
            S4V3 is a secure file sharing and storage platform, powered by <strong>Mr. Nobody</strong> who wants to conquer the world and an Italian looking for a job.
          </p>
        </motion.section>

        <motion.section variants={itemVariants} className="origin-story-section">
          <div className="section-header">
             <Terminal className="section-icon" /> 
             <h3>The Origin Story</h3>
          </div>
          <div className="glass-panel story-card">
            <p>
              This project was originally born in a glorious <strong>Home Lab K8s cluster</strong>. 
              It actually worked! But then we realized two things:
            </p>
            <ul className="humor-list">
              <li>Server fans are surprisingly loud at 3 AM. 🔊</li>
              <li>We actually like to sleep without the fear of a power surge melting our "production" environment. 😴</li>
            </ul>
            <p>
              So, we moved everything to <strong>Hetzner Cloud</strong>. Now we can turn off our home computers, 
              save on the electricity bill, and sleep like babies while the cloud does the heavy lifting. ☁️✨
            </p>
          </div>
        </motion.section>

        <motion.section variants={itemVariants} className="architecture-section">
          <div className="section-header">
             <Cpu className="section-icon" /> 
             <h3>High-Level Architecture (Mostly)</h3>
          </div>
          <div className="architecture-grid">
            <div className="arch-card">
              <Layout className="card-icon" />
              <h4>K8s Cluster</h4>
              <p>Everything is hosted on a "future HA" cluster (which is fancy talk for 1 node at the moment). It's rock solid, trust us.</p>
            </div>
            <div className="arch-card">
              <Terminal className="card-icon" />
              <h4>Containerized FE</h4>
              <p>Our React-based frontend is deployed directly inside the K8s cluster for low-latency communication.</p>
            </div>
            <div className="arch-card">
              <Network className="card-icon" />
              <h4>Centralized Gateway</h4>
              <p>All microservices are orchestrated behind a robust gateway. It's basically the traffic cop who never sleeps, unlike us.</p>
            </div>
          </div>
        </motion.section>

        <motion.section variants={itemVariants} className="projects-section">
          <div className="section-header">
             <Database className="section-icon" />
             <h3>Our Ecosystem (A Harmony of Chaos)</h3>
          </div>
          <p className="section-text">The muonstream ecosystem consists of several specialized projects working in harmony:</p>
          <div className="project-grid">
            <div className="project-item"><strong>S4V3</strong>: The reactive frontend platform.</div>
            <div className="project-item"><strong>Horus</strong>: The intelligent gateway (named after a god because it has issues too).</div>
            <div className="project-item"><strong>MinIO</strong>: High-performance storage for all your memes.</div>
            <div className="project-item"><strong>Keycloak</strong>: Enterprise-grade identity management (keeping the bad guys out).</div>
            <div className="project-item"><strong>Traefik</strong>: The modern reverse proxy that handles the routing while we drink coffee.</div>
          </div>
        </motion.section>

        <motion.section variants={itemVariants} className="namespaces-section">
          <div className="section-header">
             <Network className="section-icon" />
             <h3>Cluster Topography (The Names of My Pets)</h3>
          </div>
          <div className="namespace-tags">
             <span className="namespace-tag">execodex</span>
             <span className="namespace-tag">horus-namespace</span>
             <span className="namespace-tag">minio-namespace</span>
             <span className="namespace-tag">keycloak-namespace</span>
             <span className="namespace-tag">gateway-namespace</span>
             <span className="namespace-tag">traefik</span>
          </div>
        </motion.section>

        <motion.section variants={itemVariants} className="collaboration-section">
          <div className="collab-card">
            <div className="section-header">
               <Users className="section-icon" />
               <h3>Join the "Mission"</h3>
            </div>
            <p className="collab-text">
              We are constantly looking for visionary developers, security experts, and anyone who actually knows how to write a YAML file without crying.
            </p>
            <div className="collab-actions">
              <a href="https://github.com/gluonstream" target="_blank" rel="noopener noreferrer" className="cta-button primary collab-btn">
                <Github size={20} style={{ marginRight: '8px' }} /> Collaborate on GitHub
              </a>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
}
