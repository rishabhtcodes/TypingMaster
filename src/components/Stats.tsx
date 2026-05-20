import React from 'react';
import type { TypingStats } from '../hooks/useTypingGame';
import '../styles/Stats.css';

interface StatsProps {
  stats: TypingStats;
  isStarted: boolean;
}

const Stats: React.FC<StatsProps> = ({ stats, isStarted }) => {
  return (
    <div className="stats">
      <div className="stat-item">
        <span className="stat-label">WPM</span>
        <span className="stat-value">{stats.wpm}</span>
      </div>
      {isStarted && (
        <div className="stats-secondary">
          <div className="stat-secondary-item">
            <span className="stat-secondary-label">Accuracy</span>
            <span className="stat-secondary-value">{stats.accuracy}%</span>
          </div>
          <div className="stat-secondary-item">
            <span className="stat-secondary-label">Correct</span>
            <span className="stat-secondary-value stat-correct">{stats.correctChars}</span>
          </div>
          <div className="stat-secondary-item">
            <span className="stat-secondary-label">Wrong</span>
            <span className="stat-secondary-value stat-wrong">{stats.incorrectChars}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stats;
