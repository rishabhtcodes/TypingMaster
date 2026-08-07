import { codeSnippets, getRandomCodeSnippet } from './codeSnippets';

export { codeSnippets, getRandomCodeSnippet };

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
    "fast keyboard touch typing relies on muscle memory built through thousands of intentional repetitions developing high accuracy prevents mental fatigue and reduces keystroke corrections over time",
    "proper ergonomic posture requires resting your wrists lightly and keeping your elbows at ninety degrees while touch typists look directly at the computer monitor rather than staring down at their physical keyboard layout",
    "practicing daily for fifteen minutes yields far better long term results than typing once a week for three long hours clean mechanical switches provide tactile feedback that improves timing and rhythmic speed flow",
    "developing fluid typing flow allows your thoughts to stream effortlessly onto the digital screen top tier typists achieve speeds well over one hundred words per minute with ninety nine percent accuracy",
    "training each individual finger to hit its designated key location strengthens bilateral hand coordination while visualizing key positions in your minds eye builds faster neural connections between brain and hand muscles",
    "short bursts of focused speed tests challenge your reflexes and expand your maximum potential peak speed while standard keyboard layouts place home row index markers on F and J keys to help orient finger positioning",
    "consistent focus on zero error typing creates subconscious neural pathways that eliminate bad habits learning touch typing unlocks massive productivity boosts when writing documents code or emails daily",
    "modern mechanical keyboards feature custom keycap profiles and lubricated switches for smooth keystrokes while custom sound dampening pads reduce high pitch clack noises during fast typing sessions",
    "mastering touch typing transforms your computer into a seamless extension of your thoughts reducing friction between ideation and writing clean code essays or daily communication",
    "regular practice with varied word lengths and special punctuation builds versatile speed that translates directly into real world software engineering and content creation workflows",
  ],
  code: codeSnippets.map(s => s.code),
  quotes: [
    "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle. As with all matters of the heart, you will know when you find it. — Steve Jobs",
    "In the middle of difficulty lies opportunity. The measure of intelligence is the ability to change. Imagination is more important than knowledge. Knowledge is limited. — Albert Einstein",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. A pessimist sees difficulty in every opportunity; an optimist sees opportunity in every difficulty. — Winston Churchill",
    "We are what we repeatedly do. Excellence, then, is not an act, but a habit. The energy of the mind is the essence of life. Knowing yourself is the beginning of all wisdom. — Aristotle",
    "It does not matter how slowly you go as long as you do not stop. Life is really simple, but we insist on making it complicated. Silence is a true friend who never betrays. — Confucius",
    "Do not go where the path may lead, go instead where there is no path and leave a trail. What lies behind us and what lies before us are tiny matters compared to what lies within us. — Ralph Waldo Emerson",
    "It is during our darkest moments that we must focus to see the light. Hope is a waking dream and courage is grace under pressure. — Aristotle Onassis",
    "The future belongs to those who believe in the beauty of their dreams. Believe you can and you are halfway there. — Eleanor Roosevelt",
    "In three words I can sum up everything I have learned about life: it goes on. Life is what happens when you are busy making other plans. — Robert Frost",
    "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment. Turn your wounds into wisdom. — Ralph Waldo Emerson",
    "Spread love everywhere you go. Let no one ever come to you without leaving happier. Kindness is a light that shines through all darkness. — Mother Teresa",
    "The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart. — Helen Keller",
    "Your time is limited, so don't waste it living someone else's life. Have the courage to follow your heart and intuition. — Steve Jobs",
    "Always remember that you are absolutely unique. Just like everyone else. Don't judge each day by the harvest you reap but by the seeds that you plant. — Margaret Mead",
    "The purpose of our lives is to be happy. Life is short, and it is up to you to make it sweet. Stand tall and face the storm. — Dalai Lama",
  ],
  homeRow: [
    "sad dad had hah ash had ash has dad ash sad ads has aha shad dash ash had haha sad add ads",
    "the sad dad had asked if he had ash from the dash sad ash had dad shad has hah add ads had ash sad",
    "dad has ash shad sad add hah ash had sad ads the old dad has said he had ash from the sad shad had ask",
    "asdf jkl; a s d f j k l ; asdf jkl; fall glad flask salad alas flash kals asdf jkl; fall glad flask",
    "a sad dad had a glad lad as all lads had a sad flask asdf jkl; kals fall a sad dad had asked a lad",
    "flash glad salad flask alas fall a sad dad had asked a lad if he had a flask asdf jkl; glad flask",
    "dad had a salad and a flask as all lads had a glad flash asdf jkl; alas glad fall alas glad salad flask",
    "fall alas glad salad flask a sad dad had a flask as all lads asked a glad dad asdf jkl; dad had a sad flask",
    "asdf jkl; dad had a sad flask and a glad salad as all lads asked a flash dad a glad lad had a sad flask",
    "a glad lad had a sad flask as all dads asked for a salad asdf jkl; fall alas flash salad flask alas fall",
    "flash salad flask alas fall a sad dad had a glad lad as all lads had a sad flask asdf jkl; glad flask salad",
    "asdf jkl; glad flask salad alas fall a sad dad had asked a lad if he had a flask dad had a salad",
    "sad dad had hah ash had ash has dad ash sad ads has aha shad dash ash had haha sad add ads asdf",
    "the sad dad had asked if he had ash from the dash sad ash had dad shad has hah add ads had ash sad",
    "dad has ash shad sad add hah ash had sad ads the old dad has said he had ash from the sad shad had ask",
  ],
  topRow: [
    "three were there where they to went tier we troy tree wet we rot row toe two threw the wet",
    "they were there to see the three were where we went threw to the three tier tree were they to wet row",
    "the wet toe troy threw tree to we went there where they threw to the tier tree where we went to see three",
    "qwerty uiop q w e r t y u i o p wet tree troy tier row toe wet troy wrote write user power query",
    "write user power query quiet route tower write type wire pour pure ripe rope quote tower wire query pure",
    "quote tower wire query pure user rite tour wet tree row toe troy write power user query quiet route",
    "user query quiet route tower write type wire pour pure ripe rope quote tower wire query pure user rite",
    "wet tree troy tier row toe wet troy wrote write user power query quiet route tower write type wire pour",
    "tower write type wire pour pure ripe rope quote tower wire query pure user rite tour wet tree row toe",
    "rite tour wet tree row toe troy write power user query quiet route tower write type wire pour pure ripe",
    "type wire pour pure ripe rope quote tower wire query pure user rite tour wet tree row toe troy write",
    "tree row toe troy write power user query quiet route tower write type wire pour pure ripe rope quote tower",
    "pour pure ripe rope quote tower wire query pure user rite tour wet tree row toe troy write power user",
    "toe troy write power user query quiet route tower write type wire pour pure ripe rope quote tower wire",
    "ripe rope quote tower wire query pure user rite tour wet tree row toe troy write power user query quiet",
  ],
  bottomRow: [
    "buzz buzz buzz can cat van ban cab van cab ban can ban van cab ban can ban cab van can ban cat",
    "the cat can buzz can van cab ban can buzz cat van buzz van cab ban can cat ban can buzz van cab ban",
    "cab van can ban cat ban can van cab ban buzz can van cab ban can cat ban can buzz van cab ban can buzz",
    "zxcvb nm,./ z x c v b n m , . / cab van ban can cat buzz vine zinc mob ban cab van can cat",
    "ban cab van can cat buzz vine zinc mob ban cab van can cat buzz vine zinc mob ban cab van can",
    "can cat ban van cab buzz zinc mob van cab ban can cat buzz vine zinc mob ban cab van can cat",
    "buzz vine zinc mob ban cab van can cat buzz vine zinc mob ban cab van can cat buzz vine zinc mob",
    "cat buzz vine zinc mob ban cab van can cat buzz vine zinc mob ban cab van can cat buzz vine zinc",
    "cab van ban can cat buzz vine zinc mob ban cab van can cat buzz vine zinc mob ban cab van can",
    "can cat ban van cab buzz zinc mob van cab ban can cat buzz vine zinc mob ban cab van can cat",
    "buzz vine zinc mob ban cab van can cat buzz vine zinc mob ban cab van can cat buzz vine zinc mob",
    "cat buzz vine zinc mob ban cab van can cat buzz vine zinc mob ban cab van can cat buzz vine zinc",
    "cab van ban can cat buzz vine zinc mob ban cab van can cat buzz vine zinc mob ban cab van can",
    "can cat ban van cab buzz zinc mob van cab ban can cat buzz vine zinc mob ban cab van can cat",
    "buzz vine zinc mob ban cab van can cat buzz vine zinc mob ban cab van can cat buzz vine zinc mob",
  ],
  numberRow: [
    "1 2 3 4 5 6 7 8 9 0 one two 123 456 789 012 345 678 90 1 one 2 two 3 three 4 four 5 five",
    "the year 2024 has numbers 1 2 3 4 5 6 7 8 9 0 in 1234 there were 567 items and 890 counts",
    "123456789 0 numbers in the world year 2024 with 1 2 3 4 5 6 7 8 9 0 starting from count 1 to 2024",
    "1 2 3 4 5 6 7 8 9 0 123 456 789 012 345 678 901 234 567 890 count 1 to 10 20 30 40 50 60 70 80",
    "year 2024 count 100 250 500 1000 items with 1 2 3 4 5 6 7 8 9 0 in row 1234 5678 9012 3456",
    "987654321 0123456789 numbers 10 20 30 40 50 60 70 80 90 100 total counts 12345 67890 13579",
    "score 1500 2400 3600 4800 5000 points 1 2 3 4 5 6 7 8 9 0 in round 10 20 30 40 50 60 70 80 90",
    "12345 67890 13579 24680 98765 43210 numbers 10 20 30 40 50 60 70 80 90 100 1234 5678 9012",
    "1 2 3 4 5 6 7 8 9 0 123 456 789 012 345 678 901 234 567 890 count 1 to 10 20 30 40 50 60 70 80",
    "year 2024 count 100 250 500 1000 items with 1 2 3 4 5 6 7 8 9 0 in row 1234 5678 9012 3456",
    "987654321 0123456789 numbers 10 20 30 40 50 60 70 80 90 100 total counts 12345 67890 13579",
    "score 1500 2400 3600 4800 5000 points 1 2 3 4 5 6 7 8 9 0 in round 10 20 30 40 50 60 70 80 90",
    "12345 67890 13579 24680 98765 43210 numbers 10 20 30 40 50 60 70 80 90 100 1234 5678 9012",
    "1 2 3 4 5 6 7 8 9 0 123 456 789 012 345 678 901 234 567 890 count 1 to 10 20 30 40 50 60 70 80",
    "year 2024 count 100 250 500 1000 items with 1 2 3 4 5 6 7 8 9 0 in row 1234 5678 9012 3456",
  ],
};

function generateExactWordCount(sentences: string[], targetCount: number): string {
  const allWords = sentences.flatMap(s => s.trim().split(/\s+/));
  const resultWords: string[] = [];
  
  // Shuffle words for variety
  const pool = [...allWords].sort(() => 0.5 - Math.random());
  
  let poolIdx = 0;
  while (resultWords.length < targetCount) {
    if (poolIdx >= pool.length) {
      pool.sort(() => 0.5 - Math.random());
      poolIdx = 0;
    }
    resultWords.push(pool[poolIdx]);
    poolIdx++;
  }
  
  return resultWords.slice(0, targetCount).join(' ');
}

function generateQuoteText(quotesList: string[], targetCount: number): string {
  let combined = '';
  let currentWords = 0;
  const shuffledQuotes = [...quotesList].sort(() => 0.5 - Math.random());
  
  for (const q of shuffledQuotes) {
    combined += (combined ? ' ' : '') + q;
    currentWords = combined.trim().split(/\s+/).length;
    if (currentWords >= targetCount) break;
  }
  
  const words = combined.trim().split(/\s+/);
  if (words.length > targetCount) {
    return words.slice(0, targetCount).join(' ');
  }
  
  return words.join(' ');
}

export const getRandomText = (category: keyof TextCategory, lengthLimit = 30): string => {
  if (category === 'code') {
    return getRandomCodeSnippet().code;
  }

  const list = typingTexts[category] || typingTexts.english;

  if (category === 'quotes') {
    return generateQuoteText(list, lengthLimit);
  }

  return generateExactWordCount(list, lengthLimit);
};
