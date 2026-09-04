import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import type { Screen, TimerConfig, TimerStep } from './types';
import { buildPlan } from './timerPlan';
import { loadConfig, saveConfig } from './utils/cookies';
import { getTheme } from './themes';
import { applyTheme, loadThemeId, saveThemeId } from './utils/theme';
import { primeAudio } from './utils/sound';
import { SetupScreen } from './components/SetupScreen';
import { ReadyScreen } from './components/ReadyScreen';
import { TimerScreen } from './components/TimerScreen';
import { DoneScreen } from './components/DoneScreen';

function App() {
  const [config, setConfig] = useState<TimerConfig>(() => loadConfig());
  const [themeId, setThemeId] = useState<string>(() => loadThemeId());
  const [screen, setScreen] = useState<Screen>('setup');
  const [plan, setPlan] = useState<TimerStep[]>([]);
  const [runKey, setRunKey] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const theme = useMemo(() => getTheme(themeId), [themeId]);

  useLayoutEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const updateConfig = useCallback((next: TimerConfig) => {
    setConfig(next);
    saveConfig(next);
  }, []);

  const updateTheme = useCallback((id: string) => {
    setThemeId(id);
    saveThemeId(id);
  }, []);

  const handleStart = useCallback(() => {
    if (config.mode === 'exercises') {
      const hasExercises = config.exercisesText
        .split('\n')
        .some((line) => line.trim().length > 0);
      if (!hasExercises) {
        setError('Add at least one exercise, one per line.');
        return;
      }
    }
    setError(null);
    setPlan(buildPlan(config));
    setScreen('ready');
  }, [config]);

  const handlePlay = useCallback(() => {
    primeAudio();
    setRunKey((k) => k + 1);
    setScreen('running');
  }, []);

  const handleFinish = useCallback(() => setScreen('done'), []);
  const handleStop = useCallback(() => setScreen('setup'), []);
  const handleRestart = useCallback(() => setScreen('setup'), []);
  const handleBack = useCallback(() => setScreen('setup'), []);

  // Re-mount the timer screen (and its engine) each time a new run starts.
  const timerScreen = useMemo(
    () => (
      <TimerScreen
        key={runKey}
        plan={plan}
        soundEnabled={config.soundEnabled}
        curtainEffect={config.curtainEffect}
        onFinish={handleFinish}
        onStop={handleStop}
      />
    ),
    [runKey, plan, config.soundEnabled, config.curtainEffect, handleFinish, handleStop],
  );

  return (
    <>
      {screen === 'setup' && (
        <SetupScreen
          config={config}
          onChange={updateConfig}
          onStart={handleStart}
          error={error}
          theme={theme}
          onThemeChange={updateTheme}
        />
      )}
      {screen === 'ready' && <ReadyScreen config={config} plan={plan} onPlay={handlePlay} onBack={handleBack} />}
      {screen === 'running' && timerScreen}
      {screen === 'done' && <DoneScreen onRestart={handleRestart} />}
    </>
  );
}

export default App;
