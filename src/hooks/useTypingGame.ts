import { useState, useCallback } from 'react';

export interface TypingStats {
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
}

export const useTypingGame = (text: string) => {
  const [input, setInput] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    accuracy: 100,
    correctChars: 0,
    incorrectChars: 0,
    totalChars: 0,
  });

  const words = text.split(' ');
  const inputWords = input.split(' ');

  const calculateStats = useCallback((currentInput: string) => {
    if (!startTime) return;

    const elapsedTimeInMinutes = (Date.now() - startTime) / 60000;
    const words = currentInput.split(' ').filter(w => w.length > 0).length;
    const wpm = Math.max(0, Math.round(words / elapsedTimeInMinutes));

    let correctChars = 0;
    let incorrectChars = 0;

    for (let i = 0; i < currentInput.length; i++) {
      if (i < text.length) {
        if (currentInput[i] === text[i]) {
          correctChars++;
        } else {
          incorrectChars++;
        }
      } else {
        incorrectChars++;
      }
    }

    const totalChars = correctChars + incorrectChars;
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;

    setStats({
      wpm,
      accuracy,
      correctChars,
      incorrectChars,
      totalChars,
    });
  }, [startTime, text]);

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      if (!isStarted && value.length > 0) {
        setIsStarted(true);
        setStartTime(Date.now());
      }

      setInput(value);
      calculateStats(value);
    },
    [isStarted, calculateStats]
  );

  const reset = useCallback(() => {
    setInput('');
    setIsStarted(false);
    setStartTime(null);
    setStats({
      wpm: 0,
      accuracy: 100,
      correctChars: 0,
      incorrectChars: 0,
      totalChars: 0,
    });
  }, []);

  const isComplete = input.length > 0 && input === text;

  const getCharStatus = (index: number): 'correct' | 'incorrect' | 'future' => {
    if (index < input.length) {
      return input[index] === text[index] ? 'correct' : 'incorrect';
    }
    return 'future';
  };

  return {
    input,
    handleInput,
    reset,
    isStarted,
    isComplete,
    stats,
    words,
    inputWords,
    getCharStatus,
  };
};
