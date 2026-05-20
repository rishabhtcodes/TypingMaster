import '../styles/ProgressIndicator.css';

interface ProgressIndicatorProps {
  total: number;
  current: number;
}

export default function ProgressIndicator({ total, current }: ProgressIndicatorProps) {
  return (
    <div className="progress-indicator">
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className={`progress-dot ${index < current ? 'progress-dot-filled' : ''}`}
        />
      ))}
    </div>
  );
}
