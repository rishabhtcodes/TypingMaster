import React from 'react';
import '../styles/TypingArea.css';

interface TypingAreaProps {
  text: string;
  input: string;
  onInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isStarted: boolean;
}

const TypingArea: React.FC<TypingAreaProps> = ({
  text,
  input,
  onInput,
  isStarted,
}) => {
  const getCharStatus = (index: number): 'correct' | 'incorrect' | 'future' => {
    if (index < input.length) {
      return input[index] === text[index] ? 'correct' : 'incorrect';
    }
    return 'future';
  };

  return (
    <div className="typing-area">
      {/* Quote Display Box */}
      <div className="text-display">
        {text.split('').map((char, index) => {
          const status = getCharStatus(index);
          let charClass = 'char char-future';
          if (status === 'correct') {
            charClass = 'char char-correct';
          } else if (status === 'incorrect') {
            charClass = 'char char-incorrect';
          }
          return (
            <span key={index} className={charClass}>
              {char}
            </span>
          );
        })}
      </div>

      {/* Input Field */}
      <input
        type="text"
        value={input}
        onChange={onInput}
        placeholder={isStarted ? '' : 'Type the current word and press space...'}
        className="typing-input"
        autoFocus
        spellCheck={false}
      />
    </div>
  );
};

export default TypingArea;
