let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;
  if (!ctx) ctx = new AudioCtx();
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

function tone(frequency: number, duration: number, startAt = 0, gainValue = 0.28): void {
  const audioCtx = getContext();
  if (!audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.value = frequency;
    const t0 = audioCtx.currentTime + startAt;
    gain.gain.setValueAtTime(gainValue, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
  } catch {
    // Ignore audio errors (autoplay restrictions, etc.)
  }
}

/** Short tick used during the final 3-second countdown. */
export function playTick(): void {
  tone(440, 0.1);
}

/** Slightly longer tone marking a work/rest transition. */
export function playTransition(): void {
  tone(600, 0.22);
}

/** Celebratory ascending chime played when the whole workout finishes. */
export function playComplete(): void {
  tone(523, 0.16, 0);
  tone(659, 0.16, 0.16);
  tone(784, 0.32, 0.32);
}

/**
 * Creates/resumes the AudioContext inside a real user gesture (e.g. the
 * Play button tap). Mobile Safari mutes audio started outside a gesture,
 * so this should run synchronously in the click handler that starts the timer.
 */
export function primeAudio(): void {
  getContext();
}
