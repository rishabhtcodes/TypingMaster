import '../styles/KeyboardVisualization.css';

interface KeyboardVisualizationProps {
  relevantKeys: string[];
  lastTypedChar?: string;
}

export default function KeyboardVisualization({ relevantKeys, lastTypedChar }: KeyboardVisualizationProps) {
  const keyboardLayout = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
  ];

  const isRelevant = (key: string) => {
    return relevantKeys.includes(key.toLowerCase());
  };

  const isTapped = (key: string) => {
    return lastTypedChar && key.toLowerCase() === lastTypedChar.toLowerCase();
  };

  return (
    <div className="keyboard-visualization">
      {keyboardLayout.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => (
            <button
              key={key}
              disabled
              className={`keyboard-key ${
                isTapped(key)
                  ? 'keyboard-key-tapped'
                  : isRelevant(key)
                  ? 'keyboard-key-relevant'
                  : 'keyboard-key-inactive'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
      <div className="keyboard-label">Qwerty</div>
    </div>
  );
}
