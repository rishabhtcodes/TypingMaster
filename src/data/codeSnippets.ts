export interface CodeSnippet {
  id: string;
  title: string;
  filename: string;
  lang: string;
  code: string;
  sampleInput?: string;
  sampleOutput?: string;
  explanation?: string;
}

export function findSnippetByCode(codeText: string): CodeSnippet | undefined {
  if (!codeText) return undefined;
  const fnMatch = codeText.match(/Filename:\s*([\w.-]+)/i);
  if (fnMatch && fnMatch[1]) {
    const targetFile = fnMatch[1].trim().toLowerCase();
    const found = codeSnippets.find(s => s.filename.toLowerCase() === targetFile);
    if (found) return found;
  }
  const cleanPrompt = codeText.trim().replace(/\r\n/g, '\n');
  return codeSnippets.find(s => s.code.trim().replace(/\r\n/g, '\n') === cleanPrompt);
}

export function getSampleTestCase(codeText: string): { input: string; output: string; explanation?: string } {
  const snippet = findSnippetByCode(codeText);
  if (snippet && snippet.sampleInput && snippet.sampleOutput) {
    return {
      input: snippet.sampleInput,
      output: snippet.sampleOutput,
      explanation: snippet.explanation,
    };
  }

  const low = (codeText || '').toLowerCase();

  if (low.includes('floyd_triangle') || low.includes('floyd')) {
    return { input: 'rows = 4', output: '1\n2 3\n4 5 6\n7 8 9 10', explanation: "Generates Floyd's triangle sequence numbers." };
  }
  if (low.includes('pascal')) {
    return { input: 'numRows = 4', output: '[[1], [1,1], [1,2,1], [1,3,3,1]]', explanation: "Generates Pascal's triangle rows." };
  }
  if (low.includes('pyramid') || low.includes('diamond') || low.includes('pattern') || low.includes('triangle') || low.includes('square') || low.includes('hourglass') || low.includes('butterfly')) {
    return { input: 'rows = 4', output: '   *\n  ***\n *****\n*******', explanation: 'Generates geometric star pattern output.' };
  }
  if (low.includes('fibonacci') || low.includes('fib_')) {
    return { input: 'n = 7', output: '[0, 1, 1, 2, 3, 5, 8]', explanation: 'Calculates Fibonacci sequence values.' };
  }
  if (low.includes('prime') || low.includes('sieve')) {
    return { input: 'n = 29', output: 'true', explanation: 'Verifies primality of integer.' };
  }
  if (low.includes('binary_search') || low.includes('search') || low.includes('find')) {
    return { input: 'arr = [1, 3, 5, 7, 9], target = 7', output: 'Index 3', explanation: 'Performs logarithmic binary search.' };
  }
  if (low.includes('sort')) {
    return { input: 'arr = [5, 2, 9, 1, 7]', output: '[1, 2, 5, 7, 9]', explanation: 'Sorts array elements in ascending order.' };
  }
  if (low.includes('matrix') || low.includes('transpose') || low.includes('diagonal') || low.includes('rotate')) {
    return { input: 'matrix = [[1, 2], [3, 4]]', output: '[[1, 3], [2, 4]]', explanation: 'Transposes or rotates matrix dimensions.' };
  }
  if (low.includes('tree') || low.includes('inorder') || low.includes('bfs') || low.includes('dfs') || low.includes('depth')) {
    return { input: 'root = [1, null, 2, 3]', output: '[1, 3, 2]', explanation: 'Traverses binary tree nodes.' };
  }
  if (low.includes('linked_list') || low.includes('listnode') || low.includes('head')) {
    return { input: 'head = 1 -> 2 -> 3 -> 4', output: '4 -> 3 -> 2 -> 1', explanation: 'Reverses or checks linked list nodes.' };
  }
  if (low.includes('stack') || low.includes('queue') || low.includes('parentheses')) {
    return { input: 's = "({[]})"', output: 'true', explanation: 'Evaluates stack bracket matching.' };
  }

  return {
    input: 'n = 5',
    output: 'Result: OK',
    explanation: 'Executes algorithm to produce expected results.',
  };
}

export const codeSnippets: CodeSnippet[] = [
  // --- 1. PALINDROMES & STRING MANIPULATION ---
  {
    id: 'str-1',
    title: 'Palindrome String Check',
    filename: 'palindrome_check.py',
    lang: 'Python',
    sampleInput: 'text = "A man, a plan, a canal: Panama"',
    sampleOutput: 'True',
    explanation: 'Ignores case and non-alphanumeric characters to verify symmetrical reading.',
    code: `# Filename: palindrome_check.py
def is_palindrome(text: str) -> bool:
    cleaned = ''.join(ch.lower() for ch in text if ch.isalnum())
    left, right = 0, len(cleaned) - 1
    while left < right:
        if cleaned[left] != cleaned[right]:
            return False
        left += 1
        right -= 1
    return True

print(is_palindrome("A man, a plan, a canal: Panama"))`
  },
  {
    id: 'str-2',
    title: 'Numeric Palindrome Check',
    filename: 'numeric_palindrome.ts',
    lang: 'TypeScript',
    code: `// Filename: numeric_palindrome.ts
export function isNumberPalindrome(n: number): boolean {
  if (n < 0 || (n % 10 === 0 && n !== 0)) return false;
  let reversedNum = 0;
  let original = n;
  while (original > reversedNum) {
    reversedNum = reversedNum * 10 + (original % 10);
    original = Math.floor(original / 10);
  }
  return original === reversedNum || original === Math.floor(reversedNum / 10);
}`
  },
  {
    id: 'str-3',
    title: 'Longest Palindromic Substring',
    filename: 'longest_palindrome.cpp',
    lang: 'C++',
    code: `// Filename: longest_palindrome.cpp
#include <iostream>
#include <string>

std::string expandAroundCenter(const std::string& s, int left, int right) {
    while (left >= 0 && right < s.length() && s[left] == s[right]) {
        left--;
        right++;
    }
    return s.substr(left + 1, right - left - 1);
}

std::string longestPalindrome(std::string s) {
    std::string result = "";
    for (int i = 0; i < s.length(); i++) {
        std::string p1 = expandAroundCenter(s, i, i);
        std::string p2 = expandAroundCenter(s, i, i + 1);
        if (p1.length() > result.length()) result = p1;
        if (p2.length() > result.length()) result = p2;
    }
    return result;
}`
  },
  {
    id: 'str-4',
    title: 'Valid Anagram Check',
    filename: 'valid_anagram.py',
    lang: 'Python',
    code: `# Filename: valid_anagram.py
def is_anagram(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False
    counts = {}
    for char in s:
        counts[char] = counts.get(char, 0) + 1
    for char in t:
        if char not in counts or counts[char] == 0:
            return False
        counts[char] -= 1
    return True`
  },
  {
    id: 'str-5',
    title: 'String Reversal in Place',
    filename: 'reverse_string.c',
    lang: 'C',
    code: `// Filename: reverse_string.c
#include <stdio.h>
#include <string.h>

void reverseString(char* str) {
    int left = 0;
    int right = strlen(str) - 1;
    while (left < right) {
        char temp = str[left];
        str[left] = str[right];
        str[right] = temp;
        left++;
        right--;
    }
}`
  },
  {
    id: 'str-6',
    title: 'Count Vowels and Consonants',
    filename: 'count_vowels.ts',
    lang: 'TypeScript',
    code: `// Filename: count_vowels.ts
export function countVowelsAndConsonants(text: string) {
  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);
  let vowelCount = 0;
  let consonantCount = 0;
  for (const char of text.toLowerCase()) {
    if (char >= 'a' && char <= 'z') {
      if (vowels.has(char)) vowelCount++;
      else consonantCount++;
    }
  }
  return { vowelCount, consonantCount };
}`
  },
  {
    id: 'str-7',
    title: 'Title Case String Converter',
    filename: 'title_case.js',
    lang: 'JavaScript',
    code: `// Filename: title_case.js
function toTitleCase(sentence) {
  return sentence
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}`
  },
  {
    id: 'str-8',
    title: 'Longest Common Prefix',
    filename: 'longest_prefix.py',
    lang: 'Python',
    code: `# Filename: longest_prefix.py
def longest_common_prefix(strs: list[str]) -> str:
    if not strs:
        return ""
    prefix = strs[0]
    for string in strs[1:]:
        while not string.startswith(prefix):
            prefix = prefix[:-1]
            if not prefix:
                return ""
    return prefix`
  },
  {
    id: 'str-9',
    title: 'Run Length Encoding String Compression',
    filename: 'string_compression.ts',
    lang: 'TypeScript',
    code: `// Filename: string_compression.ts
export function compressString(str: string): string {
  if (!str) return "";
  let compressed = "";
  let count = 1;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === str[i + 1]) {
      count++;
    } else {
      compressed += str[i] + count;
      count = 1;
    }
  }
  return compressed.length < str.length ? compressed : str;
}`
  },
  {
    id: 'str-10',
    title: 'Pangram Sentence Checker',
    filename: 'is_pangram.java',
    lang: 'Java',
    code: `// Filename: is_pangram.java
public class PangramChecker {
    public static boolean isPangram(String sentence) {
        boolean[] mark = new boolean[26];
        int index = 0;
        for (int i = 0; i < sentence.length(); i++) {
            char ch = sentence.charAt(i);
            if ('A' <= ch && ch <= 'Z') index = ch - 'A';
            else if ('a' <= ch && ch <= 'z') index = ch - 'a';
            else continue;
            mark[index] = true;
        }
        for (boolean b : mark) if (!b) return false;
        return true;
    }
}`
  },
  {
    id: 'str-11',
    title: 'Isomorphic Strings Verification',
    filename: 'isomorphic_strings.py',
    lang: 'Python',
    code: `# Filename: isomorphic_strings.py
def is_isomorphic(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False
    map_st, map_ts = {}, {}
    for c1, c2 in zip(s, t):
        if (c1 in map_st and map_st[c1] != c2) or (c2 in map_ts and map_ts[c2] != c1):
            return False
        map_st[c1] = c2
        map_ts[c2] = c1
    return True`
  },
  {
    id: 'str-12',
    title: 'Word Frequency Counter',
    filename: 'word_frequency.ts',
    lang: 'TypeScript',
    code: `// Filename: word_frequency.ts
export function getWordFrequencies(paragraph: string): Record<string, number> {
  const words = paragraph.toLowerCase().replace(/[^a-z0-9\\s]/g, '').split(/\\s+/);
  const freqMap: Record<string, number> = {};
  for (const word of words) {
    if (word) {
      freqMap[word] = (freqMap[word] || 0) + 1;
    }
  }
  return freqMap;
}`
  },
  {
    id: 'str-13',
    title: 'Valid IP Address Validator',
    filename: 'valid_ip.js',
    lang: 'JavaScript',
    code: `// Filename: valid_ip.js
function isValidIPv4(ip) {
  const parts = ip.split('.');
  if (parts.length !== 4) return false;
  return parts.every(part => {
    if (!/^\\d+$/.test(part)) return false;
    const num = Number(part);
    if (num < 0 || num > 255) return false;
    if (part.length > 1 && part.startsWith('0')) return false;
    return true;
  });
}`
  },
  {
    id: 'str-14',
    title: 'Caesar Cipher Encryptor',
    filename: 'caesar_cipher.py',
    lang: 'Python',
    code: `# Filename: caesar_cipher.py
def encrypt_caesar(text: str, shift: int) -> str:
    result = []
    for char in text:
        if char.isalpha():
            start = ord('A') if char.isupper() else ord('a')
            shifted = chr((ord(char) - start + shift) % 26 + start)
            result.append(shifted)
        else:
            result.append(char)
    return "".join(result)`
  },
  {
    id: 'str-15',
    title: 'Reverse Words in Sentence',
    filename: 'reverse_words.ts',
    lang: 'TypeScript',
    code: `// Filename: reverse_words.ts
export function reverseWords(sentence: string): string {
  return sentence
    .trim()
    .split(/\\s+/)
    .reverse()
    .join(' ');
}`
  },

  // --- 2. FIBONACCI & MATHEMATICAL ALGORITHMS ---
  {
    id: 'math-16',
    title: 'Fibonacci Sequence Iterative',
    filename: 'fibonacci_iterative.py',
    lang: 'Python',
    code: `# Filename: fibonacci_iterative.py
def generate_fibonacci(n: int) -> list[int]:
    if n <= 0:
        return []
    if n == 1:
        return [0]
    fib_sequence = [0, 1]
    for i in range(2, n):
        next_val = fib_sequence[-1] + fib_sequence[-2]
        fib_sequence.append(next_val)
    return fib_sequence`
  },
  {
    id: 'math-17',
    title: 'Fibonacci Recursive with Memoization',
    filename: 'fibonacci_memoized.ts',
    lang: 'TypeScript',
    code: `// Filename: fibonacci_memoized.ts
const memo = new Map<number, number>();

export function fibonacciMemo(n: number): number {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  if (memo.has(n)) return memo.get(n)!;
  const value = fibonacciMemo(n - 1) + fibonacciMemo(n - 2);
  memo.set(n, value);
  return value;
}`
  },
  {
    id: 'math-18',
    title: 'Prime Number Test',
    filename: 'is_prime.cpp',
    lang: 'C++',
    code: `// Filename: is_prime.cpp
#include <iostream>

bool isPrime(int n) {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 == 0 || n % 3 == 0) return false;
    for (int i = 5; i * i <= n; i += 6) {
        if (n % i == 0 || n % (i + 2) == 0)
            return false;
    }
    return true;
}`
  },
  {
    id: 'math-19',
    title: 'Sieve of Eratosthenes Primes',
    filename: 'sieve_primes.py',
    lang: 'Python',
    code: `# Filename: sieve_primes.py
def sieve_of_eratosthenes(limit: int) -> list[int]:
    is_prime = [True] * (limit + 1)
    is_prime[0] = is_prime[1] = False
    for p in range(2, int(limit**0.5) + 1):
        if is_prime[p]:
            for i in range(p * p, limit + 1, p):
                is_prime[i] = False
    return [p for p in range(2, limit + 1) if is_prime[p]]`
  },
  {
    id: 'math-20',
    title: 'Factorial Calculator Iterative',
    filename: 'factorial.c',
    lang: 'C',
    code: `// Filename: factorial.c
#include <stdio.h>

long long calculateFactorial(int n) {
    if (n < 0) return -1;
    long long factorial = 1;
    for (int i = 1; i <= n; i++) {
        factorial *= i;
    }
    return factorial;
}`
  },
  {
    id: 'math-21',
    title: 'GCD and LCM Calculator',
    filename: 'gcd_lcm.ts',
    lang: 'TypeScript',
    code: `// Filename: gcd_lcm.ts
export function findGCD(a: number, b: number): number {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

export function findLCM(a: number, b: number): number {
  return (a * b) / findGCD(a, b);
}`
  },
  {
    id: 'math-22',
    title: 'Armstrong Number Verifier',
    filename: 'armstrong_number.py',
    lang: 'Python',
    code: `# Filename: armstrong_number.py
def is_armstrong(n: int) -> bool:
    digits = [int(d) for d in str(n)]
    power = len(digits)
    total = sum(digit ** power for digit in digits)
    return total == n`
  },
  {
    id: 'math-23',
    title: 'Pascal Triangle Line Generator',
    filename: 'pascal_triangle.js',
    lang: 'JavaScript',
    code: `// Filename: pascal_triangle.js
function generatePascalTriangle(numRows) {
  const triangle = [];
  for (let i = 0; i < numRows; i++) {
    const row = new Array(i + 1).fill(1);
    for (let j = 1; j < i; j++) {
      row[j] = triangle[i - 1][j - 1] + triangle[i - 1][j];
    }
    triangle.push(row);
  }
  return triangle;
}`
  },
  {
    id: 'math-24',
    title: 'Power Function Binary Exponentiation',
    filename: 'binary_power.cpp',
    lang: 'C++',
    code: `// Filename: binary_power.cpp
#include <iostream>

long long power(long long base, long long exp) {
    long long res = 1;
    base = base;
    while (exp > 0) {
        if (exp % 2 == 1) res = (res * base);
        base = (base * base);
        exp /= 2;
    }
    return res;
}`
  },
  {
    id: 'math-25',
    title: 'Square Root Binary Search',
    filename: 'binary_sqrt.py',
    lang: 'Python',
    code: `# Filename: binary_sqrt.py
def integer_sqrt(x: int) -> int:
    if x < 2:
        return x
    left, right = 1, x // 2
    ans = 0
    while left <= right:
        mid = (left + right) // 2
        if mid * mid <= x:
            ans = mid
            left = mid + 1
        else:
            right = mid - 1
    return ans`
  },
  {
    id: 'math-26',
    title: 'Perfect Number Verification',
    filename: 'perfect_number.ts',
    lang: 'TypeScript',
    code: `// Filename: perfect_number.ts
export function isPerfectNumber(num: number): boolean {
  if (num <= 1) return false;
  let sum = 1;
  for (let i = 2; i * i <= num; i++) {
    if (num % i === 0) {
      sum += i;
      if (i * i !== num) sum += num / i;
    }
  }
  return sum === num;
}`
  },
  {
    id: 'math-27',
    title: 'Happy Number Algorithm',
    filename: 'happy_number.py',
    lang: 'Python',
    code: `# Filename: happy_number.py
def is_happy(n: int) -> bool:
    def get_next(num: int) -> int:
        return sum(int(digit) ** 2 for digit in str(num))

    seen = set()
    while n != 1 and n not in seen:
        seen.add(n)
        n = get_next(n)
    return n == 1`
  },
  {
    id: 'math-28',
    title: 'Roman Numeral to Integer',
    filename: 'roman_to_int.ts',
    lang: 'TypeScript',
    code: `// Filename: roman_to_int.ts
export function romanToInt(s: string): number {
  const romanMap: Record<string, number> = {
    I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000
  };
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const current = romanMap[s[i]];
    const next = romanMap[s[i + 1]];
    if (next && current < next) {
      total -= current;
    } else {
      total += current;
    }
  }
  return total;
}`
  },
  {
    id: 'math-29',
    title: 'Integer to Roman Numeral',
    filename: 'int_to_roman.py',
    lang: 'Python',
    code: `# Filename: int_to_roman.py
def int_to_roman(num: int) -> str:
    val_map = [
        (1000, "M"), (900, "CM"), (500, "D"), (400, "CD"),
        (100, "C"), (90, "XC"), (50, "L"), (40, "XL"),
        (10, "X"), (9, "IX"), (5, "V"), (4, "IV"), (1, "I")
    ]
    roman = []
    for val, symbol in val_map:
        while num >= val:
            roman.append(symbol)
            num -= val
    return "".join(roman)`
  },
  {
    id: 'math-30',
    title: 'Decimal to Binary Converter',
    filename: 'decimal_to_binary.c',
    lang: 'C',
    code: `// Filename: decimal_to_binary.c
#include <stdio.stdio.h>

void decimalToBinary(int n) {
    int binaryNum[32];
    int i = 0;
    while (n > 0) {
        binaryNum[i] = n % 2;
        n = n / 2;
        i++;
    }
    for (int j = i - 1; j >= 0; j--)
        printf("%d", binaryNum[j]);
}`
  },

  // --- 3. PATTERN PRINTING & GRAPHICS ---
  {
    id: 'pat-31',
    title: 'Right Angle Star Triangle Pattern',
    filename: 'right_triangle_pattern.py',
    lang: 'Python',
    code: `# Filename: right_triangle_pattern.py
def print_right_triangle(rows: int):
    for i in range(1, rows + 1):
        line = "*" * i
        print(line)

print_right_triangle(5)`
  },
  {
    id: 'pat-32',
    title: 'Inverted Right Triangle Pattern',
    filename: 'inverted_triangle.ts',
    lang: 'TypeScript',
    code: `// Filename: inverted_triangle.ts
export function printInvertedTriangle(rows: number): void {
  for (let i = rows; i >= 1; i--) {
    let line = '';
    for (let j = 1; j <= i; j++) {
      line += '* ';
    }
    console.log(line);
  }
}`
  },
  {
    id: 'pat-33',
    title: 'Pyramid Star Pattern',
    filename: 'pyramid_pattern.java',
    lang: 'Java',
    code: `// Filename: pyramid_pattern.java
public class PyramidPattern {
    public static void printPyramid(int n) {
        for (int i = 1; i <= n; i++) {
            for (int j = i; j < n; j++) {
                System.out.print(" ");
            }
            for (int k = 1; k <= (2 * i - 1); k++) {
                System.out.print("*");
            }
            System.out.println();
        }
    }
}`
  },
  {
    id: 'pat-34',
    title: 'Diamond Star Pattern',
    filename: 'diamond_pattern.cpp',
    lang: 'C++',
    code: `// Filename: diamond_pattern.cpp
#include <iostream>

void printDiamond(int n) {
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n - i; j++) std::cout << " ";
        for (int k = 1; k <= 2 * i - 1; k++) std::cout << "*";
        std::cout << "\\n";
    }
    for (int i = n - 1; i >= 1; i--) {
        for (int j = 1; j <= n - i; j++) std::cout << " ";
        for (int k = 1; k <= 2 * i - 1; k++) std::cout << "*";
        std::cout << "\\n";
    }
}`
  },
  {
    id: 'pat-35',
    title: 'Hollow Square Pattern',
    filename: 'hollow_square.py',
    lang: 'Python',
    code: `# Filename: hollow_square.py
def print_hollow_square(size: int):
    for i in range(size):
        if i == 0 or i == size - 1:
            print("*" * size)
        else:
            print("*" + " " * (size - 2) + "*")

print_hollow_square(5)`
  },
  {
    id: 'pat-36',
    title: 'Floyd Triangle Number Pattern',
    filename: 'floyd_triangle.ts',
    lang: 'TypeScript',
    code: `// Filename: floyd_triangle.ts
export function printFloydTriangle(rows: number): void {
  let num = 1;
  for (let i = 1; i <= rows; i++) {
    let line = '';
    for (let j = 1; j <= i; j++) {
      line += num + ' ';
      num++;
    }
    console.log(line);
  }
}`
  },
  {
    id: 'pat-37',
    title: 'Butterfly Star Pattern',
    filename: 'butterfly_pattern.java',
    lang: 'Java',
    code: `// Filename: butterfly_pattern.java
public class ButterflyPattern {
    public static void printButterfly(int n) {
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= i; j++) System.out.print("*");
            for (int j = 1; j <= 2 * (n - i); j++) System.out.print(" ");
            for (int j = 1; j <= i; j++) System.out.print("*");
            System.out.println();
        }
        for (int i = n; i >= 1; i--) {
            for (int j = 1; j <= i; j++) System.out.print("*");
            for (int j = 1; j <= 2 * (n - i); j++) System.out.print(" ");
            for (int j = 1; j <= i; j++) System.out.print("*");
            System.out.println();
        }
    }
}`
  },
  {
    id: 'pat-38',
    title: 'Hourglass Star Pattern',
    filename: 'hourglass_pattern.py',
    lang: 'Python',
    code: `# Filename: hourglass_pattern.py
def print_hourglass(n: int):
    for i in range(n, 0, -1):
        spaces = " " * (n - i)
        stars = "*" * (2 * i - 1)
        print(spaces + stars)
    for i in range(2, n + 1):
        spaces = " " * (n - i)
        stars = "*" * (2 * i - 1)
        print(spaces + stars)`
  },
  {
    id: 'pat-39',
    title: 'Number Pyramid Pattern',
    filename: 'number_pyramid.ts',
    lang: 'TypeScript',
    code: `// Filename: number_pyramid.ts
export function printNumberPyramid(rows: number): void {
  for (let i = 1; i <= rows; i++) {
    let line = ' '.repeat(rows - i);
    for (let j = 1; j <= i; j++) {
      line += i + ' ';
    }
    console.log(line);
  }
}`
  },
  {
    id: 'pat-40',
    title: 'Binary Alternating Pattern',
    filename: 'binary_pattern.c',
    lang: 'C',
    code: `// Filename: binary_pattern.c
#include <stdio.h>

void printBinaryPattern(int n) {
    for (int i = 1; i <= n; i++) {
        int val = (i % 2 == 0) ? 0 : 1;
        for (int j = 1; j <= i; j++) {
            printf("%d ", val);
            val = 1 - val;
        }
        printf("\\n");
    }
}`
  },

  // --- 4. DATA STRUCTURES & SEARCHING/SORTING ALGORITHMS ---
  {
    id: 'ds-41',
    title: 'Binary Search Algorithm Iterative',
    filename: 'binary_search.py',
    lang: 'Python',
    code: `# Filename: binary_search.py
def binary_search(arr: list[int], target: int) -> int:
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`
  },
  {
    id: 'ds-42',
    title: 'Bubble Sort Algorithm',
    filename: 'bubble_sort.ts',
    lang: 'TypeScript',
    code: `// Filename: bubble_sort.ts
export function bubbleSort(arr: number[]): number[] {
  const n = arr.length;
  const result = [...arr];
  for (let i = 0; i < n; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (result[j] > result[j + 1]) {
        const temp = result[j];
        result[j] = result[j + 1];
        result[j + 1] = temp;
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return result;
}`
  },
  {
    id: 'ds-43',
    title: 'Merge Sort Divide and Conquer',
    filename: 'merge_sort.cpp',
    lang: 'C++',
    code: `// Filename: merge_sort.cpp
#include <vector>

void merge(std::vector<int>& arr, int l, int m, int r) {
    std::vector<int> left(arr.begin() + l, arr.begin() + m + 1);
    std::vector<int> right(arr.begin() + m + 1, arr.begin() + r + 1);
    int i = 0, j = 0, k = l;
    while (i < left.size() && j < right.size()) {
        if (left[i] <= right[j]) arr[k++] = left[i++];
        else arr[k++] = right[j++];
    }
    while (i < left.size()) arr[k++] = left[i++];
    while (j < right.size()) arr[k++] = right[j++];
}

void mergeSort(std::vector<int>& arr, int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}`
  },
  {
    id: 'ds-44',
    title: 'Quick Sort Partition Algorithm',
    filename: 'quick_sort.py',
    lang: 'Python',
    code: `# Filename: quick_sort.py
def quick_sort(arr: list[int]) -> list[int]:
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)`
  },
  {
    id: 'ds-45',
    title: 'Selection Sort Algorithm',
    filename: 'selection_sort.ts',
    lang: 'TypeScript',
    code: `// Filename: selection_sort.ts
export function selectionSort(arr: number[]): number[] {
  const a = [...arr];
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (a[j] < a[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      const temp = a[i];
      a[i] = a[minIdx];
      a[minIdx] = temp;
    }
  }
  return a;
}`
  },
  {
    id: 'ds-46',
    title: 'Insertion Sort Algorithm',
    filename: 'insertion_sort.java',
    lang: 'Java',
    code: `// Filename: insertion_sort.java
public class InsertionSort {
    public static void sort(int[] arr) {
        int n = arr.length;
        for (int i = 1; i < n; ++i) {
            int key = arr[i];
            int j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j = j - 1;
            }
            arr[j + 1] = key;
        }
    }
}`
  },
  {
    id: 'ds-47',
    title: 'Two Sum Target Pair Index',
    filename: 'two_sum.ts',
    lang: 'TypeScript',
    code: `// Filename: two_sum.ts
export function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}`
  },
  {
    id: 'ds-48',
    title: 'Three Sum Zero Target Triplets',
    filename: 'three_sum.py',
    lang: 'Python',
    code: `# Filename: three_sum.py
def three_sum(nums: list[int]) -> list[list[int]]:
    nums.sort()
    res = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        left, right = i + 1, len(nums) - 1
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            if total == 0:
                res.append([nums[i], nums[left], nums[right]])
                while left < right and nums[left] == nums[left + 1]: left += 1
                while left < right and nums[right] == nums[right - 1]: right -= 1
                left += 1; right -= 1
            elif total < 0: left += 1
            else: right -= 1
    return res`
  },
  {
    id: 'ds-49',
    title: 'Stack Implementation Class',
    filename: 'stack_data_structure.ts',
    lang: 'TypeScript',
    code: `// Filename: stack_data_structure.ts
export class Stack<T> {
  private items: T[] = [];

  push(element: T): void {
    this.items.push(element);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }
}`
  },
  {
    id: 'ds-50',
    title: 'Queue Implementation Class',
    filename: 'queue_data_structure.ts',
    lang: 'TypeScript',
    code: `// Filename: queue_data_structure.ts
export class Queue<T> {
  private items: Record<number, T> = {};
  private headIndex = 0;
  private tailIndex = 0;

  enqueue(item: T): void {
    this.items[this.tailIndex] = item;
    this.tailIndex++;
  }

  dequeue(): T | undefined {
    if (this.headIndex === this.tailIndex) return undefined;
    const item = this.items[this.headIndex];
    delete this.items[this.headIndex];
    this.headIndex++;
    return item;
  }

  size(): number {
    return this.tailIndex - this.headIndex;
  }
}`
  },
  {
    id: 'ds-51',
    title: 'Reverse Singly Linked List',
    filename: 'reverse_linked_list.cpp',
    lang: 'C++',
    code: `// Filename: reverse_linked_list.cpp
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    while (curr != nullptr) {
        ListNode* nextTemp = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
}`
  },
  {
    id: 'ds-52',
    title: 'Detect Cycle in Linked List',
    filename: 'detect_cycle.py',
    lang: 'Python',
    code: `# Filename: detect_cycle.py
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def has_cycle(head: ListNode) -> bool:
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False`
  },
  {
    id: 'ds-53',
    title: 'Binary Tree Inorder Traversal',
    filename: 'binary_tree_inorder.ts',
    lang: 'TypeScript',
    code: `// Filename: binary_tree_inorder.ts
export class TreeNode {
  val: number;
  left: TreeNode | null = null;
  right: TreeNode | null = null;
  constructor(val: number) { this.val = val; }
}

export function inorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];
  function traverse(node: TreeNode | null) {
    if (!node) return;
    traverse(node.left);
    result.push(node.val);
    traverse(node.right);
  }
  traverse(root);
  return result;
}`
  },
  {
    id: 'ds-54',
    title: 'Max Depth of Binary Tree',
    filename: 'max_depth_tree.py',
    lang: 'Python',
    code: `# Filename: max_depth_tree.py
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def max_depth(root: TreeNode) -> int:
    if not root:
        return 0
    left_depth = max_depth(root.left)
    right_depth = max_depth(root.right)
    return 1 + max(left_depth, right_depth)`
  },
  {
    id: 'ds-55',
    title: 'Valid Parentheses Bracket Stack',
    filename: 'valid_parentheses.ts',
    lang: 'TypeScript',
    code: `// Filename: valid_parentheses.ts
export function isValidParentheses(s: string): boolean {
  const stack: string[] = [];
  const map: Record<string, string> = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if (char in map) {
      const topElement = stack.length === 0 ? '#' : stack.pop();
      if (topElement !== map[char]) return false;
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}`
  },
  {
    id: 'ds-56',
    title: 'Matrix Transpose Algorithm',
    filename: 'matrix_transpose.c',
    lang: 'C',
    code: `// Filename: matrix_transpose.c
#include <stdio.h>

void transposeMatrix(int r, int c, int matrix[r][c], int transpose[c][r]) {
    for (int i = 0; i < r; ++i) {
        for (int j = 0; j < c; ++j) {
            transpose[j][i] = matrix[i][j];
        }
    }
}`
  },
  {
    id: 'ds-57',
    title: 'Matrix Multiplication 2D',
    filename: 'matrix_multiply.py',
    lang: 'Python',
    code: `# Filename: matrix_multiply.py
def multiply_matrices(A: list[list[int]], B: list[list[int]]) -> list[list[int]]:
    rows_A, cols_A = len(A), len(A[0])
    rows_B, cols_B = len(B), len(B[0])
    if cols_A != rows_B:
        raise ValueError("Cannot multiply matrices")
    C = [[0] * cols_B for _ in range(rows_A)]
    for i in range(rows_A):
        for j in range(cols_B):
            for k in range(cols_A):
                C[i][j] += A[i][k] * B[k][j]
    return C`
  },
  {
    id: 'ds-58',
    title: 'Rotate Image 90 Degrees',
    filename: 'rotate_matrix.ts',
    lang: 'TypeScript',
    code: `// Filename: rotate_matrix.ts
export function rotateMatrix(matrix: number[][]): void {
  const n = matrix.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const temp = matrix[i][j];
      matrix[i][j] = matrix[j][i];
      matrix[j][i] = temp;
    }
  }
  for (let i = 0; i < n; i++) {
    matrix[i].reverse();
  }
}`
  },
  {
    id: 'ds-59',
    title: 'Spiral Matrix Traversal',
    filename: 'spiral_matrix.py',
    lang: 'Python',
    code: `# Filename: spiral_matrix.py
def spiral_order(matrix: list[list[int]]) -> list[int]:
    res = []
    if not matrix: return res
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    while top <= bottom and left <= right:
        for i in range(left, right + 1): res.append(matrix[top][i])
        top += 1
        for i in range(top, bottom + 1): res.append(matrix[i][right])
        right -= 1
        if top <= bottom:
            for i in range(right, left - 1, -1): res.append(matrix[bottom][i])
            bottom -= 1
        if left <= right:
            for i in range(bottom, top - 1, -1): res.append(matrix[i][left])
            left += 1
    return res`
  },
  {
    id: 'ds-60',
    title: 'Dynamic Programming Grid Unique Paths',
    filename: 'unique_paths.ts',
    lang: 'TypeScript',
    code: `// Filename: unique_paths.ts
export function uniquePaths(m: number, n: number): number {
  const dp = Array(n).fill(1);
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[j] += dp[j - 1];
    }
  }
  return dp[n - 1];
}`
  },

  // --- 5. PRACTICAL UTILITIES & DESIGN PATTERNS ---
  {
    id: 'util-61',
    title: 'Debounce Utility Function',
    filename: 'debounce.ts',
    lang: 'TypeScript',
    code: `// Filename: debounce.ts
export function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return function (this: any, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}`
  },
  {
    id: 'util-62',
    title: 'Throttle Utility Function',
    filename: 'throttle.ts',
    lang: 'TypeScript',
    code: `// Filename: throttle.ts
export function throttle<T extends (...args: any[]) => void>(fn: T, limit: number) {
  let lastCall = 0;
  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}`
  },
  {
    id: 'util-63',
    title: 'PubSub Event Emitter Pattern',
    filename: 'event_emitter.ts',
    lang: 'TypeScript',
    code: `// Filename: event_emitter.ts
type Listener = (...args: any[]) => void;

export class EventEmitter {
  private events: Record<string, Listener[]> = {};

  on(event: string, listener: Listener): void {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(listener);
  }

  emit(event: string, ...args: any[]): void {
    if (this.events[event]) {
      this.events[event].forEach(fn => fn(...args));
    }
  }
}`
  },
  {
    id: 'util-64',
    title: 'Deep Clone Object Recursion',
    filename: 'deep_clone.js',
    lang: 'JavaScript',
    code: `// Filename: deep_clone.js
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(deepClone);
  const copy = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      copy[key] = deepClone(obj[key]);
    }
  }
  return copy;
}`
  },
  {
    id: 'util-65',
    title: 'Flatten Nested Array Recursively',
    filename: 'flatten_array.ts',
    lang: 'TypeScript',
    code: `// Filename: flatten_array.ts
export function flattenArray<T>(arr: any[]): T[] {
  let result: T[] = [];
  for (const item of arr) {
    if (Array.isArray(item)) {
      result = result.concat(flattenArray(item));
    } else {
      result.push(item);
    }
  }
  return result;
}`
  },
  {
    id: 'util-66',
    title: 'LRU Cache Implementation Map',
    filename: 'lru_cache.ts',
    lang: 'TypeScript',
    code: `// Filename: lru_cache.ts
export class LRUCache {
  private capacity: number;
  private cache: Map<number, number> = new Map();

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  get(key: number): number {
    if (!this.cache.has(key)) return -1;
    const val = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }

  put(key: number, value: number): void {
    if (this.cache.has(key)) this.cache.delete(key);
    this.cache.set(key, value);
    if (this.cache.size > this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey!);
    }
  }
}`
  },
  {
    id: 'util-67',
    title: 'Memoize Function Cache Decorator',
    filename: 'memoize.ts',
    lang: 'TypeScript',
    code: `// Filename: memoize.ts
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, any>();
  return function (this: any, ...args: any[]) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  } as T;
}`
  },
  {
    id: 'util-68',
    title: 'Fetch with Automatic Retries',
    filename: 'fetch_retry.ts',
    lang: 'TypeScript',
    code: `// Filename: fetch_retry.ts
export async function fetchWithRetry(url: string, retries = 3, delay = 1000): Promise<Response> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(\`HTTP status \${response.status}\`);
    return response;
  } catch (err) {
    if (retries > 0) {
      await new Promise(res => setTimeout(res, delay));
      return fetchWithRetry(url, retries - 1, delay * 2);
    }
    throw err;
  }
}`
  },

  // --- 6. ADDITIONAL CODING PROBLEMS (69-100) ---
  {
    id: 'code-69',
    title: 'Binary Search Tree Insert',
    filename: 'bst_insert.py',
    lang: 'Python',
    code: `# Filename: bst_insert.py
class Node:
    def __init__(self, key):
        self.left = None
        self.right = None
        self.val = key

def insert(root, key):
    if root is None:
        return Node(key)
    if root.val == key:
        return root
    if root.val < key:
        root.right = insert(root.right, key)
    else:
        root.left = insert(root.left, key)
    return root`
  },
  {
    id: 'code-70',
    title: 'Matrix Diagonal Sum',
    filename: 'diagonal_sum.ts',
    lang: 'TypeScript',
    code: `// Filename: diagonal_sum.ts
export function diagonalSum(mat: number[][]): number {
  const n = mat.length;
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += mat[i][i];
    if (i !== n - 1 - i) {
      sum += mat[i][n - 1 - i];
    }
  }
  return sum;
}`
  },
  {
    id: 'code-71',
    title: 'Binary Tree Level Order Traversal BFS',
    filename: 'tree_level_order.py',
    lang: 'Python',
    code: `# Filename: tree_level_order.py
from collections import deque

def level_order(root) -> list[list[int]]:
    if not root: return []
    result = []
    queue = deque([root])
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        result.append(level)
    return result`
  },
  {
    id: 'code-72',
    title: 'Coin Change Minimum Coins DP',
    filename: 'coin_change.ts',
    lang: 'TypeScript',
    code: `// Filename: coin_change.ts
export function coinChange(coins: number[], amount: number): number {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (i - coin >= 0) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`
  },
  {
    id: 'code-73',
    title: 'Longest Increasing Subsequence DP',
    filename: 'longest_increasing_subseq.py',
    lang: 'Python',
    code: `# Filename: longest_increasing_subseq.py
def length_of_lis(nums: list[int]) -> int:
    if not nums: return 0
    dp = [1] * len(nums)
    for i in range(1, len(nums)):
        for j in range(i):
            if nums[i] > nums[j]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp)`
  },
  {
    id: 'code-74',
    title: 'Check Subsequence In Order',
    filename: 'is_subsequence.ts',
    lang: 'TypeScript',
    code: `// Filename: is_subsequence.ts
export function isSubsequence(s: string, t: string): boolean {
  let i = 0, j = 0;
  while (i < s.length && j < t.length) {
    if (s[i] === t[j]) i++;
    j++;
  }
  return i === s.length;
}`
  },
  {
    id: 'code-75',
    title: '0/1 Knapsack Problem DP',
    filename: 'knapsack_problem.py',
    lang: 'Python',
    code: `# Filename: knapsack_problem.py
def knapsack(W: int, wt: list[int], val: list[int], n: int) -> int:
    K = [[0 for _ in range(W + 1)] for _ in range(n + 1)]
    for i in range(n + 1):
        for w in range(W + 1):
            if i == 0 or w == 0:
                K[i][w] = 0
            elif wt[i - 1] <= w:
                K[i][w] = max(val[i - 1] + K[i - 1][w - wt[i - 1]], K[i - 1][w])
            else:
                K[i][w] = K[i - 1][w]
    return K[n][W]`
  },
  {
    id: 'code-76',
    title: 'Merge Two Sorted Arrays',
    filename: 'merge_sorted_arrays.ts',
    lang: 'TypeScript',
    code: `// Filename: merge_sorted_arrays.ts
export function mergeSorted(arr1: number[], arr2: number[]): number[] {
  const merged: number[] = [];
  let i = 0, j = 0;
  while (i < arr1.length && j < arr2.length) {
    if (arr1[i] < arr2[j]) merged.push(arr1[i++]);
    else merged.push(arr2[j++]);
  }
  return merged.concat(arr1.slice(i)).concat(arr2.slice(j));
}`
  },
  {
    id: 'code-77',
    title: 'Graph Breadth First Search BFS',
    filename: 'graph_bfs.py',
    lang: 'Python',
    code: `# Filename: graph_bfs.py
from collections import deque

def bfs(graph: dict, start_node: str) -> list[str]:
    visited = set([start_node])
    queue = deque([start_node])
    order = []
    while queue:
        vertex = queue.popleft()
        order.append(vertex)
        for neighbor in graph.get(vertex, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return order`
  },
  {
    id: 'code-78',
    title: 'Graph Depth First Search DFS',
    filename: 'graph_dfs.py',
    lang: 'Python',
    code: `# Filename: graph_dfs.py
def dfs(graph: dict, start_node: str, visited=None) -> list[str]:
    if visited is None:
        visited = set()
    visited.add(start_node)
    path = [start_node]
    for neighbor in graph.get(start_node, []):
        if neighbor not in visited:
            path.extend(dfs(graph, neighbor, visited))
    return path`
  },
  {
    id: 'code-79',
    title: 'Max Subarray Sum Kadane Algorithm',
    filename: 'kadane_algorithm.ts',
    lang: 'TypeScript',
    code: `// Filename: kadane_algorithm.ts
export function maxSubArray(nums: number[]): number {
  let maxSum = nums[0];
  let currentSum = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  return maxSum;
}`
  },
  {
    id: 'code-80',
    title: 'Majority Element Boyer Moore Vote',
    filename: 'majority_element.py',
    lang: 'Python',
    code: `# Filename: majority_element.py
def majority_element(nums: list[int]) -> int:
    count = 0
    candidate = None
    for num in nums:
        if count == 0:
            candidate = num
        count += (1 if num == candidate else -1)
    return candidate`
  },
  {
    id: 'code-81',
    title: 'Find Peak Element Binary Search',
    filename: 'peak_element.ts',
    lang: 'TypeScript',
    code: `// Filename: peak_element.ts
export function findPeakElement(nums: number[]): number {
  let left = 0;
  let right = nums.length - 1;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] > nums[mid + 1]) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  return left;
}`
  },
  {
    id: 'code-82',
    title: 'Move Zeroes to End of Array',
    filename: 'move_zeroes.py',
    lang: 'Python',
    sampleInput: 'nums = [0, 1, 0, 3, 12]',
    sampleOutput: '[1, 3, 12, 0, 0]',
    explanation: 'Moves all zeros to the end in-place while keeping relative order of non-zero numbers.',
    code: `# Filename: move_zeroes.py
def move_zeroes(nums: list[int]) -> None:
    last_non_zero = 0
    for i in range(len(nums)):
        if nums[i] != 0:
            nums[last_non_zero], nums[i] = nums[i], nums[last_non_zero]
            last_non_zero += 1`
  },
  {
    id: 'code-83',
    title: 'Product of Array Except Self',
    filename: 'product_except_self.ts',
    lang: 'TypeScript',
    code: `// Filename: product_except_self.ts
export function productExceptSelf(nums: number[]): number[] {
  const n = nums.length;
  const res = new Array(n).fill(1);
  let prefix = 1;
  for (let i = 0; i < n; i++) {
    res[i] = prefix;
    prefix *= nums[i];
  }
  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    res[i] *= suffix;
    suffix *= nums[i];
  }
  return res;
}`
  },
  {
    id: 'code-84',
    title: 'Container With Most Water',
    filename: 'max_water_container.py',
    lang: 'Python',
    code: `# Filename: max_water_container.py
def max_area(height: list[int]) -> int:
    left, right = 0, len(height) - 1
    max_water = 0
    while left < right:
        width = right - left
        h = min(height[left], height[right])
        max_water = max(max_water, width * h)
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return max_water`
  },
  {
    id: 'code-85',
    title: 'Valid Sudoku Board Verifier',
    filename: 'valid_sudoku.ts',
    lang: 'TypeScript',
    code: `// Filename: valid_sudoku.ts
export function isValidSudoku(board: string[][]): boolean {
  const rows = new Array(9).fill(0).map(() => new Set());
  const cols = new Array(9).fill(0).map(() => new Set());
  const boxes = new Array(9).fill(0).map(() => new Set());
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const val = board[r][c];
      if (val === '.') continue;
      const bIdx = Math.floor(r / 3) * 3 + Math.floor(c / 3);
      if (rows[r].has(val) || cols[c].has(val) || boxes[bIdx].has(val)) {
        return false;
      }
      rows[r].add(val);
      cols[c].add(val);
      boxes[bIdx].add(val);
    }
  }
  return true;
}`
  },
  {
    id: 'code-86',
    title: 'Length of Last Word in String',
    filename: 'last_word_length.py',
    lang: 'Python',
    code: `# Filename: last_word_length.py
def length_of_last_word(s: str) -> int:
    length = 0
    i = len(s) - 1
    while i >= 0 and s[i] == ' ':
        i -= 1
    while i >= 0 and s[i] != ' ':
        length += 1
        i -= 1
    return length`
  },
  {
    id: 'code-87',
    title: 'Add Two Numbers Linked List',
    filename: 'add_two_numbers.ts',
    lang: 'TypeScript',
    code: `// Filename: add_two_numbers.ts
export class ListNode {
  val: number;
  next: ListNode | null = null;
  constructor(val = 0, next = null) { this.val = val; this.next = next; }
}

export function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const dummyHead = new ListNode(0);
  let curr = dummyHead;
  let carry = 0;
  while (l1 !== null || l2 !== null || carry !== 0) {
    const x = l1 ? l1.val : 0;
    const y = l2 ? l2.val : 0;
    const sum = carry + x + y;
    carry = Math.floor(sum / 10);
    curr.next = new ListNode(sum % 10);
    curr = curr.next;
    if (l1) l1 = l1.next;
    if (l2) l2 = l2.next;
  }
  return dummyHead.next;
}`
  },
  {
    id: 'code-88',
    title: 'Word Break DP Check',
    filename: 'word_break.py',
    lang: 'Python',
    code: `# Filename: word_break.py
def word_break(s: str, word_dict: list[str]) -> bool:
    words = set(word_dict)
    dp = [False] * (len(s) + 1)
    dp[0] = True
    for i in range(1, len(s) + 1):
        for j in range(i):
            if dp[j] and s[j:i] in words:
                dp[i] = True
                break
    return dp[len(s)]`
  },
  {
    id: 'code-89',
    title: 'First Unique Character Index',
    filename: 'first_uniq_char.ts',
    lang: 'TypeScript',
    code: `// Filename: first_uniq_char.ts
export function firstUniqChar(s: string): number {
  const countMap: Record<string, number> = {};
  for (const char of s) {
    countMap[char] = (countMap[char] || 0) + 1;
  }
  for (let i = 0; i < s.length; i++) {
    if (countMap[s[i]] === 1) return i;
  }
  return -1;
}`
  },
  {
    id: 'code-90',
    title: 'Find Missing Number in Array',
    filename: 'missing_number.py',
    lang: 'Python',
    code: `# Filename: missing_number.py
def missing_number(nums: list[int]) -> int:
    n = len(nums)
    expected_sum = n * (n + 1) // 2
    actual_sum = sum(nums)
    return expected_sum - actual_sum`
  },
  {
    id: 'code-91',
    title: 'Climbing Stairs DP Ways',
    filename: 'climbing_stairs.ts',
    lang: 'TypeScript',
    code: `// Filename: climbing_stairs.ts
export function climbStairs(n: number): number {
  if (n <= 2) return n;
  let first = 1;
  let second = 2;
  for (let i = 3; i <= n; i++) {
    const third = first + second;
    first = second;
    second = third;
  }
  return second;
}`
  },
  {
    id: 'code-92',
    title: 'Group Anagrams Hash Map',
    filename: 'group_anagrams.py',
    lang: 'Python',
    code: `# Filename: group_anagrams.py
from collections import defaultdict

def group_anagrams(strs: list[str]) -> list[list[str]]:
    ans = defaultdict(list)
    for s in strs:
        count = [0] * 26
        for c in s:
            count[ord(c) - ord('a')] += 1
        ans[tuple(count)].append(s)
    return list(ans.values())`
  },
  {
    id: 'code-93',
    title: 'Kth Largest Element Heap Search',
    filename: 'kth_largest.ts',
    lang: 'TypeScript',
    code: `// Filename: kth_largest.ts
export function findKthLargest(nums: number[], k: number): number {
  nums.sort((a, b) => b - a);
  return nums[k - 1];
}`
  },
  {
    id: 'code-94',
    title: 'Binary Tree Invert Mirror',
    filename: 'invert_binary_tree.py',
    lang: 'Python',
    code: `# Filename: invert_binary_tree.py
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def invert_tree(root: TreeNode) -> TreeNode:
    if not root:
        return None
    root.left, root.right = invert_tree(root.right), invert_tree(root.left)
    return root`
  },
  {
    id: 'code-95',
    title: 'Valid Palindrome Number',
    filename: 'valid_palindrome_num.ts',
    lang: 'TypeScript',
    code: `// Filename: valid_palindrome_num.ts
export function isPalindromeNumber(x: number): boolean {
  if (x < 0) return false;
  const s = x.toString();
  return s === s.split('').reverse().join('');
}`
  },
  {
    id: 'code-96',
    title: 'Single Number Bitwise XOR',
    filename: 'single_number.py',
    lang: 'Python',
    code: `# Filename: single_number.py
def single_number(nums: list[int]) -> int:
    result = 0
    for num in nums:
        result ^= num
    return result`
  },
  {
    id: 'code-97',
    title: 'Sort Array Colors Dutch National Flag',
    filename: 'sort_colors.ts',
    lang: 'TypeScript',
    code: `// Filename: sort_colors.ts
export function sortColors(nums: number[]): void {
  let low = 0, mid = 0, high = nums.length - 1;
  while (mid <= high) {
    if (nums[mid] === 0) {
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low++; mid++;
    } else if (nums[mid] === 1) {
      mid++;
    } else {
      [nums[mid], nums[high]] = [nums[high], nums[mid]];
      high--;
    }
  }
}`
  },
  {
    id: 'code-98',
    title: 'Top K Frequent Elements',
    filename: 'top_k_frequent.py',
    lang: 'Python',
    code: `# Filename: top_k_frequent.py
from collections import Counter

def top_k_frequent(nums: list[int], k: int) -> list[int]:
    count = Counter(nums)
    return [item for item, _ in count.most_common(k)]`
  },
  {
    id: 'code-99',
    title: 'Valid Mountain Array Check',
    filename: 'mountain_array.ts',
    lang: 'TypeScript',
    code: `// Filename: mountain_array.ts
export function validMountainArray(arr: number[]): boolean {
  const n = arr.length;
  let i = 0;
  while (i + 1 < n && arr[i] < arr[i + 1]) i++;
  if (i === 0 || i === n - 1) return false;
  while (i + 1 < n && arr[i] > arr[i + 1]) i++;
  return i === n - 1;
}`
  },
  {
    id: '100',
    title: 'HTML5 UI Web App Structure',
    filename: 'index.html',
    lang: 'HTML',
    code: `// Filename: index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ty-pex Coding Console</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div id="root">
      <main className="console-app"></main>
    </div>
  </body>
</html>`
  }
];

export function getRandomCodeSnippet(): CodeSnippet {
  const index = Math.floor(Math.random() * codeSnippets.length);
  return codeSnippets[index];
}
