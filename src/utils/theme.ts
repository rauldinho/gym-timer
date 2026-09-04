import { DEFAULT_THEME_ID, type Theme } from '../themes';

const THEME_COOKIE = 'hiit-timer-theme';
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

export function saveThemeId(id: string): void {
  try {
    const expires = new Date(Date.now() + ONE_YEAR_MS).toUTCString();
    document.cookie = `${THEME_COOKIE}=${id}; expires=${expires}; path=/; SameSite=Lax`;
  } catch {
    // Cookies unavailable — fail silently.
  }
}

export function loadThemeId(): string {
  try {
    const match = document.cookie.match(new RegExp(`(?:^|; )${THEME_COOKIE}=([^;]*)`));
    return match ? match[1] : DEFAULT_THEME_ID;
  } catch {
    return DEFAULT_THEME_ID;
  }
}

function relativeLuminance(hex: string): number {
  const value = hex.replace('#', '');
  const r = parseInt(value.substring(0, 2), 16) / 255;
  const g = parseInt(value.substring(2, 4), 16) / 255;
  const b = parseInt(value.substring(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Pushes a theme's palette onto CSS custom properties and tints the browser UI. */
export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  root.style.setProperty('--bg', theme.colors.bg);
  root.style.setProperty('--surface', theme.colors.surface);
  root.style.setProperty('--surface-2', theme.colors.surface2);
  root.style.setProperty('--border', theme.colors.border);
  root.style.setProperty('--text', theme.colors.text);
  root.style.setProperty('--muted', theme.colors.muted);
  root.style.setProperty('--work', theme.colors.work);
  root.style.setProperty('--work-strong', theme.colors.workStrong);
  root.style.setProperty('--rest', theme.colors.rest);
  root.style.setProperty('--rest-strong', theme.colors.restStrong);

  const isLight = relativeLuminance(theme.colors.bg) > 0.5;
  root.style.colorScheme = isLight ? 'light' : 'dark';
  root.setAttribute('data-theme', theme.id);

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme.colors.bg);
}
