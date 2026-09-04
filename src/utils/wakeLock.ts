let sentinel: WakeLockSentinel | null = null;

export async function requestWakeLock(): Promise<void> {
  try {
    if ('wakeLock' in navigator) {
      sentinel = await navigator.wakeLock.request('screen');
    }
  } catch {
    // Wake lock may be denied (e.g. low battery) — non-critical.
  }
}

export function releaseWakeLock(): void {
  if (sentinel) {
    sentinel.release().catch(() => {});
    sentinel = null;
  }
}
