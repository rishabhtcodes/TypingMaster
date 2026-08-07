import { useRef, useEffect } from 'react';
import { FileCode } from 'lucide-react';
import '../styles/WordDisplay.css';

interface WordDisplayProps {
  text: string;
  input: string;
  isStarted: boolean;
  category?: string;
}

export default function WordDisplay({ text, input, isStarted, category }: WordDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const targetChars = text.split('');
  const inputChars = input.split('');

  const isCodeMode = category === 'code' || text.includes('\n');

  // Detect file name & language for code console header
  const getFileMeta = () => {
    if (text.includes('def ')) return { name: 'script.py', lang: 'Python' };
    if (text.includes('<!DOCTYPE') || text.includes('<html')) return { name: 'index.html', lang: 'HTML' };
    if (text.includes('React') || text.includes('useState')) return { name: 'useTheme.tsx', lang: 'React TS' };
    if (text.includes('async') || text.includes('fetch')) return { name: 'fetchData.ts', lang: 'TypeScript' };
    return { name: 'main.ts', lang: 'TypeScript' };
  };

  const fileMeta = getFileMeta();

  // Split text into lines for line number rendering
  const rawLines = text.split('\n');
  const lineData: { lineIdx: number; startIdx: number; chars: string[] }[] = [];
  let charCursor = 0;

  rawLines.forEach((lineText, lineIdx) => {
    const chars = lineText.split('');
    // Include trailing \n character if not last line
    if (lineIdx < rawLines.length - 1) {
      chars.push('\n');
    }
    lineData.push({
      lineIdx,
      startIdx: charCursor,
      chars,
    });
    charCursor += chars.length;
  });

  // Calculate current active line & column
  const currentActiveIdx = inputChars.length;
  let activeLineIdx = 0;
  let activeColIdx = 0;

  for (let i = 0; i < lineData.length; i++) {
    const line = lineData[i];
    const lineEndIdx = line.startIdx + line.chars.length;
    if (currentActiveIdx >= line.startIdx && currentActiveIdx <= lineEndIdx) {
      activeLineIdx = line.lineIdx;
      activeColIdx = currentActiveIdx - line.startIdx;
      break;
    }
  }

  // Keep active caret visible by scrolling container into view if needed
  useEffect(() => {
    const activeEl = containerRef.current?.querySelector('.char-active');
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [input]);

  // Auto-focus container on mount
  useEffect(() => {
    outerRef.current?.focus();
  }, []);

  return (
    <div 
      ref={outerRef}
      className={`word-display-container glass-panel animate-float ${isCodeMode ? 'code-console-mode' : ''}`}
      tabIndex={0}
    >
      {/* Code Console Window Header Bar */}
      {isCodeMode && (
        <div className="console-header-bar">
          <div className="console-dots">
            <span className="mac-dot red"></span>
            <span className="mac-dot yellow"></span>
            <span className="mac-dot green"></span>
          </div>
          
          <div className="console-file-tab">
            <FileCode size={14} />
            <span>{fileMeta.name}</span>
          </div>

          <div className="console-meta-badges">
            <span>{fileMeta.lang}</span>
            <span>UTF-8</span>
          </div>
        </div>
      )}

      {/* Visual Blurry Glow Behind Text */}
      {!isCodeMode && <div className="word-display-glow"></div>}
      
      <div 
        className={`word-display-text ${isCodeMode ? 'console-body-viewport' : ''}`} 
        ref={containerRef}
      >
        {lineData.map((line) => {
          const isLineActive = activeLineIdx === line.lineIdx;

          // Group line chars into word-nodes for unbreakable line breaks
          const lineWords: { startIdx: number; chars: string[] }[] = [];
          let currentWord: { startIdx: number; chars: string[] } | null = null;

          line.chars.forEach((char, offset) => {
            const absoluteIdx = line.startIdx + offset;
            if (!currentWord) {
              currentWord = { startIdx: absoluteIdx, chars: [char] };
            } else {
              currentWord.chars.push(char);
            }
            if (char === ' ' || char === '\n') {
              lineWords.push(currentWord);
              currentWord = null;
            }
          });
          if (currentWord) {
            lineWords.push(currentWord);
          }

          return (
            <div 
              key={line.lineIdx} 
              className={`console-line-row ${isLineActive ? 'active-line' : ''}`}
            >
              {isCodeMode && (
                <div className="console-gutter-num">{line.lineIdx + 1}</div>
              )}

              <div className="console-line-content">
                {lineWords.map((w, wIdx) => (
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
              </div>
            </div>
          );
        })}

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

      {/* Code Console Window Footer Bar */}
      {isCodeMode && (
        <div className="console-footer-bar">
          <div className="console-footer-left">
            <span>Ln {activeLineIdx + 1}, Col {activeColIdx + 1}</span>
            <span>Spaces: 2</span>
          </div>
          <div className="console-footer-right">
            <span>UTF-8</span>
            <span>{fileMeta.lang}</span>
          </div>
        </div>
      )}

      {!isStarted && input.length === 0 && (
        <div className="start-typing-overlay">
          <span>Start typing to begin test...</span>
        </div>
      )}
    </div>
  );
}
