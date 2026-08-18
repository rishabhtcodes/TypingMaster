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
        type="button"
        tabIndex={-1}
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
                  type="button"
                  tabIndex={-1}
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
