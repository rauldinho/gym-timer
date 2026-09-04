export type TimerMode = 'rounds' | 'exercises';

/** Visual texture applied to the progress curtain — purely cosmetic, independent of theme. */
export type CurtainEffect = 'solid' | 'stripes' | 'waves' | 'dots';

export const CURTAIN_EFFECTS: CurtainEffect[] = ['solid', 'stripes', 'waves', 'dots'];

export interface TimerConfig {
  mode: TimerMode;
  rounds: number;
  /** Used in 'rounds' mode — how many generic exercises make up one round. */
  exercisesPerRound: number;
  exerciseSeconds: number;
  restBetweenExercises: number;
  restBetweenRounds: number;
  /** Used in 'exercises' mode — one exercise name per line. */
  exercisesText: string;
  soundEnabled: boolean;
  curtainEffect: CurtainEffect;
}

export const DEFAULT_CONFIG: TimerConfig = {
  mode: 'rounds',
  rounds: 3,
  exercisesPerRound: 1,
  exerciseSeconds: 30,
  restBetweenExercises: 10,
  restBetweenRounds: 30,
  exercisesText: '',
  soundEnabled: true,
  curtainEffect: 'solid',
};

export type StepKind = 'work' | 'rest' | 'countdown';

export interface TimerStep {
  kind: StepKind;
  label: string;
  duration: number;
  /** 1-based round number this step belongs to. */
  round: number;
  /** Total number of rounds in the plan. */
  totalRounds: number;
  /** 1-based exercise index within the round. */
  exerciseIndex: number;
  /** Total number of exercises per round. */
  totalExercises: number;
}

export type Screen = 'setup' | 'ready' | 'running' | 'done';
