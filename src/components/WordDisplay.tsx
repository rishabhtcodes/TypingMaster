import { useRef, useEffect } from 'react';
import '../styles/WordDisplay.css';

interface WordDisplayProps {
  text: string;
  input: string;
  isStarted: boolean;
}

export default function WordDisplay({ text, input, isStarted }: WordDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const targetChars = text.split('');
  const inputChars = input.split('');

  // Keep active caret visible by scrolling container into view if needed
  useEffect(() => {
    const activeEl = containerRef.current?.querySelector('.char-active');
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [input]);

  // Auto-focus container on mount so the user can start typing immediately
  useEffect(() => {
    outerRef.current?.focus();
  }, []);

  return (
    <div 
      ref={outerRef}
      className="word-display-container glass-panel animate-float"
      tabIndex={0}
    >
      {/* Visual Blurry Glow Behind Text */}
      <div className="word-display-glow"></div>
      
      <div className="word-display-text" ref={containerRef}>
        {targetChars.map((char, index) => {
          const isTyped = index < inputChars.length;
          const isCorrect = isTyped && inputChars[index] === char;
          const isActive = index === inputChars.length;
          
          let charClass = 'char-future';
          if (isActive) charClass = 'char-active';
          else if (isTyped) {
            charClass = isCorrect ? 'char-correct' : 'char-incorrect';
          }

          // Handle visual linebreaks or spaces
          const isSpace = char === ' ';

          return (
            <span 
              key={index} 
              className={`char-item ${charClass} ${isSpace ? 'char-space' : ''}`}
            >
              {isActive && (
                <span className="cursor-caret"></span>
              )}
              {isSpace ? ' ' : char}
            </span>
          );
        })}

        {/* Extra characters typed past target text length */}
        {inputChars.length > targetChars.length && (
          inputChars.slice(targetChars.length).map((char, index) => (
            <span key={`extra-${index}`} className="char-item char-incorrect char-extra">
              {index === inputChars.length - targetChars.length - 1 && (
                <span className="cursor-caret"></span>
              )}
              {char === ' ' ? ' ' : char}
            </span>
          ))
        )}
      </div>

      {!isStarted && input.length === 0 && (
        <div className="start-typing-overlay">
          <span>Start typing to begin test...</span>
        </div>
      )}
    </div>
  );
}
