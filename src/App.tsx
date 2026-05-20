import { useState, useEffect, useRef, useCallback } from 'react';
import { useTypingEngine } from './hooks/useTypingEngine';
import { getRandomText } from './data/texts';
import { HistoryTracker } from './utils/HistoryTracker';
import type { SwitchType } from './utils/SoundManager';
import WordDisplay from './components/WordDisplay';
import StatsChart from './components/StatsChart';
import Dashboard from './components/Dashboard';
import ThemeSelector from './components/ThemeSelector';
import Controls from './components/Controls';
import type { TestMode, TextCategory } from './components/Controls';
import {
  BarChart2,
  RotateCw,
  Play,
  Percent,
  Clock,
  AlertTriangle,
  Award,
  Zap,
  Bold
} from 'lucide-react';
import './styles/App.css';

export default function App() {
  // App navigation tab
  const [activeTab, setActiveTab] = useState<'practice' | 'dashboard'>('practice');

  // Preferences state
  const [currentTheme, setCurrentTheme] = useState(() => localStorage.getItem('typing_master_pro_theme') || 'carbon');
  const [soundType, setSoundType] = useState<SwitchType>(() => (localStorage.getItem('typing_master_pro_sound') as SwitchType) || 'clicky');
  const [focusMode, setFocusMode] = useState(() => localStorage.getItem('typing_master_pro_focus') === 'true');

  // Game config state
  const [testMode, setTestMode] = useState<TestMode>('time');
  const [category, setCategory] = useState<TextCategory>('english');
  const [timeLimit, setTimeLimit] = useState(30);
  const [wordLimit, setWordLimit] = useState(25);

  // Active word prompt text
  const [promptText, setPromptText] = useState('');

  // Save state tracking
  const hasSavedRef = useRef<boolean>(false);

  // Initialize typing engine
  const {
    input,
    isStarted,
    isCompleted,
    timeLeft,
    stats,
    historySnaps,
    struggleKeys,
    getElapsedSeconds,
    reset,
  } = useTypingEngine(promptText, testMode, timeLimit);

  // Fetch new text on config change
  const handleLoadNewText = useCallback(() => {
    // Shuffled words length limits for english tab
    const limit = testMode === 'words' ? wordLimit : 40;
    const newText = getRandomText(category, limit);
    setPromptText(newText);
    reset();
    hasSavedRef.current = false;
  }, [category, testMode, wordLimit, timeLimit, reset]);

  // Load initial text on mount or tab change
  useEffect(() => {
    handleLoadNewText();
  }, [category, testMode, wordLimit, timeLimit]);

  // Save session to LocalStorage once upon completion
  useEffect(() => {
    if (isCompleted && !hasSavedRef.current && promptText.length > 0) {
      const elapsed = getElapsedSeconds();
      HistoryTracker.saveAttempt({
        wpm: stats.wpm,
        rawWpm: stats.rawWpm,
        accuracy: stats.accuracy,
        errorsCount: stats.incorrectChars,
        timeSpent: elapsed,
        testMode,
        category,
        struggleKeys: struggleKeys,
      });
      hasSavedRef.current = true;
    }
  }, [isCompleted, stats, promptText, testMode, category, struggleKeys, getElapsedSeconds]);

  // Handle key listeners for escape restart
  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleLoadNewText();
      }
    };
    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, [handleLoadNewText]);

  // Sync preference changes to localStorage
  const handleThemeChange = (themeId: string) => {
    setCurrentTheme(themeId);
    localStorage.setItem('typing_master_pro_theme', themeId);
  };

  const handleSoundChange = (type: SwitchType) => {
    setSoundType(type);
    localStorage.setItem('typing_master_pro_sound', type);
  };

  const handleFocusChange = (focus: boolean) => {
    setFocusMode(focus);
    localStorage.setItem('typing_master_pro_focus', String(focus));
  };

  return (
    <div className="app-shell">

      {/* 1. Integrated Premium Top Navigation Bar */}
      <header className="app-header glass-panel">
        <div className="header-logo" onClick={() => { setActiveTab('practice'); reset(); }}>
          <img src="/logo.png" className="logo-image" alt="TypingMaster Pro Logo" />
          <h1>TypingMaster <span className="logo-badge">Pro</span></h1>
        </div>

        <nav className="header-nav">
          <button
            className={`btn-nav-tab ${activeTab === 'practice' ? 'active' : ''}`}
            onClick={() => setActiveTab('practice')}
          >
            <Play size={14} /> Practice
          </button>
          <button
            className={`btn-nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <BarChart2 size={14} /> Dashboard
          </button>
        </nav>

        <div className="header-right">
          <ThemeSelector currentTheme={currentTheme} onThemeChange={handleThemeChange} />
        </div>
      </header>

      {/* 2. Main Content viewport */}
      <main className="app-viewport">
        {activeTab === 'dashboard' ? (
          <Dashboard onStartPractice={() => setActiveTab('practice')} />
        ) : (
          <div className="practice-screen">

            {/* Live active indicator HUD (Fades in focus mode) */}
            <div className={`live-hud animate-float ${isStarted && focusMode ? 'hud-faded' : ''}`}>
              <div className="hud-pill font-mono">
                <Clock size={15} className="text-muted" />
                <span className="hud-value">
                  {testMode === 'time' ? `${timeLeft}s` : formatSeconds(timeLeft)}
                </span>
                <span className="hud-tag">{testMode === 'time' ? 'left' : 'time'}</span>
              </div>

              <div className="hud-pill font-mono">
                <Zap size={15} className="text-correct" />
                <span className="hud-value">{stats.wpm}</span>
                <span className="hud-tag">wpm</span>
              </div>

              <div className="hud-pill font-mono">
                <Percent size={15} className="text-warning" />
                <span className="hud-value">{stats.accuracy}%</span>
                <span className="hud-tag">accuracy</span>
              </div>
            </div>

            {/* The Monospace word display container */}
            <WordDisplay
              text={promptText}
              input={input}
              isStarted={isStarted}
            />

            {/* Quick action bar */}
            <div className={`action-bar animate-float ${isStarted && focusMode ? 'hud-faded' : ''}`}>
              <button className="btn-restart" onClick={handleLoadNewText} title="Press Escape to restart">
                <RotateCw size={14} /> Reset <span className="shortcut-tag">Esc</span>
              </button>
            </div>

            {/* Upgraded Control presets HUD */}
            <Controls
              mode={testMode}
              onModeChange={setTestMode}
              category={category}
              onCategoryChange={setCategory}
              timeLimit={timeLimit}
              onTimeLimitChange={setTimeLimit}
              wordLimit={wordLimit}
              onWordLimitChange={setWordLimit}
              focusMode={focusMode}
              onFocusModeChange={handleFocusChange}
              soundType={soundType}
              onSoundTypeChange={handleSoundChange}
              isStarted={isStarted}
            />

            {/* Sleek inline tutorial tip */}
            {!isStarted && (
              <p className="practice-tip animate-float">
                💡 <b>Developer Tip:</b> Switch sound settings to <b>quiet</b> or <b>clicky</b> switches for highly satisfying tactile audio feedback!
              </p>
            )}

            {/* 3. High-Fidelity Session Completed Overlay */}
            {isCompleted && (
              <div className="results-overlay glass-panel animate-float">
                <div className="results-header">
                  <div className="award-badge animate-float">
                    <Award size={36} />
                  </div>
                  <h3>Session Complete!</h3>
                  <p>Splendid work! Your typing stats have been logged successfully.</p>
                </div>

                <div className="results-grid">
                  <div className="result-card glass-panel">
                    <span className="res-lbl">Speed</span>
                    <h2 className="res-val wpm-gold">{stats.wpm} <span className="res-unit">WPM</span></h2>
                    <span className="res-sub">Net words per minute</span>
                  </div>

                  <div className="result-card glass-panel">
                    <span className="res-lbl">Accuracy</span>
                    <h2 className={`res-val ${stats.accuracy >= 95 ? 'acc-green' : 'acc-orange'}`}>{stats.accuracy}%</h2>
                    <span className="res-sub">{stats.incorrectChars} typos made</span>
                  </div>

                  <div className="result-card glass-panel">
                    <span className="res-lbl">Raw Activity</span>
                    <h2 className="res-val">{stats.rawWpm} <span className="res-unit">WPM</span></h2>
                    <span className="res-sub">{stats.totalChars} total key taps</span>
                  </div>

                  <div className="result-card glass-panel">
                    <span className="res-lbl">Duration</span>
                    <h2 className="res-val">{getElapsedSeconds()}s</h2>
                    <span className="res-sub">Active typing time</span>
                  </div>
                </div>

                {/* SVG Performance graph */}
                <StatsChart snapshots={historySnaps} />

                {/* Localized struggle keys */}
                {Object.keys(struggleKeys).length > 0 && (
                  <div className="struggle-keys-summary animate-float">
                    <AlertTriangle size={15} className="text-warning" />
                    <span><b>Struggled keys in this run:</b></span>
                    <div className="struggle-caps-row">
                      {Object.entries(struggleKeys).slice(0, 5).map(([char, count]) => (
                        <div key={char} className="mini-cap" title={`${count} errors`}>
                          {char} <span className="mini-cap-count">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="results-actions">
                  <button className="primary" onClick={handleLoadNewText}>
                    <RotateCw size={16} /> Next Practice Run
                  </button>
                  <button onClick={() => { setActiveTab('dashboard'); reset(); }}>
                    <BarChart2 size={16} /> View Lifetime Stats
                  </button>
                </div>
              </div>
            )}

          </div>
        )}
      </main>

      <footer className="footer-credits glass-panel">
        <p>Built with <a href="https://rishabhtcodes.vercel.app"><i style={{ color: '#808080ff' }}>RISHABHTCODES</i></a> as a State-of-the-Art typing speed tutor.</p>
      </footer>
    </div>
  );
}

// Seconds formatter helper (e.g. 70 -> 1:10)
function formatSeconds(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}
