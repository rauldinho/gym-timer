import type { TimerConfig, TimerStep } from '../types';
import { formatDuration } from '../timerPlan';
import { PlayIcon } from './icons';

interface ReadyScreenProps {
  config: TimerConfig;
  plan: TimerStep[];
  onPlay: () => void;
  onBack: () => void;
}

export function ReadyScreen({ config, plan, onPlay, onBack }: ReadyScreenProps) {
  const lastStep = plan[plan.length - 1];
  const totalRounds = lastStep?.totalRounds ?? config.rounds;
  const totalExercises = lastStep?.totalExercises ?? 1;
  const totalSeconds = plan.reduce((sum, s) => sum + s.duration, 0);

  return (
    <div className="screen ready-screen">
      <button type="button" className="link-btn back-btn" onClick={onBack}>
        &larr; Edit
      </button>

      <div className="ready-card">
        <div className="ready-row">
          <span>Rounds</span>
          <strong>{totalRounds}</strong>
        </div>
        <div className="ready-row">
          <span>Exercises / round</span>
          <strong>{totalExercises}</strong>
        </div>
        <div className="ready-row">
          <span>Work</span>
          <strong>{config.exerciseSeconds}s</strong>
        </div>
        <div className="ready-row">
          <span>Rest between exercises</span>
          <strong>{config.restBetweenExercises}s</strong>
        </div>
        <div className="ready-row">
          <span>Rest between rounds</span>
          <strong>{config.restBetweenRounds}s</strong>
        </div>
        <div className="ready-row ready-row-total">
          <span>Total time</span>
          <strong>{formatDuration(totalSeconds)}</strong>
        </div>
      </div>

      <button type="button" className="play-btn" onClick={onPlay} aria-label="Start timer">
        <PlayIcon size={40} />
      </button>
      <p className="ready-hint">Tap play when you're ready</p>
    </div>
  );
}
