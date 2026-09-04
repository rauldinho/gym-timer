import { useCallback, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import type { TimerStep } from '../types';
import { playComplete, playTick, playTransition } from '../utils/sound';
import { releaseWakeLock, requestWakeLock } from '../utils/wakeLock';

interface Engine {
  stepIndex: number;
  stepStart: number;
  pausedElapsed: number;
  paused: boolean;
  lastBeepSecond: number | null;
  rafId: number | null;
  plan: TimerStep[];
}

export interface UseTimerResult {
  step: TimerStep | undefined;
  stepIndex: number;
  remaining: number;
  paused: boolean;
  finished: boolean;
  /** Mutable ref holding the current step's elapsed fraction (0..1), updated every animation frame. */
  progressRef: RefObject<number>;
  togglePause: () => void;
  skip: () => void;
  stop: () => void;
}

/**
 * Drives a workout plan forward using requestAnimationFrame so the
 * countdown and progress fill stay smooth and battery-friendly.
 * `progressRef` is intentionally NOT reactive state — consumers should
 * read it inside their own rAF loop to animate the background fill
 * without triggering React re-renders on every frame.
 */
export function useTimer(plan: TimerStep[], soundEnabled: boolean): UseTimerResult {
  const [stepIndex, setStepIndex] = useState(0);
  const [remaining, setRemaining] = useState(plan[0]?.duration ?? 0);
  const [paused, setPaused] = useState(false);
  const [finished, setFinished] = useState(false);

  const progressRef = useRef(0);
  const soundEnabledRef = useRef(soundEnabled);
  const engineRef = useRef<Engine>({
    stepIndex: 0,
    stepStart: 0,
    pausedElapsed: 0,
    paused: false,
    lastBeepSecond: null,
    rafId: null,
    plan,
  });

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    const engine = engineRef.current;
    engine.plan = plan;
    engine.stepIndex = 0;
    engine.pausedElapsed = 0;
    engine.stepStart = performance.now();
    engine.paused = false;
    engine.lastBeepSecond = null;
    progressRef.current = 0;

    setStepIndex(0);
    setRemaining(plan[0]?.duration ?? 0);
    setPaused(false);
    setFinished(false);

    function loop() {
      const currentStep = engine.plan[engine.stepIndex];
      if (!currentStep) return;

      if (!engine.paused) {
        const totalMs = currentStep.duration * 1000;
        const elapsed = engine.pausedElapsed + (performance.now() - engine.stepStart);
        const remainingSeconds = Math.max(0, Math.ceil((totalMs - elapsed) / 1000));

        progressRef.current = Math.min(1, elapsed / totalMs);

        setRemaining((prev) => (prev !== remainingSeconds ? remainingSeconds : prev));

        if (remainingSeconds <= 3 && remainingSeconds > 0 && engine.lastBeepSecond !== remainingSeconds) {
          engine.lastBeepSecond = remainingSeconds;
          if (soundEnabledRef.current) playTick();
        }

        if (elapsed >= totalMs) {
          const nextIndex = engine.stepIndex + 1;
          const nextStep = engine.plan[nextIndex];

          if (!nextStep) {
            if (soundEnabledRef.current) playComplete();
            releaseWakeLock();
            setFinished(true);
            return;
          }

          if (soundEnabledRef.current) playTransition();
          engine.stepIndex = nextIndex;
          engine.pausedElapsed = 0;
          engine.stepStart = performance.now();
          engine.lastBeepSecond = null;
          progressRef.current = 0;
          setStepIndex(nextIndex);
          setRemaining(nextStep.duration);
        }
      }

      engine.rafId = requestAnimationFrame(loop);
    }

    requestWakeLock();
    engine.rafId = requestAnimationFrame(loop);

    return () => {
      if (engine.rafId !== null) cancelAnimationFrame(engine.rafId);
      releaseWakeLock();
    };
    // `plan` is created fresh each time a workout starts, so this effect
    // intentionally re-runs (and resets the engine) only when that happens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan]);

  const togglePause = useCallback(() => {
    const engine = engineRef.current;
    if (engine.paused) {
      engine.stepStart = performance.now();
      engine.paused = false;
      setPaused(false);
    } else {
      engine.pausedElapsed += performance.now() - engine.stepStart;
      engine.paused = true;
      setPaused(true);
    }
  }, []);

  const skip = useCallback(() => {
    const engine = engineRef.current;
    const nextIndex = engine.stepIndex + 1;
    const nextStep = engine.plan[nextIndex];

    if (!nextStep) {
      if (engine.rafId !== null) cancelAnimationFrame(engine.rafId);
      releaseWakeLock();
      progressRef.current = 1;
      setFinished(true);
      return;
    }

    engine.stepIndex = nextIndex;
    engine.pausedElapsed = 0;
    engine.stepStart = performance.now();
    engine.paused = false;
    engine.lastBeepSecond = null;
    progressRef.current = 0;
    setStepIndex(nextIndex);
    setRemaining(nextStep.duration);
    setPaused(false);
  }, []);

  const stop = useCallback(() => {
    const engine = engineRef.current;
    if (engine.rafId !== null) cancelAnimationFrame(engine.rafId);
    releaseWakeLock();
  }, []);

  return {
    step: plan[stepIndex],
    stepIndex,
    remaining,
    paused,
    finished,
    progressRef,
    togglePause,
    skip,
    stop,
  };
}
