import { useState, useEffect } from 'react';
import { Palette, ChevronDown } from 'lucide-react';
import '../styles/ThemeSelector.css';

export interface ThemePreset {
  id: string;
  name: string;
  className: string;
  colors: {
    bg: string;
    primary: string;
    text: string;
  };
}

export const themesList: ThemePreset[] = [
  {
    id: 'paper',
    name: 'Paper Slate',
    className: 'theme-paper',
    colors: { bg: '#dce3ea', primary: '#237573', text: '#1e293b' },
  },
  {
    id: 'carbon',
    name: 'Carbon Dark',
    className: 'theme-carbon',
    colors: { bg: '#121214', primary: '#ff9f1c', text: '#e2e8f0' },
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Glow',
    className: 'theme-cyberpunk',
    colors: { bg: '#0c0813', primary: '#ff007f', text: '#f3e8ff' },
  },
  {
    id: 'dracula',
    name: 'Dracula Night',
    className: 'theme-dracula',
    colors: { bg: '#282a36', primary: '#bd93f9', text: '#f8f8f2' },
  },
  {
    id: 'nordic',
    name: 'Nordic Mint',
    className: 'theme-nordic',
    colors: { bg: '#1e293b', primary: '#a7f3d0', text: '#f1f5f9' },
  },
  {
    id: 'sakura',
    name: 'Sakura Blossom',
    className: 'theme-sakura',
    colors: { bg: '#fcf7f7', primary: '#dd5e89', text: '#4a3737' },
  },
];

interface ThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (themeId: string) => void;
}

export default function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeTheme = themesList.find(t => t.id === currentTheme) || themesList[0];

  // Set active class on body on mount or change
  useEffect(() => {
    // Remove existing themes
    themesList.forEach(t => document.body.classList.remove(t.className));
    // Add current theme
    document.body.classList.add(activeTheme.className);
  }, [activeTheme]);

  return (
    <div className="theme-selector-container">
      <button 
        className="btn-theme-trigger" 
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Palette size={16} />
        <span className="active-theme-name">{activeTheme.name}</span>
        <ChevronDown size={14} className={`arrow-icon ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop overlay to close when clicking outside */}
          <div className="theme-dropdown-backdrop" onClick={() => setIsOpen(false)}></div>
          
          <div className="theme-dropdown glass-panel animate-float">
            <div className="dropdown-header">Select UI Theme</div>
            <div className="dropdown-options">
              {themesList.map((theme) => (
                <button
                  key={theme.id}
                  className={`theme-option ${theme.id === currentTheme ? 'selected' : ''}`}
                  onClick={() => {
                    onThemeChange(theme.id);
                    setIsOpen(false);
                  }}
                >
                  <span className="theme-name-label">{theme.name}</span>
                  <div className="theme-preview-dots">
                    <span className="color-dot" style={{ backgroundColor: theme.colors.bg }} title="Background"></span>
                    <span className="color-dot" style={{ backgroundColor: theme.colors.primary }} title="Primary"></span>
                    <span className="color-dot" style={{ backgroundColor: theme.colors.text }} title="Text"></span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
