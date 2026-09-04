import { useEffect, useRef } from 'react';
import type { CurtainEffect, TimerStep } from '../types';
import { useTimer } from '../hooks/useTimer';
import { PauseIcon, PlayIcon, SkipIcon, StopIcon } from './icons';

interface TimerScreenProps {
  plan: TimerStep[];
  soundEnabled: boolean;
  curtainEffect: CurtainEffect;
  onFinish: () => void;
  onStop: () => void;
}

export function TimerScreen({ plan, soundEnabled, curtainEffect, onFinish, onStop }: TimerScreenProps) {
  const { step, remaining, paused, finished, progressRef, togglePause, skip, stop } = useTimer(plan, soundEnabled);
  const fillRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  // Drive the bottom-to-top fill directly via the DOM so it stays smooth
  // regardless of React's render cadence.
  useEffect(() => {
    function paint() {
      if (fillRef.current) {
        fillRef.current.style.height = `${Math.min(100, progressRef.current * 100)}%`;
      }
      rafRef.current = requestAnimationFrame(paint);
    }
    rafRef.current = requestAnimationFrame(paint);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [progressRef]);

  useEffect(() => {
    if (finished) onFinish();
  }, [finished, onFinish]);

  if (!step) return null;

  const phaseClass =
    step.kind === 'work' ? 'phase-work' : step.kind === 'rest' ? 'phase-rest' : 'phase-countdown';
  const phaseLabel = step.kind === 'work' ? 'Work' : step.kind === 'rest' ? 'Rest' : 'Get Ready';
  const nameText = step.kind === 'rest' ? '' : step.label;
  const showRound = step.totalRounds > 1;
  const showExercise = step.totalExercises > 1;

  const progressParts: string[] = [];
  if (showRound) progressParts.push(`Round ${step.round} of ${step.totalRounds}`);
  if (showExercise) progressParts.push(`Exercise ${step.exerciseIndex} of ${step.totalExercises}`);

  const handleStop = () => {
    stop();
    onStop();
  };

  return (
    <div className={`screen timer-screen ${phaseClass}`}>
      <div className="timer-fill-track">
        <div ref={fillRef} className="timer-fill">
          <div className={`fill-pattern fill-pattern-${curtainEffect}`} />
        </div>
      </div>

      <div className="timer-content">
        <span className="phase-pill">{phaseLabel}</span>
        <div className="timer-readout">
          <h2 className="exercise-name">{nameText}</h2>
          <div className="countdown" aria-live="polite">
            {remaining}
          </div>
          {progressParts.length > 0 && <p className="progress-label">{progressParts.join(' · ')}</p>}
        </div>
      </div>

      <div className="timer-controls">
        <button type="button" className="control-btn" onClick={skip} aria-label="Skip">
          <SkipIcon />
        </button>
        <button
          type="button"
          className="control-btn control-btn-primary"
          onClick={togglePause}
          aria-label={paused ? 'Resume' : 'Pause'}
        >
          {paused ? <PlayIcon size={26} /> : <PauseIcon />}
        </button>
        <button type="button" className="control-btn" onClick={handleStop} aria-label="Stop">
          <StopIcon />
        </button>
      </div>
    </div>
  );
}
