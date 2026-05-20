# TypingMaster - React + Vite Typing Practice Website

A modern, fast typing practice application built with React, TypeScript, and Vite. Based on the popular PracticeTyping website, TypingMaster helps you improve your typing speed and accuracy with various keyboard practice modes.

## Features

### 🎯 Multiple Keyboard Modes
- **Home Row** - Practice the home row keys (ASDFGH)
- **Top Row** - Practice top row keys (QWERTY)
- **Bottom Row** - Practice bottom row keys (ZXCVBN)
- **Number Row** - Practice number keys (123456789)
- **Full Keyboard** - Practice with the entire keyboard

### ⚙️ Customizable Practice Sessions
- **Text Length Options** - Choose from short, medium, or long texts
- **Random Text Selection** - Get random texts for variety
- **Next Story Button** - Load a new text anytime during practice

### 📊 Real-time Statistics
- **WPM (Words Per Minute)** - Live typing speed calculation
- **Accuracy** - Real-time accuracy percentage
- **Character Tracking** - Correct and incorrect character counts (shown during typing)

### 🎨 Theme Support
- **Dark Mode** - Default dark theme for comfortable practice
- **Light Mode** - Bright theme for daytime use
- **Toggle Button** - Switch themes with a single click

### 🎮 User-Friendly Interface
- **Character Highlighting** - See correct characters in green, incorrect in red
- **Live Input Feedback** - Visual feedback as you type
- **Keyboard Shortcuts**:
  - `ESC` - Reset the current text
  - `TAB` - Switch between keyboard modes

### 🚀 Performance
- Built with Vite for fast development and production builds
- Optimized React components with TypeScript
- Smooth animations and transitions

## Tech Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: CSS3 with CSS Variables
- **Package Manager**: npm

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Controls.tsx     # Mode, length, and control buttons
│   ├── Header.tsx       # Application header
│   ├── Stats.tsx        # Statistics display
│   └── TypingArea.tsx   # Typing input and text display
├── data/
│   └── texts.ts         # Typing practice texts database
├── hooks/
│   └── useTypingGame.ts # Typing game logic hook
├── styles/              # Component-specific styles
│   ├── Controls.css
│   ├── Header.css
│   ├── Stats.css
│   └── TypingArea.css
├── App.tsx              # Main application component
├── App.css              # App-level styles
├── index.css            # Global styles and CSS variables
└── main.tsx             # Application entry point
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd typing-master
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:5173/`

## Available Scripts

### Development
```bash
npm run dev
```
Starts the Vite development server with hot module replacement.

### Build
```bash
npm run build
```
Creates an optimized production build in the `dist/` directory.

### Type Check
```bash
npm run type-check
```
Validates TypeScript types without bundling.

## How to Use

1. **Select a Mode** - Click on one of the keyboard mode buttons to start with that keyboard section
2. **Choose Text Length** - Select short, medium, or long texts
3. **Start Typing** - Click in the input field and begin typing the displayed text
4. **Monitor Progress** - Watch your WPM and accuracy update in real-time
5. **Get New Text** - Click "Next story" to load a different text
6. **Reset** - Press `ESC` or click "Restart same text" to reset your progress
7. **Switch Modes** - Press `TAB` or click mode buttons to practice different keyboard sections

## Color Scheme

### Light Mode
- Background: White (#ffffff)
- Text: Black (#000000)
- Accent: Blue (#646cff)
- Correct chars: Green (#10a981)
- Incorrect chars: Red (#dc2626)

### Dark Mode
- Background: Dark gray (#0f0f0f)
- Text: White (#ffffff)
- Accent: Blue (#646cff)
- Correct chars: Green (#4ecca3)
- Incorrect chars: Red (#ff6b6b)

## Customization

### Adding More Texts

Edit `src/data/texts.ts` to add more practice texts:

```typescript
export const typingTexts: Record<string, TextCollection> = {
  fullKeyboard: {
    short: ['your text here'],
    medium: ['longer text here'],
    long: ['even longer text here']
  },
  // ... add more modes
};
```

### Modifying Colors

Update CSS variables in `src/index.css`:

```css
:root {
  --bg-primary: #0f0f0f;
  --text-primary: #ffffff;
  --accent: #646cff;
  /* ... more variables */
}
```

## Performance Tips

- Texts are loaded as strings and split efficiently
- Statistics calculations are optimized to run only on input change
- CSS uses CSS variables for efficient theme switching
- React components are optimized with proper memoization

## Browser Support

- Chrome/Edge: Latest versions
- Firefox: Latest versions
- Safari: Latest versions
- Mobile browsers: Responsive design supported

## Known Limitations

- Best experienced on desktop/laptop for comfortable typing
- Mobile support is available but may have UX limitations due to keyboard restrictions

## Future Enhancements

- [ ] User accounts and progress tracking
- [ ] Typing test modes (1 minute, 5 minute challenges)
- [ ] Sound effects and notifications
- [ ] Leaderboards
- [ ] Custom text input
- [ ] Typing games and challenges
- [ ] Advanced analytics and graphs

## Contributing

Feel free to fork this project and submit pull requests for improvements!

## License

MIT License - Feel free to use this project for personal and commercial purposes.

## Credits

Inspired by [PracticeTyping](https://practice-typing-seven.vercel.app/) - A great typing practice website.

Built with ❤️ using React and Vite

import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
