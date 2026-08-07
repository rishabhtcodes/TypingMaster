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

  // Group characters into words for unbreakable line wrapping
  const words: { startIdx: number; chars: string[] }[] = [];
  let currentWord: { startIdx: number; chars: string[] } | null = null;

  targetChars.forEach((char, idx) => {
    if (!currentWord) {
      currentWord = { startIdx: idx, chars: [char] };
    } else {
      currentWord.chars.push(char);
    }
    if (char === ' ' || char === '\n') {
      words.push(currentWord);
      currentWord = null;
    }
  });
  if (currentWord) {
    words.push(currentWord);
  }

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
        {words.map((w, wIdx) => (
          <span key={wIdx} className="word-node">
            {w.chars.map((char, charOffset) => {
              const index = w.startIdx + charOffset;
              const isTyped = index < inputChars.length;
              const isCorrect = isTyped && inputChars[index] === char;
              const isActive = index === inputChars.length;
              
              let charClass = 'char-future';
              if (isActive) charClass = 'char-active';
              else if (isTyped) {
                charClass = isCorrect ? 'char-correct' : 'char-incorrect';
              }

              const isSpace = char === ' ';
              const isNewline = char === '\n';

              return (
                <span 
                  key={index} 
                  className={`char-item ${charClass} ${isSpace ? 'char-space' : ''} ${isNewline ? 'char-newline' : ''}`}
                >
                  {isActive && (
                    <span className="cursor-caret"></span>
                  )}
                  {isNewline ? '↵\n' : (isSpace ? ' ' : char)}
                </span>
              );
            })}
          </span>
        ))}

        {/* Extra characters typed past target text length */}
        {inputChars.length > targetChars.length && (
          <span className="word-node">
            {inputChars.slice(targetChars.length).map((char, index) => (
              <span key={`extra-${index}`} className="char-item char-incorrect char-extra">
                {index === inputChars.length - targetChars.length - 1 && (
                  <span className="cursor-caret"></span>
                )}
                {char === ' ' ? ' ' : char}
              </span>
            ))}
          </span>
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
