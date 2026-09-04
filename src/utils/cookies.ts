import { DEFAULT_CONFIG, type TimerConfig } from '../types';

const COOKIE_NAME = 'hiit-timer-config';
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

export function saveConfig(config: TimerConfig): void {
  try {
    const value = encodeURIComponent(JSON.stringify(config));
    const expires = new Date(Date.now() + ONE_YEAR_MS).toUTCString();
    document.cookie = `${COOKIE_NAME}=${value}; expires=${expires}; path=/; SameSite=Lax`;
  } catch {
    // Cookies unavailable (e.g. private mode) — fail silently.
  }
}

export function loadConfig(): TimerConfig {
  try {
    const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
    if (!match) return { ...DEFAULT_CONFIG };
    const parsed = JSON.parse(decodeURIComponent(match[1]));
    return { ...DEFAULT_CONFIG, ...parsed };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}
