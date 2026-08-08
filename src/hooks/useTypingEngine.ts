import { useState, useEffect, useCallback, useRef } from 'react';
import { SoundManager } from '../utils/SoundManager';

export interface WpmSnapshot {
  time: number;
  wpm: number;
  rawWpm: number;
  errors: number;
}

export interface TypingStats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
}

export const useTypingEngine = (targetText: string, testMode: 'time' | 'words' | 'zen', timeLimit = 30) => {
  const [input, setInput] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [historySnaps, setHistorySnaps] = useState<WpmSnapshot[]>([]);
  
  // High-precision timing refs to prevent render lag
  const startTimeRef = useRef<number | null>(null);
  const totalKeystrokesRef = useRef<number>(0);
  const errorCountRef = useRef<number>(0);
  const struggleKeysRef = useRef<Record<string, number>>({});
  const intervalRef = useRef<any>(null);
  const inputRef = useRef<string>(input);

  // Sync inputRef with state
  useEffect(() => {
    inputRef.current = input;
  }, [input]);

  // Active typing stats
  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    rawWpm: 0,
    accuracy: 100,
    correctChars: 0,
    incorrectChars: 0,
    totalChars: 0,
  });

  // Calculate live stats
  const calculateCurrentStats = useCallback((currentInput: string, elapsedSeconds: number) => {
    if (elapsedSeconds <= 0) return;
    const elapsedMinutes = elapsedSeconds / 60;
    
    // Correct characters typed
    let correct = 0;
    let incorrect = 0;
    const tempStruggles: Record<string, number> = { ...struggleKeysRef.current };

    for (let i = 0; i < currentInput.length; i++) {
      if (i < targetText.length) {
        if (currentInput[i] === targetText[i]) {
          correct++;
        } else {
          incorrect++;
          // Track the key that was supposed to be typed
          const targetChar = targetText[i].toUpperCase();
          if (targetChar && targetChar !== ' ') {
            tempStruggles[targetChar] = (tempStruggles[targetChar] || 0) + 1;
          }
        }
      } else {
        incorrect++;
      }
    }

    struggleKeysRef.current = tempStruggles;

    // Standard WPM = (correct chars / 5) / elapsed minutes
    const wpm = Math.max(0, Math.round((correct / 5) / elapsedMinutes));
    
    // Raw WPM = (total keystrokes / 5) / elapsed minutes
    const rawWpm = Math.max(0, Math.round((totalKeystrokesRef.current / 5) / elapsedMinutes));
    
    // Accuracy = correct / total typed
    const totalTyped = currentInput.length;
    const accuracy = totalTyped > 0 ? Math.round((correct / totalTyped) * 100) : 100;

    setStats({
      wpm,
      rawWpm,
      accuracy,
      correctChars: correct,
      incorrectChars: incorrect,
      totalChars: totalTyped,
    });

    return { wpm, rawWpm, incorrect };
  }, [targetText]);

  // Helper to map Dead keys (international quotes, double-quotes, backticks, tildes)
  const resolveDeadKey = (e: KeyboardEvent): string | null => {
    if (e.key === 'Dead') {
      if (e.code === 'Quote') return e.shiftKey ? '"' : "'";
      if (e.code === 'Backquote') return e.shiftKey ? '~' : '`';
      if (e.code === 'Digit6' && e.shiftKey) return '^';
    }
    return null;
  };

  // Handle typing keystroke
  const handleKeystroke = useCallback((e: KeyboardEvent) => {
    if (isCompleted) return;

    const key = e.key;
    const code = e.code;
    const { ctrlKey, metaKey, altKey } = e;

    // Handle Ctrl + Backspace or Cmd + Backspace (word deletion)
    if ((key === 'Backspace' || code === 'Backspace') && (ctrlKey || metaKey || altKey)) {
      e.preventDefault();
      setInput((prev) => {
        if (prev.length === 0) return prev;
        SoundManager.playClick(true, false);
        let i = prev.length - 1;
        while (i > 0 && (prev[i - 1] === ' ' || prev[i - 1] === '\n')) i--;
        while (i > 0 && prev[i - 1] !== ' ' && prev[i - 1] !== '\n') i--;
        return prev.slice(0, i);
      });
      return;
    }

    // Allow shortcuts (F5, Ctrl+R, Ctrl+C, Ctrl+V, etc.)
    if (ctrlKey || metaKey) return;

    // Prevent default scrolling or focus loss on Space, Enter, Tab
    if (key === ' ' || key === 'Enter' || key === 'Tab' || code === 'Space' || code === 'Enter' || code === 'Tab') {
      e.preventDefault();
    }

    // Handle Backspace
    if (key === 'Backspace' || code === 'Backspace') {
      setInput((prev) => {
        if (prev.length === 0) return prev;
        SoundManager.playClick(true, false);
        return prev.slice(0, -1);
      });
      return;
    }

    // Resolve input characters to insert
    let inputCharsToInsert = '';

    const deadKeyChar = resolveDeadKey(e);
    if (deadKeyChar) {
      inputCharsToInsert = deadKeyChar;
    } else if (key === 'Enter') {
      // In code mode, if next line in target text has leading spaces, auto-indent
      inputCharsToInsert = '\n';
      const currentPos = input.length;
      if (targetText[currentPos] === '\n') {
        let spaceCount = 0;
        let p = currentPos + 1;
        while (p < targetText.length && targetText[p] === ' ') {
          spaceCount++;
          p++;
        }
        if (spaceCount > 0) {
          inputCharsToInsert += ' '.repeat(spaceCount);
        }
      }
    } else if (key === 'Tab') {
      // Tab inserts matching leading spaces or 2 spaces
      const currentPos = input.length;
      let spaceCount = 0;
      let p = currentPos;
      while (p < targetText.length && targetText[p] === ' ') {
        spaceCount++;
        p++;
      }
      inputCharsToInsert = ' '.repeat(spaceCount > 0 ? spaceCount : 2);
    } else if (key.length === 1) {
      inputCharsToInsert = key;
    } else if (e.code && e.code.startsWith('Key')) {
      // Fallback for key events where e.key is overridden or empty (e.g. KeyA, KeyS, KeyD)
      const letter = e.code.slice(3);
      inputCharsToInsert = e.shiftKey ? letter.toUpperCase() : letter.toLowerCase();
    } else {
      // Ignore other non-printable key events (Shift, Alt, CapsLock, Arrow keys, etc.)
      return;
    }

    // Initialize timer on first keypress
    if (!isStarted) {
      setIsStarted(true);
      startTimeRef.current = Date.now();
      setTimeLeft(testMode === 'time' ? timeLimit : 0);
    }

    totalKeystrokesRef.current += inputCharsToInsert.length;
    
    // Play clicking sound
    const isSpaceOrEnter = key === ' ' || key === 'Enter' || key === 'Tab';
    SoundManager.playClick(false, isSpaceOrEnter);

    setInput((prev) => {
      const nextInput = prev + inputCharsToInsert;
      
      // Track struggle keys
      for (let idx = prev.length; idx < nextInput.length; idx++) {
        const expected = targetText[idx];
        const actual = nextInput[idx];
        if (expected && actual && expected !== actual) {
          const key = expected.toUpperCase();
          struggleKeysRef.current[key] = (struggleKeysRef.current[key] || 0) + 1;
        }
      }

      // Auto complete when we finish typing target text
      if (nextInput.length >= targetText.length) {
        setIsCompleted(true);
        setIsStarted(false);
      }
      
      // Auto complete in Words Mode when word count matches
      if (testMode === 'words') {
        const typedWords = nextInput.trim().split(/\s+/).length;
        const targetWords = targetText.trim().split(/\s+/).length;
        if (typedWords >= targetWords && nextInput.endsWith(' ')) {
          setIsCompleted(true);
          setIsStarted(false);
        }
      }

      return nextInput;
    });
  }, [isStarted, isCompleted, targetText, testMode, timeLimit, input]);

  // Handle live clock ticks every second
  useEffect(() => {
    if (!isStarted || isCompleted) return;

    intervalRef.current = setInterval(() => {
      if (!startTimeRef.current) return;
      
      const elapsedSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
      
      // Time Mode Countdown
      if (testMode === 'time') {
        const remaining = Math.max(0, timeLimit - elapsedSeconds);
        setTimeLeft(remaining);
        if (remaining <= 0) {
          setIsCompleted(true);
          setIsStarted(false);
        }
      } else {
        // Words & Zen Mode count upwards
        setTimeLeft(elapsedSeconds);
      }

      // Record snapshot using inputRef to avoid restarting interval on keypress
      const currentStats = calculateCurrentStats(inputRef.current, elapsedSeconds);
      if (currentStats) {
        setHistorySnaps((prev) => [
          ...prev,
          {
            time: elapsedSeconds,
            wpm: currentStats.wpm,
            rawWpm: currentStats.rawWpm,
            errors: currentStats.incorrect - (prev[prev.length - 1]?.errors || 0),
          },
        ]);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isStarted, isCompleted, testMode, timeLimit, calculateCurrentStats]);

  // Recalculate stats when typing updates to ensure instant visual responsiveness
  useEffect(() => {
    if (!isStarted || !startTimeRef.current) return;
    const elapsedSeconds = Math.max(1, (Date.now() - startTimeRef.current) / 1000);
    calculateCurrentStats(input, elapsedSeconds);
  }, [input, calculateCurrentStats, isStarted]);

  // Reset engine
  const reset = useCallback(() => {
    setInput('');
    setIsStarted(false);
    setIsCompleted(false);
    setTimeLeft(testMode === 'time' ? timeLimit : 0);
    setHistorySnaps([]);
    startTimeRef.current = null;
    totalKeystrokesRef.current = 0;
    errorCountRef.current = 0;
    struggleKeysRef.current = {};
    setStats({
      wpm: 0,
      rawWpm: 0,
      accuracy: 100,
      correctChars: 0,
      incorrectChars: 0,
      totalChars: 0,
    });
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [testMode, timeLimit]);

  // Hook up event listener for typing
  useEffect(() => {
    window.addEventListener('keydown', handleKeystroke);
    return () => window.removeEventListener('keydown', handleKeystroke);
  }, [handleKeystroke]);

  // Duration spent in active typing
  const getElapsedSeconds = (): number => {
    if (!startTimeRef.current) return 0;
    return Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
  };

  return {
    input,
    isStarted,
    isCompleted,
    timeLeft,
    stats,
    historySnaps,
    struggleKeys: struggleKeysRef.current,
    getElapsedSeconds,
    reset,
  };
};
