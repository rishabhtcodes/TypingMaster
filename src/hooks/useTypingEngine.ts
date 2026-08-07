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

  // Handle typing keystroke
  const handleKeystroke = useCallback((e: KeyboardEvent) => {
    if (isCompleted) return;

    const { key, ctrlKey, metaKey } = e;

    // Allow shortcuts (F5, Ctrl+R, etc.)
    if (ctrlKey || metaKey) return;

    // Prevent default scrolling with Space or Enter
    if (key === ' ' || key === 'Enter') {
      e.preventDefault();
    }

    const inputChar = key === 'Enter' ? '\n' : key;

    // Initialize timer on first keypress
    if (!isStarted && (key.length === 1 || key === 'Enter')) {
      setIsStarted(true);
      startTimeRef.current = Date.now();
      setTimeLeft(testMode === 'time' ? timeLimit : 0);
    }

    if (key === 'Backspace') {
      setInput((prev) => {
        if (prev.length === 0) return prev;
        SoundManager.playClick(true, false);
        return prev.slice(0, -1);
      });
      return;
    }

    // Only allow single characters or Enter
    if (key.length !== 1 && key !== 'Enter') return;

    totalKeystrokesRef.current += 1;
    
    // Play clicking sound
    const isSpace = key === ' ' || key === 'Enter';
    SoundManager.playClick(false, isSpace);

    setInput((prev) => {
      const nextInput = prev + inputChar;
      
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
  }, [isStarted, isCompleted, targetText, testMode, timeLimit]);

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
