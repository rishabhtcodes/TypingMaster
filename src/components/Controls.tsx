import { 
  Clock, 
  AlignLeft, 
  Infinity as InfIcon, 
  Volume2, 
  VolumeX, 
  Eye, 
  EyeOff, 
  Sparkles 
} from 'lucide-react';
import { SoundManager } from '../utils/SoundManager';
import type { SwitchType } from '../utils/SoundManager';
import '../styles/Controls.css';

export type TestMode = 'time' | 'words' | 'zen';
export type TextCategory = 'english' | 'code' | 'quotes' | 'homeRow' | 'topRow' | 'bottomRow' | 'numberRow';
export type TypingStyle = '10-finger' | '5-finger' | 'one-hand' | '2-finger';

interface ControlsProps {
  mode: TestMode;
  onModeChange: (mode: TestMode) => void;
  category: TextCategory;
  onCategoryChange: (category: TextCategory) => void;
  timeLimit: number;
  onTimeLimitChange: (limit: number) => void;
  wordLimit: number;
  onWordLimitChange: (limit: number) => void;
  focusMode: boolean;
  onFocusModeChange: (focus: boolean) => void;
  soundType: SwitchType;
  onSoundTypeChange: (type: SwitchType) => void;
  typingStyle: TypingStyle;
  onTypingStyleChange: (style: TypingStyle) => void;
  isStarted: boolean;
}

export default function Controls({
  mode,
  onModeChange,
  category,
  onCategoryChange,
  timeLimit,
  onTimeLimitChange,
  wordLimit,
  onWordLimitChange,
  focusMode,
  onFocusModeChange,
  soundType,
  onSoundTypeChange,
  typingStyle,
  onTypingStyleChange,
  isStarted,
}: ControlsProps) {

  const handleSoundChange = (type: SwitchType) => {
    onSoundTypeChange(type);
    SoundManager.setSwitchType(type);
    SoundManager.playClick();
  };

  return (
    <div className={`controls-hud glass-panel animate-float ${isStarted && focusMode ? 'hud-faded' : ''}`}>
      {/* 1. Category Selection */}
      <div className="control-section">
        <span className="section-label">Category</span>
        <div className="button-group">
          <button 
            className={`btn-control ${category === 'english' ? 'active' : ''}`}
            onClick={() => onCategoryChange('english')}
          >
            English
          </button>
          <button 
            className={`btn-control ${category === 'code' ? 'active' : ''}`}
            onClick={() => onCategoryChange('code')}
          >
            Coding
          </button>
          <button 
            className={`btn-control ${category === 'quotes' ? 'active' : ''}`}
            onClick={() => onCategoryChange('quotes')}
          >
            Quotes
          </button>
          <div className="divider-vertical"></div>
          <button 
            className={`btn-control ${category === 'homeRow' ? 'active' : ''}`}
            onClick={() => onCategoryChange('homeRow')}
            title="Home Row training: asdfghjkl"
          >
            Home Row
          </button>
          <button 
            className={`btn-control ${category === 'topRow' ? 'active' : ''}`}
            onClick={() => onCategoryChange('topRow')}
          >
            Top Row
          </button>
          <button 
            className={`btn-control ${category === 'bottomRow' ? 'active' : ''}`}
            onClick={() => onCategoryChange('bottomRow')}
          >
            Bottom Row
          </button>
          <button 
            className={`btn-control ${category === 'numberRow' ? 'active' : ''}`}
            onClick={() => onCategoryChange('numberRow')}
          >
            Numbers
          </button>
        </div>
      </div>

      <div className="divider-horizontal"></div>

      <div className="control-row">
        {/* 2. Mode and Limits (Hidden in Coding mode) */}
        {category !== 'code' && (
          <>
            <div className="control-section">
              <span className="section-label">Mode</span>
              <div className="button-group">
                <button 
                  className={`btn-control btn-icon-text ${mode === 'time' ? 'active' : ''}`}
                  onClick={() => onModeChange('time')}
                >
                  <Clock size={14} /> Time
                </button>
                <button 
                  className={`btn-control btn-icon-text ${mode === 'words' ? 'active' : ''}`}
                  onClick={() => onModeChange('words')}
                >
                  <AlignLeft size={14} /> Words
                </button>
                <button 
                  className={`btn-control btn-icon-text ${mode === 'zen' ? 'active' : ''}`}
                  onClick={() => onModeChange('zen')}
                >
                  <InfIcon size={14} /> Zen
                </button>
              </div>
            </div>

            {/* Dynamic Limits panel based on mode */}
            {mode === 'time' && (
              <div className="control-section animate-float">
                <span className="section-label">Duration</span>
                <div className="button-group">
                  {[15, 30, 60, 120].map((t) => (
                    <button
                      key={t}
                      className={`btn-control font-mono ${timeLimit === t ? 'active' : ''}`}
                      onClick={() => onTimeLimitChange(t)}
                    >
                      {t}s
                    </button>
                  ))}
                </div>
              </div>
            )}

            {mode === 'words' && (
              <div className="control-section animate-float">
                <span className="section-label">Words Count</span>
                <div className="button-group">
                  {[10, 25, 50, 100].map((w) => (
                    <button
                      key={w}
                      className={`btn-control font-mono ${wordLimit === w ? 'active' : ''}`}
                      onClick={() => onWordLimitChange(w)}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {mode === 'zen' && (
              <div className="control-section animate-float info-zen">
                <Sparkles size={14} className="text-correct" />
                <span className="zen-caption">No timers, no limits. Clear your mind and practice speed.</span>
              </div>
            )}

            <div className="divider-vertical hide-mobile"></div>
          </>
        )}

        {/* 3. Audio & Focus Utility Toggles */}
        <div className="control-section">
          <span className="section-label">Preferences</span>
          <div className="button-group">
            {/* Audio Mode Selectors */}
            <div className="audio-control-wrap">
              <button 
                className={`btn-control btn-icon-text ${soundType !== 'mute' ? 'active' : ''}`}
                onClick={() => handleSoundChange(soundType === 'mute' ? 'clicky' : 'mute')}
                title="Toggle Mechanical Audio feedback"
              >
                {soundType === 'mute' ? <VolumeX size={14} /> : <Volume2 size={14} />}
                <span className="text-capitalize">{soundType === 'mute' ? 'Mute' : soundType}</span>
              </button>
              {soundType !== 'mute' && (
                <div className="sound-mini-toggle">
                  <span 
                    className={`sound-dot ${soundType === 'clicky' ? 'active' : ''}`}
                    onClick={() => handleSoundChange('clicky')}
                    title="Clicky Blue Switch"
                  >B</span>
                  <span 
                    className={`sound-dot ${soundType === 'quiet' ? 'active' : ''}`}
                    onClick={() => handleSoundChange('quiet')}
                    title="Tactile Red Switch"
                  >R</span>
                </div>
              )}
            </div>

            {/* Focus Mode Toggle */}
            <button 
              className={`btn-control btn-icon-text ${focusMode ? 'active' : ''}`}
              onClick={() => onFocusModeChange(!focusMode)}
              title="Zen Mode: hides stats & details while typing"
            >
              {focusMode ? <EyeOff size={14} /> : <Eye size={14} />}
              <span>{focusMode ? 'Focus On' : 'Focus'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* 4. Finger Technique & Style Selection */}
      <div className="divider-horizontal"></div>

      <div className="control-section">
        <span className="section-label">Typing Technique</span>
        <div className="button-group">
          <button 
            className={`btn-control ${typingStyle === '10-finger' ? 'active' : ''}`}
            onClick={() => onTypingStyleChange('10-finger')}
            title="Standard 10-Finger Touch Typing"
          >
            🖐️ 10-Finger (Full)
          </button>
          <button 
            className={`btn-control ${typingStyle === '5-finger' ? 'active' : ''}`}
            onClick={() => onTypingStyleChange('5-finger')}
            title="5-Finger Half-Hand Dexterity Practice"
          >
            ✋ 5-Finger (Half)
          </button>
          <button 
            className={`btn-control ${typingStyle === 'one-hand' ? 'active' : ''}`}
            onClick={() => onTypingStyleChange('one-hand')}
            title="Single Hand Accessible Sweep Typing"
          >
            🤚 One-Hand
          </button>
          <button 
            className={`btn-control ${typingStyle === '2-finger' ? 'active' : ''}`}
            onClick={() => onTypingStyleChange('2-finger')}
            title="2-Finger Focal Index Practice"
          >
            ✌️ 2-Finger
          </button>
        </div>
      </div>
    </div>
  );
}
