import React from 'react';
import '../styles/Header.css';

interface HeaderProps {
  isDarkMode?: boolean;
  onThemeToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onThemeToggle }) => {
  return (
    <header className="header">
      <div className="header-container">
        {/* Logo - Project Name */}
        <div className="logo">
          <span className="logo-text">TypingMaster</span>
        </div>

        {/* Navigation */}
        <nav className="nav">
          <button className="nav-link">Home</button>
          <button className="nav-link">Practice</button>
          <button className="nav-link">Single Player</button>
        </nav>

        {/* Right Side Actions */}
        <div className="header-actions">
          <button className="login-btn">Login</button>
          <button
            onClick={onThemeToggle}
            className="settings-btn"
            aria-label="Settings"
          >
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m3.08 3.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m3.08-3.08l4.24-4.24M19.78 19.78l-4.24-4.24m-3.08-3.08l-4.24-4.24"></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
