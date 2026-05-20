export interface TestAttempt {
  id: string;
  timestamp: number;
  wpm: number;
  accuracy: number;
  rawWpm: number;
  errorsCount: number;
  timeSpent: number; // in seconds
  testMode: string;  // e.g. 'time' | 'words' | 'zen'
  category: string;  // e.g. 'english' | 'quotes' | 'code' | 'homeRow' etc.
  struggleKeys: Record<string, number>;
}

export interface SummaryStats {
  totalCompleted: number;
  averageWpm: number;
  maxWpm: number;
  averageAccuracy: number;
  totalTimeSpent: number; // in seconds
  struggleKeysHeatmap: Array<{ key: string; count: number }>;
}

const STORAGE_KEY = 'typing_master_pro_history';

class HistoryEngine {
  public getAttempts(): TestAttempt[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to load history', e);
      return [];
    }
  }

  public saveAttempt(attempt: Omit<TestAttempt, 'id' | 'timestamp'>): TestAttempt {
    const newAttempt: TestAttempt = {
      ...attempt,
      id: Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      timestamp: Date.now(),
    };

    try {
      const attempts = this.getAttempts();
      attempts.unshift(newAttempt); // newest first
      
      // Limit local storage size to last 200 attempts to avoid quota issues
      const trimmed = attempts.slice(0, 200);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch (e) {
      console.error('Failed to save attempt', e);
    }

    return newAttempt;
  }

  public clearHistory(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear history', e);
    }
  }

  public getSummaryStats(): SummaryStats {
    const attempts = this.getAttempts();
    if (attempts.length === 0) {
      return {
        totalCompleted: 0,
        averageWpm: 0,
        maxWpm: 0,
        averageAccuracy: 0,
        totalTimeSpent: 0,
        struggleKeysHeatmap: [],
      };
    }

    let totalWpm = 0;
    let maxWpm = 0;
    let totalAccuracy = 0;
    let totalTime = 0;
    const keyMap: Record<string, number> = {};

    attempts.forEach((a) => {
      totalWpm += a.wpm;
      totalAccuracy += a.accuracy;
      totalTime += a.timeSpent;
      if (a.wpm > maxWpm) maxWpm = a.wpm;

      // Accumulate struggle keys
      if (a.struggleKeys) {
        Object.entries(a.struggleKeys).forEach(([key, count]) => {
          const cleanKey = key.toUpperCase();
          // Filter out spaces and non-character indicators for neat layout
          if (cleanKey && cleanKey !== ' ' && cleanKey !== 'ENTER') {
            keyMap[cleanKey] = (keyMap[cleanKey] || 0) + count;
          }
        });
      }
    });

    // Sort struggle keys descending
    const struggleKeysHeatmap = Object.entries(keyMap)
      .map(([key, count]) => ({ key, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8); // Top 8 hard keys

    return {
      totalCompleted: attempts.length,
      averageWpm: Math.round(totalWpm / attempts.length),
      maxWpm,
      averageAccuracy: Math.round(totalAccuracy / attempts.length),
      totalTimeSpent: totalTime,
      struggleKeysHeatmap,
    };
  }
}

export const HistoryTracker = new HistoryEngine();
