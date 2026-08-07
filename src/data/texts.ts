export interface TextCategory {
  english: string[];
  code: string[];
  quotes: string[];
  homeRow: string[];
  topRow: string[];
  bottomRow: string[];
  numberRow: string[];
}

export const typingTexts: TextCategory = {
  english: [
    "about school other would people sound after take first work their only look over through little high three sentence standard system build structure state custom theme dark minimalist screen focus user dashboard results key graph live time count accuracy consistency",
    "some people think that typing is simply muscle memory but it is actually a complex cognitive coordination between visual perception and manual output with practice the brain builds structural highways to map each letter to a specific finger movements",
    "the quick brown fox jumps over the lazy dog is a famous pangram because it uses every single letter in the English alphabet typing pangrams is a classic method to build balanced muscle memory across all finger paths of your keyboard layout",
    "consistency is far more important than speed when you first begin your touch typing journey if you focus on slow accuracy your muscles learn perfect paths and speed naturally develops as a byproduct of this accuracy first mindset",
    "modern keyboard layouts like Qwerty were originally designed to slow typists down so that physical typewriter keys would not jam together today alternative layouts like Colemak and Dvorak aim to minimize finger travel time and strain",
  ],
  code: [
    "const typingSpeed = (words, minutes) => {\n  return Math.round(words / minutes);\n};\nexport default function calculateWpm(stats) {\n  const { correct, duration } = stats;\n  return typingSpeed(correct / 5, duration / 60);\n}",
    "import React, { useState, useEffect } from 'react';\n\nexport const useTheme = () => {\n  const [theme, setTheme] = useState('dark');\n  const toggleTheme = () => {\n    setTheme(prev => prev === 'dark' ? 'light' : 'dark');\n  };\n  return { theme, toggleTheme };\n};",
    "def bubble_sort(arr):\n  n = len(arr)\n  for i in range(n):\n    for j in range(0, n - i - 1):\n      if arr[j] > arr[j + 1]:\n        arr[j], arr[j + 1] = arr[j + 1], arr[j]\n  return arr",
    "async function fetchData(url) {\n  try {\n    const response = await fetch(url);\n    if (!response.ok) throw new Error('Network error');\n    const data = await response.json();\n    return { success: true, data };\n  } catch (error) {\n    return { success: false, error: error.message };\n  }\n}",
    "<!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <title>Ty-pex</title>\n    <link rel=\"stylesheet\" href=\"styles.css\" />\n  </head>\n  <body>\n    <main id=\"app\"></main>\n  </body>\n</html>",
  ],
  quotes: [
    "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle. As with all matters of the heart, you will know when you find it. — Steve Jobs",
    "In the middle of difficulty lies opportunity. The measure of intelligence is the ability to change. Imagination is more important than knowledge. Knowledge is limited. — Albert Einstein",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. A pessimist sees difficulty in every opportunity; an optimist sees opportunity in every difficulty. — Winston Churchill",
    "We are what we repeatedly do. Excellence, then, is not an act, but a habit. The energy of the mind is the essence of life. Knowing yourself is the beginning of all wisdom. — Aristotle",
    "It does not matter how slowly you go as long as you do not stop. Life is really simple, but we insist on making it complicated. Silence is a true friend who never betrays. — Confucius",
  ],
  homeRow: [
    "sad dad had hah ash had ash has dad ash sad ads has aha shad dash ash had haha sad add ads",
    "the sad dad had asked if he had ash from the dash sad ash had dad shad has hah add ads had ash sad",
    "dad has ash shad sad add hah ash had sad ads the old dad has said he had ash from the sad shad had ask",
  ],
  topRow: [
    "three were there where they to went tier we troy tree wet we rot row toe two threw the wet",
    "they were there to see the three were where we went threw to the three tier tree were they to wet row",
    "the wet toe troy threw tree to we went there where they threw to the tier tree where we went to see three",
  ],
  bottomRow: [
    "buzz buzz buzz can cat van ban cab van cab ban can ban van cab ban can ban cab van can ban cat",
    "the cat can buzz can van cab ban can buzz cat van buzz van cab ban can cat ban can buzz van cab ban",
    "cab van can ban cat ban can van cab ban buzz can van cab ban can cat ban can buzz van cab ban can buzz",
  ],
  numberRow: [
    "1 2 3 4 5 6 7 8 9 0 one two 123 456 789 012 345 678 90 1 one 2 two 3 three 4 four 5 five",
    "the year 2024 has numbers 1 2 3 4 5 6 7 8 9 0 in 1234 there were 567 items and 890 counts",
    "123456789 0 numbers in the world year 2024 with 1 2 3 4 5 6 7 8 9 0 starting from count 1 to 2024",
  ],
};

export const getRandomText = (category: keyof TextCategory, lengthLimit = 30): string => {
  const list = typingTexts[category];
  const fullText = list[Math.floor(Math.random() * list.length)];
  
  // For english category, we can shuffle and slice to generate a variety of word lengths
  if (category === 'english') {
    const words = fullText.split(' ');
    // Simple shuffle
    const shuffled = words.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(lengthLimit, shuffled.length)).join(' ');
  }
  
  return fullText;
};
