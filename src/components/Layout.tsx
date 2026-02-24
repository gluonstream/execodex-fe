import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { LoginButton } from '../auth/LoginButton';
import { Menu, X } from 'lucide-react';
import { FractalBackground } from './landing/FractalBackground';

interface LayoutProps {
  user: { username: string } | null;
}

export function Layout({ user }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="layout">
      <FractalBackground />
      <nav className="main-nav">
        <div className="nav-brand">
          <Link to="/" onClick={closeMenu}>
            <span className="logo-text">S<span className="logo-alt">4</span>V<span className="logo-alt">3</span></span>
          </Link>
        </div>
        
        <button className="mobile-menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <li><Link to="/" onClick={closeMenu}>Home</Link></li>
          <li><Link to="/vault" onClick={closeMenu}>Vault</Link></li>
          <li><Link to="/about" onClick={closeMenu}>About</Link></li>
          <li className="mobile-only">
            {user ? (
              <span className="user-welcome">Welcome, {user.username}</span>
            ) : (
              <LoginButton />
            )}
          </li>
        </ul>

        <div className="nav-auth desktop-only">
          {user ? (
            <span className="user-welcome">Welcome, {user.username}</span>
          ) : (
            <LoginButton />
          )}
        </div>
      </nav>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
