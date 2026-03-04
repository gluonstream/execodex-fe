import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { User, LogOut, Shield, Mail, Calendar, Key, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface UserHello {
  authenticated: boolean;
  authorities: { authority: string }[];
  credentials: {
    tokenValue: string;
    claims: {
      name: string;
      preferred_username: string;
      given_name: string;
      family_name: string;
      roles: string[];
      iss: string;
      exp: string;
      iat: string;
    };
  };
}

interface ProfileProps {
  user: any;
}

export function Profile({ user }: ProfileProps) {
  const [helloData, setHelloData] = useState<UserHello | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch('/api/hello')
        .then(res => res.json())
        .then(data => {
          setHelloData(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching /api/hello:', err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user && !loading) {
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    window.location.href = '/logout';
  };

  const claims = helloData?.credentials?.claims;
  
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="glass-panel profile-card loading-state">
          <div className="loader"></div>
          <p>Loading secure profile data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="glass-panel profile-card"
      >
        <div className="profile-header">
          <div className="profile-avatar-wrapper">
             <User size={64} className="profile-icon" />
          </div>
          <h2 className="glitch-text" data-text={claims?.name || user?.name || 'User Profile'}>
            {claims?.name || user?.name || 'User Profile'}
          </h2>
          <p className="profile-subtitle">Secure Identity Profile</p>
        </div>

        <div className="profile-details">
          <div className="detail-item">
            <Mail className="detail-icon" />
            <div className="detail-content">
              <label>Preferred Username</label>
              <span>{claims?.preferred_username || user?.username || 'N/A'}</span>
            </div>
          </div>

          <div className="detail-item">
            <Info className="detail-icon" />
            <div className="detail-content">
              <label>Full Name</label>
              <span>{claims?.given_name} {claims?.family_name}</span>
            </div>
          </div>

          <div className="detail-item">
            <Shield className="detail-icon" />
            <div className="detail-content">
              <label>Assigned Roles</label>
              <div className="roles-tags">
                {(claims?.roles || user?.roles || []).map((role: string) => (
                  <span key={role} className="role-tag">{role}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="detail-item">
            <Calendar className="detail-icon" />
            <div className="detail-content">
              <label>Session Expiration</label>
              <span>{claims?.exp ? new Date(claims.exp).toLocaleString() : 'N/A'}</span>
            </div>
          </div>

          <div className="detail-item">
            <Key className="detail-icon" />
            <div className="detail-content">
              <label>Identity Provider (Issuer)</label>
              <span className="issuer-text">{claims?.iss || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button onClick={handleLogout} className="cta-button secondary logout-btn">
            <LogOut size={20} />
            Logout from Session
          </button>
        </div>
      </motion.div>
    </div>
  );
}
