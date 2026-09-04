import { useMemo, useState } from 'react';
import type { ComponentType } from 'react';
import type { CurtainEffect, TimerConfig, TimerMode } from '../types';
import { CURTAIN_EFFECTS } from '../types';
import type { Theme } from '../themes';
import { estimateTotalSeconds, formatDuration } from '../timerPlan';
import { useInstallPrompt } from '../hooks/useInstallPrompt';
import { SegmentedControl } from './SegmentedControl';
import { Stepper } from './Stepper';
import { ThemePicker } from './ThemePicker';
import {
  ClockIcon,
  DownloadIcon,
  EffectDotsIcon,
  EffectSolidIcon,
  EffectStripesIcon,
  EffectWavesIcon,
  PaletteIcon,
  SoundOffIcon,
  SoundOnIcon,
  TimerMark,
} from './icons';

interface SetupScreenProps {
  config: TimerConfig;
  onChange: (config: TimerConfig) => void;
  onStart: () => void;
  error: string | null;
  theme: Theme;
  onThemeChange: (id: string) => void;
}

const MODE_OPTIONS: { value: TimerMode; label: string }[] = [
  { value: 'rounds', label: 'Rounds' },
  { value: 'exercises', label: 'Exercise list' },
];

const EFFECT_ICONS: Record<CurtainEffect, ComponentType<{ size?: number }>> = {
  solid: EffectSolidIcon,
  stripes: EffectStripesIcon,
  waves: EffectWavesIcon,
  dots: EffectDotsIcon,
};

const EFFECT_LABELS: Record<CurtainEffect, string> = {
  solid: 'Solid',
  stripes: 'Stripes',
  waves: 'Waves',
  dots: 'Dots',
};

export function SetupScreen({ config, onChange, onStart, error, theme, onThemeChange }: SetupScreenProps) {
  const totalSeconds = useMemo(() => estimateTotalSeconds(config), [config]);
  const [themeSheetOpen, setThemeSheetOpen] = useState(false);
  const { available: canInstall, promptInstall } = useInstallPrompt();

  const patch = (partial: Partial<TimerConfig>) => onChange({ ...config, ...partial });

  const cycleCurtainEffect = () => {
    const currentIndex = CURTAIN_EFFECTS.indexOf(config.curtainEffect);
    const next = CURTAIN_EFFECTS[(currentIndex + 1) % CURTAIN_EFFECTS.length];
    patch({ curtainEffect: next });
  };

  const EffectIcon = EFFECT_ICONS[config.curtainEffect];

  return (
    <div className="screen setup-screen">
      <div className="setup-scroll">
        <header className="setup-header">
          <div className="brand-row">
            <div className="brand-mark">
              <TimerMark size={30} />
            </div>
            <div className="brand-text">
              <h1>HIIT Timer</h1>
              <p className="subtitle">Build your interval workout</p>
            </div>
            <div className="header-actions">
              <button
                type="button"
                className="icon-toggle-btn"
                onClick={() => patch({ soundEnabled: !config.soundEnabled })}
                aria-label={config.soundEnabled ? 'Mute sound cues' : 'Unmute sound cues'}
                aria-pressed={config.soundEnabled}
              >
                {config.soundEnabled ? <SoundOnIcon size={19} /> : <SoundOffIcon size={19} />}
              </button>
              <button
                type="button"
                className="icon-toggle-btn"
                onClick={cycleCurtainEffect}
                aria-label={`Curtain effect: ${EFFECT_LABELS[config.curtainEffect]} (tap to change)`}
              >
                <EffectIcon size={18} />
              </button>
              {canInstall && (
                <button
                  type="button"
                  className="icon-toggle-btn"
                  onClick={promptInstall}
                  aria-label="Install app"
                >
                  <DownloadIcon size={18} />
                </button>
              )}
            </div>
          </div>

          <div className="header-cards">
            <div className="info-card">
              <span className="info-card-label">
                <ClockIcon size={14} /> Total time
              </span>
              <strong className="info-card-value">{formatDuration(totalSeconds)}</strong>
            </div>

            <button
              type="button"
              className="info-card info-card-btn"
              onClick={() => setThemeSheetOpen(true)}
            >
              <span className="info-card-label">
                <PaletteIcon size={14} /> Theme
              </span>
              <span className="info-card-theme-row">
                <span className="theme-tile-swatches">
                  <span className="swatch" style={{ background: theme.colors.work }} />
                  <span className="swatch" style={{ background: theme.colors.rest }} />
                </span>
                <strong className="info-card-value">{theme.name}</strong>
              </span>
            </button>
          </div>
        </header>

        <SegmentedControl options={MODE_OPTIONS} value={config.mode} onChange={(mode) => patch({ mode })} />

        <Stepper label="Rounds" value={config.rounds} step={1} min={1} onChange={(rounds) => patch({ rounds })} />

        {config.mode === 'rounds' ? (
          <Stepper
            label="Exercises per round"
            value={config.exercisesPerRound}
            step={1}
            min={1}
            onChange={(exercisesPerRound) => patch({ exercisesPerRound })}
          />
        ) : (
          <div className="field">
            <label className="field-label" htmlFor="exercise-list">
              Exercises · one per line
            </label>
            <textarea
              id="exercise-list"
              className="exercise-textarea"
              placeholder={'Burpees\nMountain climbers\nJump squats\nPush ups'}
              value={config.exercisesText}
              onChange={(e) => patch({ exercisesText: e.target.value })}
              rows={6}
            />
          </div>
        )}

        <Stepper
          label="Exercise duration"
          value={config.exerciseSeconds}
          step={5}
          min={5}
          unit="s"
          onChange={(exerciseSeconds) => patch({ exerciseSeconds })}
        />

        <Stepper
          label="Rest between exercises"
          value={config.restBetweenExercises}
          step={5}
          min={0}
          unit="s"
          onChange={(restBetweenExercises) => patch({ restBetweenExercises })}
        />

        <Stepper
          label="Rest between rounds"
          value={config.restBetweenRounds}
          step={5}
          min={0}
          unit="s"
          onChange={(restBetweenRounds) => patch({ restBetweenRounds })}
        />

        {error && <p className="form-error">{error}</p>}
      </div>

      <div className="setup-footer">
        <button type="button" className="btn btn-primary btn-block" onClick={onStart}>
          Start workout
        </button>
      </div>

      <ThemePicker
        open={themeSheetOpen}
        currentId={theme.id}
        onSelect={onThemeChange}
        onClose={() => setThemeSheetOpen(false)}
      />
    </div>
  );
}
