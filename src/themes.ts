export interface ThemeColors {
  bg: string;
  surface: string;
  surface2: string;
  border: string;
  text: string;
  muted: string;
  work: string;
  workStrong: string;
  rest: string;
  restStrong: string;
}

export interface Theme {
  id: string;
  name: string;
  vibe: string;
  colors: ThemeColors;
}

export const THEMES: Theme[] = [
  // ── Dark themes ──
  {
    id: 'midnight',
    name: 'Midnight',
    vibe: 'Classic dark',
    colors: {
      bg: '#0a0e1a',
      surface: '#121a2b',
      surface2: '#1a2438',
      border: '#263349',
      text: '#f2f5fa',
      muted: '#7c8aa3',
      work: '#ff5a52',
      workStrong: '#ff372e',
      rest: '#3fc7e0',
      restStrong: '#1fb3cf',
    },
  },
  {
    id: 'rockero',
    name: 'Rockero',
    vibe: 'Loud & heavy',
    colors: {
      bg: '#0a0a0a',
      surface: '#171313',
      surface2: '#221b1b',
      border: '#3d2f2f',
      text: '#f7f2ea',
      muted: '#9a8f82',
      work: '#e0111f',
      workStrong: '#b8000d',
      rest: '#f2b705',
      restStrong: '#d69e00',
    },
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    vibe: 'Neon night city',
    colors: {
      bg: '#08030f',
      surface: '#140a24',
      surface2: '#1f1038',
      border: '#3d2166',
      text: '#f3ecff',
      muted: '#9c86c9',
      work: '#ff2bd6',
      workStrong: '#d600ac',
      rest: '#26f0ff',
      restStrong: '#00c9d6',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    vibe: 'Deep & fluid',
    colors: {
      bg: '#04121c',
      surface: '#08202e',
      surface2: '#0c2c3e',
      border: '#164b60',
      text: '#eafcff',
      muted: '#74a9bb',
      work: '#00d1b8',
      workStrong: '#00a693',
      rest: '#2f8fd6',
      restStrong: '#1c6fb0',
    },
  },
  // ── Light themes ──
  {
    id: 'zen',
    name: 'Zen',
    vibe: 'Calm & grounded',
    colors: {
      bg: '#f6f3ea',
      surface: '#ffffff',
      surface2: '#ececdf',
      border: '#ddd8c4',
      text: '#2f2b22',
      muted: '#8a8368',
      work: '#5b8c5a',
      workStrong: '#47734a',
      rest: '#c1633b',
      restStrong: '#a34f2c',
    },
  },
  {
    id: 'pop',
    name: 'Pop',
    vibe: 'Bright & fun',
    colors: {
      bg: '#fff5fa',
      surface: '#ffffff',
      surface2: '#ffe3ef',
      border: '#ffc9de',
      text: '#1a1030',
      muted: '#9b7fa8',
      work: '#ff2d78',
      workStrong: '#e0135c',
      rest: '#1fd6c4',
      restStrong: '#14a897',
    },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    vibe: 'Clean & quiet',
    colors: {
      bg: '#ffffff',
      surface: '#f4f4f5',
      surface2: '#e9e9eb',
      border: '#dcdce0',
      text: '#111114',
      muted: '#6b6b70',
      work: '#111114',
      workStrong: '#000000',
      rest: '#5b6472',
      restStrong: '#3f4550',
    },
  },
  {
    id: 'matrix',
    name: 'Matrix',
    vibe: 'Hacker green',
    colors: {
      bg: '#040a04',
      surface: '#0a140a',
      surface2: '#0f1f0f',
      border: '#1f3d1f',
      text: '#d4ffd6',
      muted: '#5f9a63',
      work: '#39ff14',
      workStrong: '#22cc00',
      rest: '#00e6b8',
      restStrong: '#00b892',
    },
  },
  {
    id: 'voltage',
    name: 'Voltage',
    vibe: 'High-vis energy',
    colors: {
      bg: '#0d0d0a',
      surface: '#17170f',
      surface2: '#22221a',
      border: '#3a3a28',
      text: '#fdfbe8',
      muted: '#9a9678',
      work: '#ffd60a',
      workStrong: '#e0b800',
      rest: '#ff9500',
      restStrong: '#cc7a00',
    },
  },
  {
    id: 'contender',
    name: 'Contender',
    vibe: 'Boxing gym grit',
    colors: {
      bg: '#1c1c1c',
      surface: '#262624',
      surface2: '#323230',
      border: '#45443f',
      text: '#f2f0ea',
      muted: '#9c9890',
      work: '#d32f2f',
      workStrong: '#a82222',
      rest: '#3b5bdb',
      restStrong: '#2c46ad',
    },
  },
];

export const DEFAULT_THEME_ID = THEMES[0].id;

export function getTheme(id: string): Theme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}
