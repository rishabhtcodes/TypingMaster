import { useState, useMemo, useEffect } from 'react';
import { HistoryTracker } from '../utils/HistoryTracker';
import type { TestAttempt } from '../utils/HistoryTracker';
import { 
  Trophy, 
  Percent, 
  Activity, 
  Flame, 
  Trash2, 
  Keyboard, 
  Calendar,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import '../styles/Dashboard.css';

interface DashboardProps {
  onStartPractice: () => void;
}

export default function Dashboard({ onStartPractice }: DashboardProps) {
  const [attempts, setAttempts] = useState<TestAttempt[]>(() => HistoryTracker.getAttempts());

  useEffect(() => {
    setAttempts(HistoryTracker.getAttempts());
  }, []);

  const stats = useMemo(() => HistoryTracker.getSummaryStats(), [attempts]);

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear your typing history? This action is permanent!")) {
      HistoryEngineInstanceClear();
    }
  };

  const HistoryEngineInstanceClear = () => {
    HistoryTracker.clearHistory();
    setAttempts([]);
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
  };

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (attempts.length === 0) {
    return (
      <div className="dashboard-empty-state glass-panel animate-float">
        <Keyboard className="empty-icon" size={60} />
        <h2>No Typing History Yet</h2>
        <p>Complete a typing speed test to populate your performance dashboard with charts, stats, and key heatmaps.</p>
        <button className="primary" onClick={onStartPractice}>
          Take Your First Test
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-container animate-float">
      
      {/* 1. Header Row */}
      <div className="dashboard-header">
        <div>
          <h2>Performance Dashboard</h2>
          <p className="subtitle">Scientific breakdown of your muscle memory and keystroke metrics.</p>
        </div>
        <button className="btn-clear" onClick={handleClearHistory}>
          <Trash2 size={16} /> Clear History
        </button>
      </div>

      {/* 2. Grid Cards */}
      <div className="stats-grid">
        <div className="stat-card glass-panel">
          <div className="stat-icon-wrapper wpm-top">
            <Trophy size={22} />
          </div>
          <div className="stat-data">
            <span className="stat-label">Personal Best</span>
            <h3 className="stat-value">{stats.maxWpm} <span className="stat-unit">WPM</span></h3>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon-wrapper wpm-avg">
            <Activity size={22} />
          </div>
          <div className="stat-data">
            <span className="stat-label">Average Speed</span>
            <h3 className="stat-value">{stats.averageWpm} <span className="stat-unit">WPM</span></h3>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon-wrapper accuracy-avg">
            <Percent size={22} />
          </div>
          <div className="stat-data">
            <span className="stat-label">Avg Accuracy</span>
            <h3 className="stat-value">{stats.averageAccuracy}<span className="stat-unit">%</span></h3>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon-wrapper time-total">
            <Flame size={22} />
          </div>
          <div className="stat-data">
            <span className="stat-label">Total Practice</span>
            <h3 className="stat-value">{formatTime(stats.totalTimeSpent)}</h3>
          </div>
        </div>
      </div>

      {/* 3. Key struggle heatmap & Recent Attempts Row */}
      <div className="dashboard-row-two">
        
        {/* Struggle Keys card */}
        <div className="struggle-keys-card glass-panel">
          <div className="panel-header">
            <AlertTriangle size={18} className="text-warning" />
            <h4>Key Struggles (Heatmap)</h4>
          </div>
          <p className="panel-desc">Keys you missed most frequently during recent sessions.</p>
          
          {stats.struggleKeysHeatmap.length === 0 ? (
            <div className="no-struggle-msg">
              <span className="perfect-badge">Perfect!</span> No major key failures recorded. Keep up the high accuracy!
            </div>
          ) : (
            <div className="heatmap-list">
              {stats.struggleKeysHeatmap.map((item, index) => {
                const ratio = Math.round((item.count / stats.struggleKeysHeatmap[0].count) * 100);
                return (
                  <div key={index} className="heatmap-item">
                    <div className="heatmap-key-cap">{item.key}</div>
                    <div className="heatmap-bar-container">
                      <div 
                        className="heatmap-bar" 
                        style={{ width: `${ratio}%` }}
                      ></div>
                    </div>
                    <span className="heatmap-count">{item.count} misses</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Attempts history list */}
        <div className="attempts-card glass-panel">
          <div className="panel-header">
            <Calendar size={18} />
            <h4>Recent Sessions</h4>
          </div>
          <div className="table-responsive">
            <table className="attempts-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Speed</th>
                  <th>Accuracy</th>
                  <th>Mode</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {attempts.slice(0, 5).map((att) => (
                  <tr key={att.id}>
                    <td className="cell-date">{formatDate(att.timestamp)}</td>
                    <td className="cell-wpm font-mono">{att.wpm} WPM <span className="raw-small">({att.rawWpm} raw)</span></td>
                    <td className={`cell-accuracy font-mono ${att.accuracy >= 95 ? 'text-correct' : att.accuracy >= 85 ? 'text-warning' : 'text-incorrect'}`}>
                      {att.accuracy}%
                    </td>
                    <td className="cell-mode text-capitalize">{att.testMode}</td>
                    <td className="cell-category text-capitalize">{att.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <div className="dashboard-cta">
        <button className="primary" onClick={onStartPractice}>
          <RefreshCw size={16} /> Start Custom Practice Session
        </button>
      </div>

    </div>
  );
}
