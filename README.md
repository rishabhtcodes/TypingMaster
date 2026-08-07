# Ty-pex — Sleek, Minimalist & Scientific Typing Coach

**Ty-pex** is a modern, high-fidelity typing practice and analytics web application built with **React**, **TypeScript**, **Vite**, and premium **Vanilla CSS**. Reminiscent of professional typing applications like Monkeytype, it combines minimalist aesthetics, zero-latency mechanical sound synthesis, real-time interactive SVG line graphs, and local storage historical dashboards to offer an unparalleled typing improvement experience.

---

## Key Features

### Premium HSL-Tailored Color Themes
Dynamically switch between 5 professionally calibrated, beautiful theme presets with full CSS glow transitions and card glassmorphism:
*   **Carbon Dark** — Sleek slate grays with warm tangerine accents.
*   **Cyberpunk Glow** — Pure dark neon night featuring cyan carets and hyper-vibrant feedback.
*   **Dracula Night** — Classic deep purple with pastel green keys and neon pink highlights.
*   **Sakura Blossom** — Premium warm cream light mode with elegant cherry-blossom rose accents.
*   **Nordic Mint** — Clean, frosted dark arctic slate with glowing mint-teal active elements.

### In-Browser Mechanical Switch Synthesizer
Built natively using the HTML5 **Web Audio API** for zero external network calls, zero file-loading lag, and pristine real-time acoustic feedback:
*   **Clicky Blue Switches** — High-frequency transient switch clicks paired with a satisfying thud.
*   **Quiet Red Switches** — Muted, smooth mid-frequency dampener pops.
*   **Mute mode** — For typing in absolute focus.

### Real-time SVG Performance Graphs
*   Plots your **Net WPM** and **Raw WPM** second-by-second.
*   Highlights **mistakes per second** exactly where they occurred.
*   Complete with custom SVG grid lines, shaded area gradients, and interactive hover highlights.

### Multi-Mode Practice HUD
*   **Modes**: **Time Mode** (15s / 30s / 60s countdowns), **Words Mode** (10 / 25 / 50 / 100 word targets), or **Zen Mode** (infinite typing with manual reset).
*   **Categories**:
    *   **General English** — Balanced core vocabulary.
    *   **Quotes** — Inspirational sayings and famous literary lines.
    *   **Coding/Syntax** — Realistic code syntax blocks targeting brackets, semi-colons, and variables.
    *   **Layout Training** — Drill-based targets focusing on Home Row, Top Row, Bottom Row, and Number Row.

### Historical Dashboard & Struggle Keys Heatmap
*   **Aggregated Metrics**: Top speed WPM, average WPM, average accuracy, total typing time spent, and total practice attempts.
*   **Worst Keys Heatmap**: Dynamically tracks your error-rate key-by-key and displays a stunning, interactive heatmap to instantly highlight keys you struggle with.
*   **Attempt Log**: Scrollable chronological logs of all past sessions saved securely in local storage.

---

## Tech Stack

*   **Framework**: [React 18](https://react.dev/) (Functional components + customized hooks)
*   **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict type-safety, verbatim module syntax)
*   **Build Tool**: [Vite](https://vitejs.dev/) (Hot Module Replacement, ultra-fast builds)
*   **Styling**: Pure CSS3 with HSL CSS Variables (No external UI frameworks to preserve pixel-perfect cursor transforms)
*   **Icons**: [Lucide React](https://lucide.dev/)

---

## Project Structure

```
src/
├── components/          # High-performance interactive UI components
│   ├── Controls.tsx     # Practice settings, durations, categories & switch toggle HUD
│   ├── Dashboard.tsx    # Aggregate historical analytics & interactive Worst Keys heatmap
│   ├── StatsChart.tsx   # Custom SVG line-chart plotting speed and mistakes in real-time
│   ├── ThemeSelector.tsx# Dynamic theme switcher with visual preset indicators
│   └── WordDisplay.tsx  # Smooth sliding cursor caret, word wrapping & character highlights
├── data/
│   └── texts.ts         # Rich practice databases (English words, quotes, code, rows layout)
├── hooks/
│   └── useTypingEngine.ts # Core game state machine, WPM mathematics & timestamp recorders
├── styles/              # Dedicated CSS styling system
│   ├── App.css          # Main layout, container geometry, and sidebars
│   ├── Controls.css     # Settings grids, selection buttons, and pill toggles
│   ├── Dashboard.css    # Stats badges, attempt logs table, and struggle keys keyboard layout
│   ├── StatsChart.css   # SVG graph styles, grid paths, areas, and tooltip boxes
│   ├── ThemeSelector.css# Theme select dialogs and circular swatch controls
│   ├── WordDisplay.css  # Character colors, caret keyframes, and sliding animations
│   └── themes.css       # Dynamic CSS Variable overrides for the 5 themes
├── utils/               # Native browser service utilities
│   ├── HistoryTracker.ts# LocalStorage analytics logger & session compiler
│   └── SoundManager.ts  # Web Audio mechanical switch thud/click synthesizer
├── App.tsx              # Main page orchestrator (Zen mode toggles & screen routing)
├── index.css            # Global body backgrounds, glassmorphism templates, and typography
└── main.tsx             # React DOM entry point
```

---

## Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v16 or higher) and `npm` installed.

### Installation & Run

1. Navigate to the directory:
   ```bash
   cd Ty-pex
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```
   Open the browser at `http://localhost:5173/` to experience Ty-pex!

### Build for Production
To generate a fully optimized, lightweight static bundle (`dist/` folder):
```bash
npm run build
```

---

## Keyboard Shortcuts

*   `ESC` — Instantly resets the current practice session.
*   `TAB` + `Enter` — Quickly cycles or triggers restarts.
*   `Ctrl/Cmd + Backspace` — Deletes the entire active word.

---

## License

This project is licensed under the MIT License — feel free to use it for personal training or further extensions!
