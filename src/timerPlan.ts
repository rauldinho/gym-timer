import type { TimerConfig, TimerStep } from './types';

/** Resolves the ordered list of exercise names that make up a single round. */
export function getExerciseNames(config: TimerConfig): string[] {
  if (config.mode === 'exercises') {
    return config.exercisesText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  }

  const count = Math.max(1, config.exercisesPerRound);
  return Array.from({ length: count }, (_, i) => `Exercise ${i + 1}`);
}

/**
 * Turns a TimerConfig into a flat sequence of work/rest steps the timer
 * engine can walk through one at a time. Every workout is modeled as
 * `rounds` × `exercises per round`, with rest between exercises and a
 * (usually longer) rest between rounds.
 */
export function buildPlan(config: TimerConfig): TimerStep[] {
  const steps: TimerStep[] = [];
  const totalRounds = Math.max(1, config.rounds);
  const exerciseNames = getExerciseNames(config);
  const totalExercises = exerciseNames.length;
  const namedExercises = config.mode === 'exercises';

  for (let round = 1; round <= totalRounds; round++) {
    for (let exerciseIndex = 1; exerciseIndex <= totalExercises; exerciseIndex++) {
      const label = namedExercises
        ? exerciseNames[exerciseIndex - 1]
        : totalExercises > 1
          ? `Exercise ${exerciseIndex}`
          : `Round ${round}`;

      steps.push({
        kind: 'work',
        label,
        duration: config.exerciseSeconds,
        round,
        totalRounds,
        exerciseIndex,
        totalExercises,
      });

      const isLastExerciseInRound = exerciseIndex === totalExercises;
      if (!isLastExerciseInRound && config.restBetweenExercises > 0) {
        steps.push({
          kind: 'rest',
          label: 'Rest',
          duration: config.restBetweenExercises,
          round,
          totalRounds,
          exerciseIndex,
          totalExercises,
        });
      }
    }

    const isLastRound = round === totalRounds;
    if (!isLastRound && config.restBetweenRounds > 0) {
      steps.push({
        kind: 'rest',
        label: 'Rest',
        duration: config.restBetweenRounds,
        round,
        totalRounds,
        exerciseIndex: totalExercises,
        totalExercises,
      });
    }
  }

  return steps;
}

export function estimateTotalSeconds(config: TimerConfig): number {
  return buildPlan(config).reduce((sum, step) => sum + step.duration, 0);
}

export function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds}s`;
  if (seconds === 0) return `${minutes}m`;
  return `${minutes}m ${seconds}s`;
}
