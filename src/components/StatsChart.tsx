import { useMemo } from 'react';
import type { WpmSnapshot } from '../hooks/useTypingEngine';
import '../styles/StatsChart.css';

interface StatsChartProps {
  snapshots: WpmSnapshot[];
}

export default function StatsChart({ snapshots }: StatsChartProps) {
  // If we don't have enough snapshots, show a nice empty chart placeholder
  const activeSnaps = useMemo(() => {
    if (snapshots.length === 0) {
      // Mock data for beautiful result screen placeholder
      return [
        { time: 1, wpm: 0, rawWpm: 0, errors: 0 },
        { time: 5, wpm: 25, rawWpm: 30, errors: 1 },
        { time: 10, wpm: 45, rawWpm: 50, errors: 0 },
        { time: 15, wpm: 55, rawWpm: 60, errors: 2 },
      ];
    }
    return snapshots;
  }, [snapshots]);

  // Dimension coordinates
  const width = 600;
  const height = 180;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Find min/max values
  const maxTime = Math.max(...activeSnaps.map((s) => s.time), 15);
  const maxWpm = Math.max(...activeSnaps.map((s) => Math.max(s.wpm, s.rawWpm)), 80);

  // Generate SVG coordinates
  const points = useMemo(() => {
    return activeSnaps.map((snap) => {
      const x = paddingLeft + (snap.time / maxTime) * chartWidth;
      const y = paddingTop + chartHeight - (snap.wpm / maxWpm) * chartHeight;
      const rawY = paddingTop + chartHeight - (snap.rawWpm / maxWpm) * chartHeight;
      return { x, y, rawY, errors: snap.errors, time: snap.time };
    });
  }, [activeSnaps, maxTime, maxWpm, chartWidth, chartHeight]);

  // SVG Line paths
  const wpmPath = useMemo(() => {
    if (points.length < 2) return '';
    return points.reduce((path, p, i) => {
      return i === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`;
    }, '');
  }, [points]);

  const rawWpmPath = useMemo(() => {
    if (points.length < 2) return '';
    return points.reduce((path, p, i) => {
      return i === 0 ? `M ${p.x} ${p.rawY}` : `${path} L ${p.x} ${p.rawY}`;
    }, '');
  }, [points]);

  // Shaded area under WPM line
  const areaPath = useMemo(() => {
    if (points.length < 2) return '';
    const baseLineY = paddingTop + chartHeight;
    return `${wpmPath} L ${points[points.length - 1].x} ${baseLineY} L ${points[0].x} ${baseLineY} Z`;
  }, [points, wpmPath, chartHeight]);

  // Grid ticks
  const wpmTicks = [0, Math.round(maxWpm / 2), maxWpm];
  const timeTicks = [0, Math.round(maxTime / 2), maxTime];

  return (
    <div className="stats-chart-wrapper glass-panel animate-float">
      <div className="chart-header">
        <h4 className="chart-title">Speed Progression (WPM)</h4>
        <div className="chart-legend">
          <span className="legend-item wpm"><span className="legend-dot"></span>Net WPM</span>
          <span className="legend-item raw"><span className="legend-dot"></span>Raw WPM</span>
          {snapshots.length === 0 && <span className="demo-badge">Demo Data</span>}
        </div>
      </div>

      <div className="chart-svg-container">
        <svg viewBox={`0 0 ${width} ${height}`} className="chart-svg">
          {/* Defs for gradients */}
          <defs>
            <linearGradient id="wpmAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary-color)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--primary-color)" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid Lines */}
          {wpmTicks.map((tick, i) => {
            const y = paddingTop + chartHeight - (tick / maxWpm) * chartHeight;
            return (
              <g key={`wpm-tick-${i}`} className="grid-group">
                <line 
                  x1={paddingLeft} 
                  y1={y} 
                  x2={width - paddingRight} 
                  y2={y} 
                  className="chart-grid-line" 
                />
                <text 
                  x={paddingLeft - 10} 
                  y={y + 4} 
                  className="chart-axis-text wpm-axis"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {timeTicks.map((tick, i) => {
            const x = paddingLeft + (tick / maxTime) * chartWidth;
            return (
              <g key={`time-tick-${i}`} className="grid-group">
                <line 
                  x1={x} 
                  y1={paddingTop} 
                  x2={x} 
                  y2={paddingTop + chartHeight} 
                  className="chart-grid-line" 
                />
                <text 
                  x={x} 
                  y={paddingTop + chartHeight + 18} 
                  className="chart-axis-text time-axis"
                >
                  {tick}s
                </text>
              </g>
            );
          })}

          {/* Draw Areas */}
          {areaPath && (
            <path d={areaPath} fill="url(#wpmAreaGrad)" />
          )}

          {/* Draw Raw WPM Line */}
          {rawWpmPath && (
            <path 
              d={rawWpmPath} 
              fill="none" 
              stroke="var(--text-muted)" 
              strokeWidth="1.5" 
              strokeDasharray="4 4" 
              opacity="0.6"
            />
          )}

          {/* Draw WPM Line */}
          {wpmPath && (
            <path 
              d={wpmPath} 
              fill="none" 
              stroke="var(--primary-color)" 
              strokeWidth="3" 
              strokeLinecap="round"
              className="chart-main-line"
            />
          )}

          {/* Draw mistake dots/bars */}
          {points.map((p, i) => {
            if (!p.errors || p.errors <= 0) return null;
            const barHeight = Math.min(p.errors * 5, 25);
            const barY = paddingTop + chartHeight - barHeight;
            return (
              <g key={`err-${i}`}>
                {/* Visual glowing point */}
                <circle 
                  cx={p.x} 
                  cy={p.y} 
                  r="4" 
                  fill="var(--text-incorrect)" 
                  className="chart-error-node"
                />
                {/* Tiny error indicator bar on base */}
                <rect
                  x={p.x - 2}
                  y={barY}
                  width="4"
                  height={barHeight}
                  fill="var(--text-incorrect)"
                  opacity="0.4"
                  rx="1"
                />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
